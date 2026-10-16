<?php

namespace App\Http\Controllers\Admin;

use App\Handlers\Admin\ListUsersHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ListUsersRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ListUsersController extends Controller
{
    public function __invoke(ListUsersRequest $request, ListUsersHandler $handler): AnonymousResourceCollection|JsonResponse
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
}
