<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Notifications\Concerns\BroadcastsStoredData;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewTicketForSupport extends Notification implements ShouldQueue
{
    use BroadcastsStoredData, Queueable;

    public function __construct(public Ticket $ticket) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function broadcastType(): string
    {
        return 'new_ticket';
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_ticket',
            'ticket_id' => $this->ticket->id,
            'ticket_subject' => $this->ticket->subject,
            'author_name' => $this->ticket->customer->name,
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("New ticket #{$this->ticket->id}: {$this->ticket->subject}")
            ->markdown('mail.tickets.new-for-support', [
                'ticket' => $this->ticket,
                'agent' => $notifiable,
            ]);
    }
}
