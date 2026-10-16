<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\Ticket\CreateTicketHandler;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Resources\TicketResource;
use Illuminate\Http\JsonResponse;

class CreateTicketController extends Controller
{
    public function __invoke(StoreTicketRequest $request, CreateTicketHandler $handler): JsonResponse
    {
        $ticket = $handler->handle($request->user(), $request->validated());

        return response()->json([
            'message' => 'Ticket created successfully.',
            'data' => new TicketResource($ticket),
        ], 201);
    }
}
