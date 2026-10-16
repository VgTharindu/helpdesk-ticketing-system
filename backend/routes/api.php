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

Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class)->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::get('/me', MeController::class);
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
        });
    });

    Route::middleware('permission:'.PermissionName::ManageUsers->value)
        ->prefix('admin')
        ->group(function () {
            Route::get('/users', ListUsersController::class);
            Route::post('/users', CreateStaffUserController::class);
            Route::patch('/users/{user}/role', UpdateUserRoleController::class);
        });
});
