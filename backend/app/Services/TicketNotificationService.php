<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Mail\TicketReminderAgentMail;
use App\Mail\TicketReminderCustomerMail;
use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\User;
use App\Notifications\AgentReplied;
use App\Notifications\CustomerReplied;
use App\Notifications\NewTicketForSupport;
use App\Notifications\TicketAssigned;
use App\Notifications\TicketCreated;
use App\Notifications\TicketResolved;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class TicketNotificationService
{
    public function ticketCreated(Ticket $ticket): void
    {
        $ticket->customer->notify(new TicketCreated($ticket));

        $agents = User::role(UserRole::Agent->value)->get();

        Notification::send($agents, new NewTicketForSupport($ticket));
    }

    public function ticketAssigned(Ticket $ticket, User $agent): void
    {
        $agent->notify(new TicketAssigned($ticket));
    }

    public function customerReplied(TicketReply $reply): void
    {
        $agent = $reply->ticket->agent;

        if ($agent === null) {
            return;
        }

        $agent->notify(new CustomerReplied($reply));
    }

    public function agentReplied(TicketReply $reply): void
    {
        $reply->ticket->customer->notify(new AgentReplied($reply));
    }

    public function ticketResolved(Ticket $ticket): void
    {
        $ticket->customer->notify(new TicketResolved($ticket));
    }

    // Reminders stay email only: a daily nudge is not an in-app event
    public function reminderForAgent(Ticket $ticket): void
    {
        Mail::to($ticket->agent)->send(new TicketReminderAgentMail($ticket));
    }

    public function reminderForCustomer(Ticket $ticket): void
    {
        Mail::to($ticket->customer)->send(new TicketReminderCustomerMail($ticket));
    }
}
