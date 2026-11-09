<?php

namespace App\Handlers;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationHandler
{
    // Newest first; the relation already scopes the rows to this user
    public function index(User $user, int $perPage): LengthAwarePaginator
    {
        return $user->notifications()->paginate($perPage);
    }

    public function unreadCount(User $user): int
    {
        return $user->unreadNotifications()->count();
    }

    // firstOrFail keeps one user from marking another user's notification
    public function markAsRead(User $user, string $id): void
    {
        $user->notifications()->whereKey($id)->firstOrFail()->markAsRead();
    }

    public function markAllAsRead(User $user): int
    {
        return $user->unreadNotifications()->update(['read_at' => now()]);
    }
}
