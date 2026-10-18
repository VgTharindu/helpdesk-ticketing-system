<?php

namespace App\Handlers\Ticket;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Services\TicketNotificationService;
use Illuminate\Support\Carbon;

class SendTicketRemindersHandler
{
    public function __construct(private readonly TicketNotificationService $notifications)
    {
    }

    public function handle(int $staleAfterHours = 24): array
    {
        $threshold = now()->subHours($staleAfterHours);

        return [
            'agent_reminders' => $this->remindAssignedAgents($threshold),
            'customer_reminders' => $this->remindWaitingCustomers($threshold),
        ];
    }

    private function remindAssignedAgents(Carbon $threshold): int
    {
        $count = 0;

        Ticket::query()
            ->with(['customer', 'agent'])
            ->where('status', TicketStatus::InProgress->value)
            ->whereNotNull('agent_id')
            ->where('updated_at', '<=', $threshold)
            ->each(function (Ticket $ticket) use (&$count) {
                $this->notifications->reminderForAgent($ticket);
                $count++;
            });

        return $count;
    }

    private function remindWaitingCustomers(Carbon $threshold): int
    {
        $count = 0;

        Ticket::query()
            ->with(['customer', 'agent'])
            ->where('status', TicketStatus::WaitingForCustomer->value)
            ->where('updated_at', '<=', $threshold)
            ->each(function (Ticket $ticket) use (&$count) {
                $this->notifications->reminderForCustomer($ticket);
                $count++;
            });

        return $count;
    }
}
