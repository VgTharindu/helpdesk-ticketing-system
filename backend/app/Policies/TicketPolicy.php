<?php

namespace App\Policies;

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
}
