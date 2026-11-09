<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Notifications\Concerns\BroadcastsStoredData;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketResolved extends Notification implements ShouldQueue
{
    use BroadcastsStoredData, Queueable;

    public function __construct(public Ticket $ticket) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function broadcastType(): string
    {
        return 'ticket_resolved';
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'ticket_resolved',
            'ticket_id' => $this->ticket->id,
            'ticket_subject' => $this->ticket->subject,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Your ticket #{$this->ticket->id} was resolved")
            ->markdown('mail.tickets.resolved', ['ticket' => $this->ticket]);
    }
}
