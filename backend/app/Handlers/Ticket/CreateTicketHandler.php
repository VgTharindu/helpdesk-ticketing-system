<?php

namespace App\Handlers\Ticket;

use App\Models\Ticket;
use App\Models\User;
use App\Services\TicketNotificationService;

class CreateTicketHandler
{
    public function __construct(private readonly TicketNotificationService $notifications)
    {
    }

    public function handle(User $customer, array $data): Ticket
    {
        $ticket = Ticket::create([
            'customer_id' => $customer->id,   // taken from the logged-in user, never from the request
            'subject' => $data['subject'],
            'description' => $data['description'],
            'priority' => $data['priority'],
        ]);

        $ticket->load(['customer', 'agent']);

        $this->notifications->ticketCreated($ticket);

        return $ticket;
    }
}
