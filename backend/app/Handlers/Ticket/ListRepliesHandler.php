<?php

namespace App\Handlers\Ticket;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;

class ListRepliesHandler
{
    public function handle(Ticket $ticket): Collection
    {
        return $ticket->replies()
            ->with('user.roles')
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();
    }
}
