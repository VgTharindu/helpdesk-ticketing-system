<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Handlers\TicketHandler;
use App\Http\Requests\Ticket\AssignTicketRequest;
use App\Http\Requests\Ticket\ListTicketsRequest;
use App\Http\Requests\Ticket\StoreReplyRequest;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketStatusRequest;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\TicketAssignmentResource;
use App\Http\Resources\TicketReplyResource;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\StreamedResponse;

// Ticket endpoints: controllers only connect the request to a handler; business logic lives in Handlers and Services
class TicketController extends Controller
{
    // List & Show

    // GET /api/tickets
    public function index(ListTicketsRequest $request, TicketHandler $handler): AnonymousResourceCollection
    {
        $tickets = $handler->index(
            $request->user(),
            $request->safe()->only(['filter', 'sort']),
            (int) $request->validated('per_page', 15),
        );

        return TicketResource::collection($tickets);
    }

    // GET /api/tickets/{ticket}
    public function show(Ticket $ticket, TicketHandler $handler): TicketResource
    {
        return new TicketResource($handler->show($ticket));
    }

    // Create

    // POST /api/tickets
    public function store(StoreTicketRequest $request, TicketHandler $handler): JsonResponse
    {
        $ticket = $handler->store($request->user(), $request->validated());

        return response()->json([
            'message' => 'Ticket created successfully.',
            'data' => new TicketResource($ticket),
        ], 201);
    }

    // Attachments

    // GET /api/tickets/{ticket}/attachments/{attachment}
    public function downloadAttachment(
        Ticket $ticket,
        TicketAttachment $attachment,
        TicketHandler $handler,
    ): StreamedResponse {
        return $handler->downloadAttachment($attachment);
    }

    // Assignment actions (claim / assign)

    // POST /api/tickets/{ticket}/claim
    public function claim(Request $request, Ticket $ticket, TicketHandler $handler): JsonResponse
    {
        $claimed = $handler->claim($ticket, $request->user());

        return response()->json([
            'message' => 'Ticket claimed successfully.',
            'data' => new TicketResource($claimed),
        ]);
    }

    // POST /api/tickets/{ticket}/assign
    public function assign(AssignTicketRequest $request, Ticket $ticket, TicketHandler $handler): JsonResponse
    {
        $assigned = $handler->assign(
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

    // GET /api/tickets/{ticket}/assignments
    public function assignments(Ticket $ticket, TicketHandler $handler): AnonymousResourceCollection
    {
        return TicketAssignmentResource::collection($handler->assignments($ticket));
    }

    // Status

    // PATCH /api/tickets/{ticket}/status
    public function updateStatus(
        UpdateTicketStatusRequest $request,
        Ticket $ticket,
        TicketHandler $handler,
    ): JsonResponse {
        $updated = $handler->updateStatus($ticket, TicketStatus::from($request->validated('status')));

        return response()->json([
            'message' => 'Ticket status updated successfully.',
            'data' => new TicketResource($updated),
        ]);
    }

    // GET /api/tickets/{ticket}/history
    public function history(Ticket $ticket, TicketHandler $handler): AnonymousResourceCollection
    {
        return ActivityResource::collection($handler->history($ticket));
    }

    // Replies (conversation)

    // GET /api/tickets/{ticket}/replies
    public function replies(Ticket $ticket, TicketHandler $handler): AnonymousResourceCollection
    {
        return TicketReplyResource::collection($handler->replies($ticket));
    }

    // POST /api/tickets/{ticket}/replies
    public function storeReply(StoreReplyRequest $request, Ticket $ticket, TicketHandler $handler): JsonResponse
    {
        $reply = $handler->storeReply($ticket, $request->user(), $request->validated('message'));

        return response()->json([
            'message' => 'Reply added successfully.',
            'data' => new TicketReplyResource($reply),
        ], 201);
    }
}
