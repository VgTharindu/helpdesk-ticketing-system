<?php

namespace App\Handlers\Admin;

use App\Models\User;
use Illuminate\Validation\ValidationException;

class UpdateUserRoleHandler
{
    public function handle(User $actor, User $target, string $role): User
    {
        if ($actor->is($target)) {
            throw ValidationException::withMessages([
                'role' => 'You cannot change your own role.',
            ]);
        }

        $target->syncRoles($role);

        return $target->fresh();
    }
}
