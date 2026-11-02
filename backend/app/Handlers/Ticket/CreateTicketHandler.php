<?php

namespace App\Handlers\Ticket;

use App\Models\Ticket;
use App\Models\User;
use App\Services\TicketAttachmentService;
use App\Services\TicketNotificationService;
use Illuminate\Support\Facades\DB;

class CreateTicketHandler
{
    public function __construct(
        private readonly TicketNotificationService $notifications,
        private readonly TicketAttachmentService $attachments,
    ) {}

    public function handle(User $customer, array $data): Ticket
    {
        // Ticket and its attachments are saved together, or not at all
        $ticket = DB::transaction(function () use ($customer, $data) {
            $ticket = Ticket::create([
                'customer_id' => $customer->id,   // taken from the logged-in user, never from the request
                'subject' => $data['subject'],
                'description' => $data['description'],
                'priority' => $data['priority'],
            ]);

            $this->attachments->storeMany($ticket, $customer, $data['attachments'] ?? []);

            return $ticket;
        });

        $ticket->load(['customer', 'agent', 'attachments']);

        // Emails are sent only after the transaction is committed
        $this->notifications->ticketCreated($ticket);

        return $ticket;
    }
}
