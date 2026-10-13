<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\Admin\UpdateUserRoleHandler;
use App\Http\Requests\Admin\UpdateUserRoleRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;


class UpdateUserRoleController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(UpdateUserRoleRequest $request, User $user, UpdateUserRoleHandler $handler): JsonResponse
    {
        $updated = $handler->handle($request->user(), $user, $request->validated('role'));

        return response()->json([
            'message' => 'Role updated successfully.',
            'data' => new UserResource($updated),
        ]);
    }
}
