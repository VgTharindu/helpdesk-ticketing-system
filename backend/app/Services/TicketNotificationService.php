<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Mail\AgentRepliedMail;
use App\Mail\CustomerRepliedMail;
use App\Mail\NewTicketForSupportMail;
use App\Mail\TicketAssignedMail;
use App\Mail\TicketCreatedMail;
use App\Mail\TicketResolvedMail;
use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\TicketReminderAgentMail;
use App\Mail\TicketReminderCustomerMail;

class TicketNotificationService
{
    public function ticketCreated(Ticket $ticket): void
    {
        Mail::to($ticket->customer)->send(new TicketCreatedMail($ticket));

        foreach (User::role(UserRole::Agent->value)->get() as $agent) {
            Mail::to($agent)->send(new NewTicketForSupportMail($ticket, $agent));
        }
    }

    public function ticketAssigned(Ticket $ticket, User $agent): void
    {
        Mail::to($agent)->send(new TicketAssignedMail($ticket, $agent));
    }

    public function customerReplied(TicketReply $reply): void
    {
        $agent = $reply->ticket->agent;

        if ($agent === null) {
            return;
        }

        Mail::to($agent)->send(new CustomerRepliedMail($reply));
    }

    public function agentReplied(TicketReply $reply): void
    {
        Mail::to($reply->ticket->customer)->send(new AgentRepliedMail($reply));
    }

    public function ticketResolved(Ticket $ticket): void
    {
        Mail::to($ticket->customer)->send(new TicketResolvedMail($ticket));
    }

        public function reminderForAgent(Ticket $ticket): void
    {
        Mail::to($ticket->agent)->send(new TicketReminderAgentMail($ticket));
    }

    public function reminderForCustomer(Ticket $ticket): void
    {
        Mail::to($ticket->customer)->send(new TicketReminderCustomerMail($ticket));
    }
}
