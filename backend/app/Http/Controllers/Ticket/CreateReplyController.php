<?php

namespace App\Http\Controllers\Ticket;

use App\Handlers\Ticket\CreateReplyHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\StoreReplyRequest;
use App\Http\Resources\TicketReplyResource;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CreateReplyController extends Controller
{
    public function __invoke(StoreReplyRequest $request, Ticket $ticket, CreateReplyHandler $handler): JsonResponse
    {
        $reply = $handler->handle($ticket, $request->user(), $request->validated('message'));

        return response()->json([
            'message' => 'Reply added successfully.',
            'data' => new TicketReplyResource($reply),
        ], 201);
    }
}
