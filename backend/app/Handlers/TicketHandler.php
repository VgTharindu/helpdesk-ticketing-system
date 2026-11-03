<?php

namespace App\Handlers;

use App\Enums\AssignmentType;
use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\TicketReply;
use App\Models\User;
use App\Services\TicketAttachmentService;
use App\Services\TicketNotificationService;
use App\Services\TicketWorkflowService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\Activitylog\Models\Activity;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Symfony\Component\HttpFoundation\StreamedResponse;

// Ticket business logic (used by TicketController and the tickets:send-reminders command)
class TicketHandler
{
    public function __construct(
        private readonly TicketWorkflowService $workflow,
        private readonly TicketNotificationService $notifications,
        private readonly TicketAttachmentService $attachments,
    ) {}

    // List & Show

    // Index: tickets the user can see, with filters, sorting and pagination
    public function index(User $user, array $query = [], int $perPage = 15): LengthAwarePaginator
    {
        return QueryBuilder::for(Ticket::query()->visibleTo($user), new Request($query))
            ->with(['customer', 'agent'])
            ->allowedFilters(
                AllowedFilter::exact('status'),
                AllowedFilter::exact('priority'),
                AllowedFilter::callback('assigned', function (Builder $builder, $value) use ($user) {
                    if ($value === 'me') {
                        $builder->where('agent_id', $user->id);
                    } else {
                        $builder->whereNull('agent_id');
                    }
                }),
                AllowedFilter::callback('search', function (Builder $builder, $value) {
                    $builder->where(function (Builder $q) use ($value) {
                        $q->where('subject', 'like', "%{$value}%")
                            ->orWhere('description', 'like', "%{$value}%");
                    });
                }),
            )
            ->allowedSorts('created_at', 'updated_at')
            ->defaultSort('-created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    // Show: one ticket with its customer, agent and attachments
    public function show(Ticket $ticket): Ticket
    {
        return $ticket->load(['customer', 'agent', 'attachments']);
    }

    // Create

    // Store: create a ticket with its attachments, then send the emails
    public function store(User $customer, array $data): Ticket
    {
        // Ticket and its attachments are saved together, or not at all
        $ticket = DB::transaction(function () use ($customer, $data) {
            $ticket = Ticket::create([
                'customer_id' => $customer->id,   // taken from the logged-in user, never from the request
                'subject' => $data['subject'],
                'description' => $data['description'],
                'priority' => $data['priority'],
            ]);

            $this->attachments->storeMany($ticket, $customer, $data['attachments'] ?? []);

            return $ticket;
        });

        $ticket->load(['customer', 'agent', 'attachments']);

        // Emails are sent only after the transaction is committed
        $this->notifications->ticketCreated($ticket);

        return $ticket;
    }

    // Attachments

    // Download attachment: stream the file from the disk it was saved on
    public function downloadAttachment(TicketAttachment $attachment): StreamedResponse
    {
        // Read from the disk the file was saved on (local or r2)
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk($attachment->disk);

        abort_unless($disk->exists($attachment->path), 404, 'File not found.');

        return $disk->download($attachment->path, $attachment->original_name, [
            'Content-Type' => $attachment->mime_type,
        ]);
    }

    // Assignment actions (claim / assign)

    // Claim: an agent takes an unassigned ticket
    public function claim(Ticket $ticket, User $agent): Ticket
    {
        return DB::transaction(function () use ($ticket, $agent) {
            $locked = Ticket::query()
                ->whereKey($ticket->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            $this->workflow->assertClaimable($locked);

            $this->workflow->applyAssignment($locked, $agent, $agent, AssignmentType::Claim);

            return $locked->load(['customer', 'agent']);
        });
    }

    // Assign: an admin assigns or reassigns a ticket to an agent
    public function assign(Ticket $ticket, int $agentId, User $admin, ?string $reason = null): Ticket
    {
        $agent = User::findOrFail($agentId);

        $assigned = DB::transaction(function () use ($ticket, $agent, $admin, $reason) {
            $locked = Ticket::query()
                ->whereKey($ticket->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            $this->workflow->assertAssignable($locked, $agent);

            $type = $locked->agent_id === null
                ? AssignmentType::Assigned
                : AssignmentType::Reassigned;

            $this->workflow->applyAssignment($locked, $agent, $admin, $type, $reason);

            return $locked->load(['customer', 'agent']);
        });

        $this->notifications->ticketAssigned($assigned, $agent);

        return $assigned;
    }

    // Assignments: assignment history of a ticket (staff only)
    public function assignments(Ticket $ticket): Collection
    {
        return $ticket->assignments()
            ->with(['agent', 'assignedBy'])
            ->orderBy('assigned_at')
            ->orderBy('id')
            ->get();
    }

    // Status

    // Update status: move the ticket to a new status (resolved sends an email)
    public function updateStatus(Ticket $ticket, TicketStatus $status): Ticket
    {
        $updated = DB::transaction(function () use ($ticket, $status) {
            $locked = Ticket::query()
                ->whereKey($ticket->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            $this->workflow->assertCanChangeStatus($locked, $status);
            $this->workflow->changeStatus($locked, $status);

            return $locked->load(['customer', 'agent']);
        });

        if ($status === TicketStatus::Resolved) {
            $this->notifications->ticketResolved($updated);
        }

        return $updated;
    }

    // History: status changes of a ticket from the activity log
    public function history(Ticket $ticket): Collection
    {
        return Activity::query()
            ->where('subject_type', Ticket::class)
            ->where('subject_id', $ticket->getKey())
            ->with(['subject', 'causer'])
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();
    }

    // Replies (conversation)

    // Replies: the conversation of a ticket, oldest first
    public function replies(Ticket $ticket): Collection
    {
        return $ticket->replies()
            ->with('user.roles')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();
    }

    // Store reply: add a reply, update the status if needed, then email the other side
    public function storeReply(Ticket $ticket, User $author, string $message): TicketReply
    {
        $reply = DB::transaction(function () use ($ticket, $author, $message) {
            $locked = Ticket::query()
                ->whereKey($ticket->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            $this->workflow->assertCanReply($locked);

            $reply = TicketReply::create([
                'ticket_id' => $locked->id,
                'user_id' => $author->id,
                'message' => $message,
            ]);

            if ($author->id === $locked->customer_id) {
                $this->workflow->applyCustomerReply($locked);
            } else {
                $locked->touch();
            }

            return $reply->load('user.roles');
        });

        if ($author->id === $reply->ticket->customer_id) {
            $this->notifications->customerReplied($reply);
        } else {
            $this->notifications->agentReplied($reply);
        }

        return $reply;
    }

    // Reminders (daily scheduled command)

    // Send reminders: email agents and customers about tickets with no update for a while
    public function sendReminders(int $staleAfterHours = 24): array
    {
        $threshold = now()->subHours($staleAfterHours);

        return [
            'agent_reminders' => $this->remindAssignedAgents($threshold),
            'customer_reminders' => $this->remindWaitingCustomers($threshold),
        ];
    }

    private function remindAssignedAgents(Carbon $threshold): int
    {
        $count = 0;

        Ticket::query()
            ->with(['customer', 'agent'])
            ->where('status', TicketStatus::InProgress->value)
            ->whereNotNull('agent_id')
            ->where('updated_at', '<=', $threshold)
            ->each(function (Ticket $ticket) use (&$count) {
                $this->notifications->reminderForAgent($ticket);
                $count++;
            });

        return $count;
    }

    private function remindWaitingCustomers(Carbon $threshold): int
    {
        $count = 0;

        Ticket::query()
            ->with(['customer', 'agent'])
            ->where('status', TicketStatus::WaitingForCustomer->value)
            ->where('updated_at', '<=', $threshold)
            ->each(function (Ticket $ticket) use (&$count) {
                $this->notifications->reminderForCustomer($ticket);
                $count++;
            });

        return $count;
    }
}
