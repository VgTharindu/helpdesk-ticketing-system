<?php

namespace App\Http\Controllers\Ticket;

use App\Handlers\Ticket\ListTicketAssignmentsHandler;
use App\Http\Controllers\Controller;
use App\Http\Resources\TicketAssignmentResource;
use App\Models\Ticket;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ListTicketAssignmentsController extends Controller
{
    public function __invoke(Ticket $ticket, ListTicketAssignmentsHandler $handler): AnonymousResourceCollection
    {
        return TicketAssignmentResource::collection($handler->handle($ticket));
    }
}
