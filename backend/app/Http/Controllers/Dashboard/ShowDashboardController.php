<?php

namespace App\Http\Controllers\Dashboard;

use App\Handlers\Dashboard\GetDashboardHandler;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShowDashboardController extends Controller
{
    public function __invoke(Request $request, GetDashboardHandler $handler): JsonResponse
    {
        $dashboard = $handler->handle($request->user());

        return response()->json([
            'data' => [
                'scope' => $dashboard['scope'],
                'counts' => $dashboard['counts'],
                'recent_activity' => ActivityResource::collection($dashboard['recent_activity']),
            ],
        ]);
    }
}
