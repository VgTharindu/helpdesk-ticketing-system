<?php

namespace App\Http\Controllers\Ticket;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Handlers\Ticket\ShowTicketHandler;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;

class ShowTicketController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Ticket $ticket, ShowTicketHandler $handler): TicketResource
    {
        return new TicketResource($handler->handle($ticket));
    }
}
