<?php

namespace App\Services;

use App\Enums\AssignmentType;
use App\Enums\TicketStatus;
use App\Exceptions\TicketConflictException;
use App\Models\AgentTicket;
use App\Models\Ticket;
use App\Models\User;

class TicketWorkflowService
{
    /** @return list<TicketStatus> */
    public function allowedTransitions(TicketStatus $from): array
    {
        return match ($from) {
            TicketStatus::Open => [TicketStatus::InProgress],
            TicketStatus::InProgress => [TicketStatus::WaitingForCustomer, TicketStatus::Resolved],
            TicketStatus::WaitingForCustomer => [TicketStatus::InProgress, TicketStatus::Resolved],
            TicketStatus::Resolved => [],
        };
    }

    public function canTransition(TicketStatus $from, TicketStatus $to): bool
    {
        return in_array($to, $this->allowedTransitions($from), true);
    }

    public function assertClaimable(Ticket $ticket): void
    {
        if ($ticket->agent_id !== null) {
            throw new TicketConflictException('This ticket has already been claimed.');
        }

        if (! $this->canTransition($ticket->status, TicketStatus::InProgress)) {
            throw new TicketConflictException('This ticket cannot be claimed in its current status.');
        }
    }

    public function assertAssignable(Ticket $ticket, User $agent): void
    {
        if ($ticket->status === TicketStatus::Resolved) {
            throw new TicketConflictException('Resolved tickets cannot be assigned.');
        }

        if ($ticket->agent_id === $agent->id) {
            throw new TicketConflictException('This ticket is already assigned to that agent.');
        }
    }

    public function applyAssignment(
        Ticket $ticket,
        User $agent,
        User $actor,
        AssignmentType $type,
        ?string $reason = null,
    ): Ticket {
        $now = now();

        AgentTicket::query()
            ->where('ticket_id', $ticket->id)
            ->whereNull('unassigned_at')
            ->update(['unassigned_at' => $now, 'current_agent' => null]);

        AgentTicket::create([
            'ticket_id' => $ticket->id,
            'agent_id' => $agent->id,
            'assigned_by' => $actor->id,
            'assigned_type' => $type,
            'reason' => $reason,
            'assigned_at' => $now,
            'current_agent' => $agent->id,
        ]);

        $ticket->agent_id = $agent->id;
        $ticket->status = $this->statusAfterAssignment($ticket);
        $ticket->save();

        return $ticket;
    }

    private function statusAfterAssignment(Ticket $ticket): TicketStatus
    {
        return $ticket->status === TicketStatus::Open
            ? TicketStatus::InProgress
            : $ticket->status;
    }
}
