<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\Admin\CreateStaffUserHandler;
use App\Http\Requests\Admin\CreateStaffUserRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

class CreateStaffUserController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(CreateStaffUserRequest $request, CreateStaffUserHandler $handler): JsonResponse
    {
        $user = $handler->handle($request->validated());

        return response()->json([
            'message' => 'User created successfully.',
            'data' => new UserResource($user),
        ], 201);
    }
}
