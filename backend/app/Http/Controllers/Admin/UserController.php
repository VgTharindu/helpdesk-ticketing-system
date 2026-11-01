<?php

namespace App\Http\Controllers\Admin;

use App\Handlers\Admin\CreateStaffUserHandler;
use App\Handlers\Admin\ListUsersHandler;
use App\Handlers\Admin\UpdateUserRoleHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateStaffUserRequest;
use App\Http\Requests\Admin\ListUsersRequest;
use App\Http\Requests\Admin\UpdateUserRoleRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Admin user management endpoints.
 */
class UserController extends Controller
{
    // =====================================================================
    // List
    // =====================================================================

    /**
     * GET /api/admin/users
     */
    public function index(ListUsersRequest $request, ListUsersHandler $handler): AnonymousResourceCollection|JsonResponse
    {
        try {
            $users = $handler->handle(
                $request->validated('role'),
                (int) $request->validated('per_page', 15),
            );
        } catch (\Exception $e) {
            report($e);

            return response()->json([
                'message' => 'Failed to retrieve users.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }

        return UserResource::collection($users);
    }

    // =====================================================================
    // Create staff
    // =====================================================================

    /**
     * POST /api/admin/users
     */
    public function store(CreateStaffUserRequest $request, CreateStaffUserHandler $handler): JsonResponse
    {
        $user = $handler->handle($request->validated());

        return response()->json([
            'message' => 'User created successfully.',
            'data' => new UserResource($user),
        ], 201);
    }

    // =====================================================================
    // Role management
    // =====================================================================

    /**
     * PATCH /api/admin/users/{user}/role
     */
    public function updateRole(UpdateUserRoleRequest $request, User $user, UpdateUserRoleHandler $handler): JsonResponse
    {
        $updated = $handler->handle($request->user(), $user, $request->validated('role'));

        return response()->json([
            'message' => 'Role updated successfully.',
            'data' => new UserResource($updated),
        ]);
    }
}
