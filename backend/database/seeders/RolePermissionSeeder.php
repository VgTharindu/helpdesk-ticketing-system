<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Enums\PermissionName;
use App\Enums\UserRole;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach (PermissionName::cases() as $permission) {
            Permission::findOrCreate($permission->value, 'web');
        }
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $rolePermissions = [
            UserRole::Customer->value => [
                PermissionName::CreateTickets,
                PermissionName::ViewOwnTickets,
                PermissionName::ReplyToTickets,
            ],
            UserRole::Agent->value => [
                PermissionName::ViewTicketQueue,
                PermissionName::ClaimTickets,
                PermissionName::ChangeTicketStatus,
                PermissionName::ReplyToTickets,
            ],
            UserRole::Admin->value => [
                PermissionName::ViewAllTickets,
                PermissionName::AssignTickets,
                PermissionName::ManageUsers,
                PermissionName::ChangeTicketStatus,
            ],
        ];

        foreach ($rolePermissions as $roleName => $permissions) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions(
                array_map(fn (PermissionName $permission) => $permission->value, $permissions)
            );
        }
    }
}
