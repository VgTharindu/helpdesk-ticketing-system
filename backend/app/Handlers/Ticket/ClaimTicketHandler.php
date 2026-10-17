<?php

namespace App\Handlers\Ticket;

use App\Enums\AssignmentType;
use App\Models\Ticket;
use App\Models\User;
use App\Services\TicketWorkflowService;
use Illuminate\Support\Facades\DB;

class ClaimTicketHandler
{
    public function __construct(private readonly TicketWorkflowService $workflow)
    {
    }

    public function handle(Ticket $ticket, User $agent): Ticket
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
}
