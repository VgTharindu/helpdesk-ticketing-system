<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\Ticket\ClaimTicketHandler;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;


class ClaimTicketController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Ticket $ticket, ClaimTicketHandler $handler): JsonResponse
    {
        $claimed = $handler->handle($ticket, $request->user());

        return response()->json([
            'message' => 'Ticket claimed successfully.',
            'data' => new TicketResource($claimed),
        ]);
    }

}
