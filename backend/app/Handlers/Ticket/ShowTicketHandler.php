<?php

namespace App\Handlers\Ticket;

use App\Models\Ticket;

class ShowTicketHandler
{
    public function handle(Ticket $ticket): Ticket
    {
        return $ticket->load(['customer', 'agent']);
    }
}
