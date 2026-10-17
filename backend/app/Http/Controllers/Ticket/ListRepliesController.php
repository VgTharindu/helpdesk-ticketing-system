<?php

namespace App\Http\Controllers\Ticket;

use App\Handlers\Ticket\ListRepliesHandler;
use App\Http\Controllers\Controller;
use App\Http\Resources\TicketReplyResource;
use App\Models\Ticket;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ListRepliesController extends Controller
{
    public function __invoke(Ticket $ticket, ListRepliesHandler $handler): AnonymousResourceCollection
    {
        return TicketReplyResource::collection($handler->handle($ticket));
    }
}
