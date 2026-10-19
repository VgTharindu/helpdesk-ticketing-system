<?php

namespace App\Handlers\Ticket;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;

class ListTicketAssignmentsHandler
{
    public function handle(Ticket $ticket): Collection
    {
        return $ticket->assignments()
            ->with(['agent', 'assignedBy'])
            ->orderBy('assigned_at')
            ->orderBy('id')
            ->get();
    }
}
