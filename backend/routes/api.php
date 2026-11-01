<?php

use App\Enums\PermissionName;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

// =========================================================================
// Public — Auth
// =========================================================================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

// =========================================================================
// Authenticated (auth:sanctum)
// =========================================================================

Route::middleware('auth:sanctum')->group(function () {

    // ---------------------------------------------------------------------
    // Auth
    // ---------------------------------------------------------------------
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ---------------------------------------------------------------------
    // Dashboard
    // ---------------------------------------------------------------------
    Route::get('/dashboard', [DashboardController::class, 'show'])->middleware('permission:'.implode('|', [
        PermissionName::ViewOwnTickets->value,
        PermissionName::ViewTicketQueue->value,
        PermissionName::ViewAllTickets->value,
    ]));

    // ---------------------------------------------------------------------
    // Tickets
    // ---------------------------------------------------------------------
    Route::prefix('tickets')->group(function () {

        // Create
        Route::post('/', [TicketController::class, 'store'])
            ->middleware('permission:'.PermissionName::CreateTickets->value);

        // Read (list, show, replies, history)
        Route::middleware('permission:'.implode('|', [
            PermissionName::ViewOwnTickets->value,
            PermissionName::ViewTicketQueue->value,
            PermissionName::ViewAllTickets->value,
        ]))->group(function () {
            Route::get('/', [TicketController::class, 'index']);
            Route::get('/{ticket}', [TicketController::class, 'show'])->middleware('can:view,ticket');
            Route::get('/{ticket}/replies', [TicketController::class, 'replies'])->middleware('can:view,ticket');
            Route::get('/{ticket}/history', [TicketController::class, 'history'])->middleware('can:view,ticket');
        });

        // Assignment actions
        Route::post('/{ticket}/claim', [TicketController::class, 'claim'])
            ->middleware('permission:'.PermissionName::ClaimTickets->value);

        Route::post('/{ticket}/assign', [TicketController::class, 'assign'])
            ->middleware('permission:'.PermissionName::AssignTickets->value);

        // Replies
        Route::post('/{ticket}/replies', [TicketController::class, 'storeReply'])->middleware([
            'permission:'.PermissionName::ReplyToTickets->value,
            'can:reply,ticket',
        ]);

        // Status
        Route::patch('/{ticket}/status', [TicketController::class, 'updateStatus'])->middleware([
            'permission:'.PermissionName::ChangeTicketStatus->value,
            'can:changeStatus,ticket',
        ]);

        // Assignment history
        Route::get('/{ticket}/assignments', [TicketController::class, 'assignments'])->middleware([
            'permission:'.implode('|', [
                PermissionName::ViewTicketQueue->value,
                PermissionName::ViewAllTickets->value,
            ]),
            'can:view,ticket',
        ]);
    });

    // ---------------------------------------------------------------------
    // Admin — User management
    // ---------------------------------------------------------------------
    Route::middleware('permission:'.PermissionName::ManageUsers->value)
        ->prefix('admin')
        ->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::patch('/users/{user}/role', [UserController::class, 'updateRole']);
        });
});
