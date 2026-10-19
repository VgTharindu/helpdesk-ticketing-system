<?php

namespace App\Handlers\Ticket;

use App\Models\Ticket;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Activitylog\Models\Activity;

class ListTicketHistoryHandler
{
    public function handle(Ticket $ticket): Collection
    {
        return Activity::query()
            ->where('subject_type', Ticket::class)
            ->where('subject_id', $ticket->getKey())
            ->with(['subject', 'causer'])
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();
    }
}
