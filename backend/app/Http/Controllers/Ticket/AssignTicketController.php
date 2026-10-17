<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\Ticket\AssignTicketHandler;
use App\Http\Requests\Ticket\AssignTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;

class AssignTicketController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(AssignTicketRequest $request, Ticket $ticket, AssignTicketHandler $handler): JsonResponse
    {
        $assigned = $handler->handle(
            $ticket,
            (int) $request->validated('agent_id'),
            $request->user(),
            $request->validated('reason'),
        );

        return response()->json([
            'message' => 'Ticket assigned successfully.',
            'data' => new TicketResource($assigned),
        ]);
    }
}
