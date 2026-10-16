<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\Ticket\ListTicketsHandler;
use App\Http\Requests\Ticket\ListTicketsRequest;
use App\Http\Resources\TicketResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ListTicketsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(ListTicketsRequest $request, ListTicketsHandler $handler): AnonymousResourceCollection
    {
        $tickets = $handler->handle(
            $request->user(),
            $request->safe()->only(['filter', 'sort']),
            (int) $request->validated('per_page', 15),
        );

        return TicketResource::collection($tickets);
    }
}
