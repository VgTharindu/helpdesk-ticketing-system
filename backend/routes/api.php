<?php

use App\Enums\PermissionName;
use App\Http\Controllers\Admin\CreateStaffUserController;
use App\Http\Controllers\Admin\ListUsersController;
use App\Http\Controllers\Admin\UpdateUserRoleController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\MeController;
use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ticket\CreateTicketController;
use App\Http\Controllers\Ticket\ListTicketsController;
use App\Http\Controllers\Ticket\ShowTicketController;
use App\Http\Controllers\Ticket\AssignTicketController;
use App\Http\Controllers\Ticket\ClaimTicketController;
use App\Http\Controllers\Ticket\CreateReplyController;
use App\Http\Controllers\Ticket\ListRepliesController;
use App\Http\Controllers\Ticket\UpdateTicketStatusController;
use App\Http\Controllers\Dashboard\ShowDashboardController;
use App\Http\Controllers\Ticket\ListTicketAssignmentsController;
use App\Http\Controllers\Ticket\ListTicketHistoryController;

Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class)->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::get('/me', MeController::class);
        Route::get('/dashboard', ShowDashboardController::class)->middleware('permission:'.implode('|', [
        PermissionName::ViewOwnTickets->value,
        PermissionName::ViewTicketQueue->value,
        PermissionName::ViewAllTickets->value,
    ]));
    Route::prefix('tickets')->group(function () {
        Route::post('/', CreateTicketController::class)
            ->middleware('permission:'.PermissionName::CreateTickets->value);

        Route::middleware('permission:'.implode('|', [
            PermissionName::ViewOwnTickets->value,
            PermissionName::ViewTicketQueue->value,
            PermissionName::ViewAllTickets->value,
        ]))->group(function () {
            Route::get('/', ListTicketsController::class);
            Route::get('/{ticket}', ShowTicketController::class)->middleware('can:view,ticket');
            Route::get('/{ticket}/replies', ListRepliesController::class)->middleware('can:view,ticket');
            Route::get('/{ticket}/history', ListTicketHistoryController::class)->middleware('can:view,ticket');
        });

        Route::post('/{ticket}/claim', ClaimTicketController::class)
        ->middleware('permission:'.PermissionName::ClaimTickets->value);

        Route::post('/{ticket}/assign', AssignTicketController::class)
        ->middleware('permission:'.PermissionName::AssignTickets->value);

        Route::post('/{ticket}/replies', CreateReplyController::class)->middleware([
            'permission:'.PermissionName::ReplyToTickets->value,
            'can:reply,ticket',
        ]);

        Route::patch('/{ticket}/status', UpdateTicketStatusController::class)->middleware([
            'permission:'.PermissionName::ChangeTicketStatus->value,
            'can:changeStatus,ticket',
        ]);

        Route::get('/{ticket}/assignments', ListTicketAssignmentsController::class)->middleware([
            'permission:'.implode('|', [
                PermissionName::ViewTicketQueue->value,
                PermissionName::ViewAllTickets->value,
            ]),
            'can:view,ticket',
        ]);
    });

    Route::middleware('permission:'.PermissionName::ManageUsers->value)
        ->prefix('admin')
        ->group(function () {
            Route::get('/users', ListUsersController::class);
            Route::post('/users', CreateStaffUserController::class);
            Route::patch('/users/{user}/role', UpdateUserRoleController::class);
        });
});
