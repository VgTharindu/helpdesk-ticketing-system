<?php

namespace App\Http\Controllers\Ticket;

use App\Enums\TicketStatus;
use App\Handlers\Ticket\UpdateTicketStatusHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\UpdateTicketStatusRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;

class UpdateTicketStatusController extends Controller
{
    public function __invoke(
        UpdateTicketStatusRequest $request,
        Ticket $ticket,
        UpdateTicketStatusHandler $handler,
    ): JsonResponse {
        $updated = $handler->handle($ticket, TicketStatus::from($request->validated('status')));

        return response()->json([
            'message' => 'Ticket status updated successfully.',
            'data' => new TicketResource($updated),
        ]);
    }
}
