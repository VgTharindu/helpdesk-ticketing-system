<?php

namespace App\Handlers\Ticket;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Services\TicketNotificationService;
use App\Services\TicketWorkflowService;
use Illuminate\Support\Facades\DB;

class UpdateTicketStatusHandler
{
    public function __construct(
        private readonly TicketWorkflowService $workflow,
        private readonly TicketNotificationService $notifications,
    ) {
    }

    public function handle(Ticket $ticket, TicketStatus $status): Ticket
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
}
