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

Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class)->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', LogoutController::class);
    Route::get('/me', MeController::class);

    Route::middleware('permission:'.PermissionName::ManageUsers->value)
        ->prefix('admin')
        ->group(function () {
            Route::get('/users', ListUsersController::class);
            Route::post('/users', CreateStaffUserController::class);
            Route::patch('/users/{user}/role', UpdateUserRoleController::class);
        });
});
