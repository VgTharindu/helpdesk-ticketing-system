<?php

namespace App\Console\Commands;

use App\Handlers\Ticket\SendTicketRemindersHandler;
use Illuminate\Console\Command;

class SendTicketReminders extends Command
{
    protected $signature = 'tickets:send-reminders {--hours=24 : Remind about tickets with no update for at least this many hours}';

    protected $description = 'Queue reminders for stale in-progress and waiting-for-customer tickets';

    public function handle(SendTicketRemindersHandler $handler): int
    {
        $hours = (int) $this->option('hours');

        if ($hours < 0) {
            $this->error('The --hours option must be 0 or greater.');

            return self::FAILURE;
        }

        $result = $handler->handle($hours);

        $this->info(
            "Queued {$result['agent_reminders']} agent reminder(s) and {$result['customer_reminders']} customer reminder(s)."
        );

        return self::SUCCESS;
    }
}
