<?php

namespace App\Http\Controllers;

use App\Handlers\Dashboard\GetDashboardHandler;
use App\Http\Resources\ActivityResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Dashboard endpoints.
 */
class DashboardController extends Controller
{
    /**
     * GET /api/dashboard
     */
    public function show(Request $request, GetDashboardHandler $handler): JsonResponse
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
