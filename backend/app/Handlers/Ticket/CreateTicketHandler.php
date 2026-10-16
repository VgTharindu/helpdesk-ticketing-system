<?php

namespace App\Handlers\Ticket;

use App\Models\Ticket;
use App\Models\User;

class CreateTicketHandler
{
    public function handle(User $customer, array $data): Ticket
    {
        $ticket = Ticket::create([
            'customer_id' => $customer->id,      // login වූ user ගෙන්, request එකෙන් නෙවෙයි
            'subject' => $data['subject'],
            'description' => $data['description'],
            'priority' => $data['priority'],
        ]);

        return $ticket->load(['customer', 'agent']);
    }
}
