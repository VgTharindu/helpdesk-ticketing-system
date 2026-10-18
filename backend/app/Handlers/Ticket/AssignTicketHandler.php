<?php

namespace App\Handlers\Ticket;

use App\Enums\AssignmentType;
use App\Models\Ticket;
use App\Models\User;
use App\Services\TicketNotificationService;
use App\Services\TicketWorkflowService;
use Illuminate\Support\Facades\DB;

class AssignTicketHandler
{
    public function __construct(
        private readonly TicketWorkflowService $workflow,
        private readonly TicketNotificationService $notifications,
    ) {
    }

    public function handle(Ticket $ticket, int $agentId, User $admin, ?string $reason = null): Ticket
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
}
