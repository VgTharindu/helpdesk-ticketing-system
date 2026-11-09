<?php

namespace App\Notifications;

use App\Models\TicketReply;
use App\Notifications\Concerns\BroadcastsStoredData;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class CustomerReplied extends Notification implements ShouldQueue
{
    use BroadcastsStoredData, Queueable;

    public function __construct(public TicketReply $reply) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function broadcastType(): string
    {
        return 'ticket_replied';
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'ticket_replied',
            'ticket_id' => $this->reply->ticket_id,
            'ticket_subject' => $this->reply->ticket->subject,
            'author_name' => $this->reply->user->name,
            'preview' => Str::limit($this->reply->message, 80),
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Customer replied on ticket #{$this->reply->ticket_id}")
            ->markdown('mail.tickets.customer-replied', ['reply' => $this->reply]);
    }
}
