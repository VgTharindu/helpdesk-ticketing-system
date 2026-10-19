<?php

namespace App\Mail;

use App\Models\TicketReply;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgentRepliedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public TicketReply $reply)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New reply on your ticket #{$this->reply->ticket_id}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.tickets.agent-replied',
        );
    }
}
