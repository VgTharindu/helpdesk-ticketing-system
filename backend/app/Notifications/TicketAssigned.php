<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Notifications\Concerns\BroadcastsStoredData;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketAssigned extends Notification implements ShouldQueue
{
    use BroadcastsStoredData, Queueable;

    public function __construct(public Ticket $ticket) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function broadcastType(): string
    {
        return 'ticket_assigned';
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'ticket_assigned',
            'ticket_id' => $this->ticket->id,
            'ticket_subject' => $this->ticket->subject,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Ticket #{$this->ticket->id} was assigned to you")
            ->markdown('mail.tickets.assigned', [
                'ticket' => $this->ticket,
                'agent' => $notifiable,
            ]);
    }
}
