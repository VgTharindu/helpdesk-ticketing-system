<?php

namespace App\Http\Controllers;

use App\Handlers\AuthHandler;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// Authentication endpoints (register, login, logout, current user)
class AuthController extends Controller
{
    // Public (no token)

    // POST /api/register
    public function register(RegisterRequest $request, AuthHandler $handler): JsonResponse
    {
        $result = $handler->register($request->validated());

        return response()->json([
            'message' => 'Registered successfully.',
            'data' => [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ], 201);
    }

    // POST /api/login
    public function login(LoginRequest $request, AuthHandler $handler): JsonResponse
    {
        $result = $handler->login(
            $request->validated('email'),
            $request->validated('password'),
        );

        return response()->json([
            'message' => 'Logged in successfully.',
            'data' => [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    // Authenticated (auth:sanctum)

    // POST /api/logout
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    // GET /api/me
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new UserResource($request->user()),
        ]);
    }
}
