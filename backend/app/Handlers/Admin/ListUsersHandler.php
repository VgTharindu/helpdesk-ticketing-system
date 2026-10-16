<?php

namespace App\Handlers\Admin;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class ListUsersHandler
{
    public function handle(?string $role, int $perPage = 15): LengthAwarePaginator
    {
        return User::query()
            ->with('roles.permissions')
            ->when($role, fn ($query) => $query->role($role))
            ->orderBy('name')
            ->paginate($perPage);
    }
}
