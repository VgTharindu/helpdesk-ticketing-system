<?php

namespace App\Handlers\Ticket;

use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\User;
use App\Services\TicketNotificationService;
use App\Services\TicketWorkflowService;
use Illuminate\Support\Facades\DB;

class CreateReplyHandler
{
    public function __construct(
        private readonly TicketWorkflowService $workflow,
        private readonly TicketNotificationService $notifications,
    ) {
    }

    public function handle(Ticket $ticket, User $author, string $message): TicketReply
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
}
