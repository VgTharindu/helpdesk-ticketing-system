<?php

namespace App\Mail;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewTicketForSupportMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Ticket $ticket, public User $agent)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New ticket #{$this->ticket->id}: {$this->ticket->subject}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.tickets.new-for-support',
        );
    }
}
