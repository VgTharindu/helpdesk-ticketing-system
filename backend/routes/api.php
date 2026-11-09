<?php

use App\Enums\PermissionName;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

// Anyone who can see tickets: customers (own), agents (queue), admins (all)
$canViewTickets = 'permission:'.implode('|', [
    PermissionName::ViewOwnTickets->value,
    PermissionName::ViewTicketQueue->value,
    PermissionName::ViewAllTickets->value,
]);

// Staff only: agents (queue) and admins (all)
$canViewTicketQueue = 'permission:'.implode('|', [
    PermissionName::ViewTicketQueue->value,
    PermissionName::ViewAllTickets->value,
]);

// Public auth
Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login')->middleware('throttle:10,1');
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () use ($canViewTickets, $canViewTicketQueue) {

    // Auth
    Route::controller(AuthController::class)->group(function () {
        Route::post('/logout', 'logout');
        Route::get('/me', 'me');
    });

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'show'])->middleware($canViewTickets);

    // Notifications: every signed in user reads and clears their own
    Route::controller(NotificationController::class)
        ->prefix('notifications')
        ->group(function () {
            Route::get('/', 'index');
            Route::post('/read-all', 'markAllAsRead');
            Route::patch('/{notification}/read', 'markAsRead');
        });

    // Tickets
    Route::controller(TicketController::class)
        ->prefix('tickets')
        ->group(function () use ($canViewTickets, $canViewTicketQueue) {

            // Create
            Route::post('/', 'store')
                ->middleware('permission:'.PermissionName::CreateTickets->value);

            // Read
            Route::middleware($canViewTickets)->group(function () {
                Route::get('/', 'index');

                // Single ticket reads (ticket policy applied once)
                Route::middleware('can:view,ticket')->group(function () {
                    Route::get('/{ticket}', 'show');
                    Route::get('/{ticket}/replies', 'replies');
                    Route::get('/{ticket}/history', 'history');

                    // Attachment must belong to this ticket (scoped binding)
                    Route::get('/{ticket}/attachments/{attachment}', 'downloadAttachment')->scopeBindings();
                });
            });

            // Assignment actions
            Route::post('/{ticket}/claim', 'claim')
                ->middleware('permission:'.PermissionName::ClaimTickets->value);

            Route::post('/{ticket}/assign', 'assign')
                ->middleware('permission:'.PermissionName::AssignTickets->value);

            // Replies
            Route::post('/{ticket}/replies', 'storeReply')->middleware([
                'permission:'.PermissionName::ReplyToTickets->value,
                'can:reply,ticket',
            ]);

            // Status
            Route::patch('/{ticket}/status', 'updateStatus')->middleware([
                'permission:'.PermissionName::ChangeTicketStatus->value,
                'can:changeStatus,ticket',
            ]);

            // Assignment history (staff only)
            Route::get('/{ticket}/assignments', 'assignments')->middleware([
                $canViewTicketQueue,
                'can:view,ticket',
            ]);
        });

    // Admin user management
    Route::controller(UserController::class)
        ->middleware('permission:'.PermissionName::ManageUsers->value)
        ->prefix('admin/users')
        ->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::patch('/{user}/role', 'updateRole');
        });
});
