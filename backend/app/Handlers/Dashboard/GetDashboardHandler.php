<?php

namespace App\Handlers\Dashboard;

use App\Enums\PermissionName;
use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\User;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Activitylog\Models\Activity;

class GetDashboardHandler
{
    private const RECENT_ACTIVITY_LIMIT = 10;

    public function handle(User $user): array
    {
        $visible = fn (): Builder => Ticket::query()->visibleTo($user);

        return [
            'scope' => $this->scopeFor($user),
            'counts' => $this->counts($user, $visible),
            'recent_activity' => $this->recentActivity($visible),
        ];
    }

    private function scopeFor(User $user): string
    {
        return match (true) {
            $user->can(PermissionName::ViewAllTickets->value) => 'all',
            $user->can(PermissionName::ViewTicketQueue->value) => 'queue',
            default => 'own',
        };
    }

    private function counts(User $user, Closure $visible): array
    {
        $rows = $visible()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $byStatus = [];
        foreach (TicketStatus::cases() as $status) {
            $byStatus[$status->value] = (int) ($rows[$status->value] ?? 0);
        }

        return [
            'total' => array_sum($byStatus),
            'unassigned' => $visible()->whereNull('agent_id')->count(),
            'assigned_to_me' => $user->can(PermissionName::ClaimTickets->value)
                ? $visible()->where('agent_id', $user->id)->count()
                : null,
            'by_status' => $byStatus,
        ];
    }

    private function recentActivity(Closure $visible): Collection
    {
        return Activity::query()
            ->where('subject_type', Ticket::class)
            ->whereIn('subject_id', $visible()->select('id'))
            ->with(['subject', 'causer'])
            ->latest()
            ->orderByDesc('id')
            ->limit(self::RECENT_ACTIVITY_LIMIT)
            ->get();
    }
}
