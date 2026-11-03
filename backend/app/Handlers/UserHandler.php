<?php

namespace App\Handlers;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

// Admin user management business logic (used by Admin\UserController)
class UserHandler
{
    // List

    // Index: users ordered by name, optionally filtered by role
    public function index(?string $role, int $perPage = 15): LengthAwarePaginator
    {
        return User::query()
            ->with('roles.permissions')
            ->when($role, fn ($query) => $query->role($role))
            ->orderBy('name')
            ->paginate($perPage);
    }

    // Create staff

    // Store: create an agent or admin account
    public function store(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            $user->assignRole($data['role']);

            return $user;
        });
    }

    // Role management

    // Update role: change another user's role (an admin cannot change their own)
    public function updateRole(User $actor, User $target, string $role): User
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
