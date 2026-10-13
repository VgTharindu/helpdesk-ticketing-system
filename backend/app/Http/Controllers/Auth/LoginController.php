<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\Auth\LoginHandler;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(LoginRequest $request, LoginHandler $handler): JsonResponse
    {
        $result = $handler->handle(
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
}
