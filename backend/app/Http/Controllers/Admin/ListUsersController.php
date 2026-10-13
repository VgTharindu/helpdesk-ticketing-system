<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\ListUsersRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ListUsersController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(ListUsersRequest $request): AnonymousResourceCollection
    {
        $users = User::query()
            ->with('roles.permissions')
            ->when($request->validated('role'), fn ($query, $role) => $query->role($role))
            ->orderBy('name')
            ->paginate($request->validated('per_page', 15));

        return UserResource::collection($users);
    }
}
