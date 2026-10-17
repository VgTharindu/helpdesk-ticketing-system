<?php

namespace App\Http\Controllers\Ticket;

use App\Enums\TicketStatus;
use App\Handlers\Ticket\UpdateTicketStatusHandler;
use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\UpdateTicketStatusRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;

class UpdateTicketStatusController extends Controller
{
    public function __invoke(
        UpdateTicketStatusRequest $request,
        Ticket $ticket,
        UpdateTicketStatusHandler $handler,
    ): TicketResource {
        $updated = $handler->handle($ticket, TicketStatus::from($request->validated('status')));

        return new TicketResource($updated);
    }
}
