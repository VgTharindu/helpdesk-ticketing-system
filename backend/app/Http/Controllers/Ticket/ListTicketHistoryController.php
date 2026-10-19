<?php

namespace App\Http\Controllers\Ticket;

use App\Handlers\Ticket\ListTicketHistoryHandler;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Models\Ticket;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ListTicketHistoryController extends Controller
{
    public function __invoke(Ticket $ticket, ListTicketHistoryHandler $handler): AnonymousResourceCollection
    {
        return ActivityResource::collection($handler->handle($ticket));
    }
}
