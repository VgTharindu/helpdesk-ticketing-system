<?php

namespace App\Policies;

use App\Enums\PermissionName;
use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function view(User $user, Ticket $ticket): bool
    {
        return Ticket::query()
            ->visibleTo($user)
            ->whereKey($ticket->getKey())
            ->exists();
    }

      public function reply(User $user, Ticket $ticket): bool
    {
        if ($user->can(PermissionName::ClaimTickets->value)) {
            return $ticket->agent_id === $user->id;
        }

        return $ticket->customer_id === $user->id;
    }

    public function changeStatus(User $user, Ticket $ticket): bool
    {
        if ($user->can(PermissionName::ViewAllTickets->value)) {
            return true;
        }

        if ($user->can(PermissionName::ClaimTickets->value)) {
            return $ticket->agent_id === $user->id;
        }

        return false;
    }
}
