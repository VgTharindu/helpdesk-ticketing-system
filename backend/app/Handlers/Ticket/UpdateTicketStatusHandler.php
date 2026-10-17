<?php

namespace App\Handlers\Ticket;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Services\TicketWorkflowService;
use Illuminate\Support\Facades\DB;

class UpdateTicketStatusHandler
{
    public function __construct(private readonly TicketWorkflowService $workflow)
    {
    }

    public function handle(Ticket $ticket, TicketStatus $status): Ticket
    {
        return DB::transaction(function () use ($ticket, $status) {
            $locked = Ticket::query()
                ->whereKey($ticket->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            $this->workflow->assertCanChangeStatus($locked, $status);
            $this->workflow->changeStatus($locked, $status);

            return $locked->load(['customer', 'agent']);
        });
    }
}
