<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Handlers\Ticket\AssignTicketHandler;
use App\Handlers\Ticket\ClaimTicketHandler;
use App\Handlers\Ticket\CreateReplyHandler;
use App\Handlers\Ticket\CreateTicketHandler;
use App\Handlers\Ticket\ListRepliesHandler;
use App\Handlers\Ticket\ListTicketAssignmentsHandler;
use App\Handlers\Ticket\ListTicketHistoryHandler;
use App\Handlers\Ticket\ListTicketsHandler;
use App\Handlers\Ticket\ShowTicketHandler;
use App\Handlers\Ticket\UpdateTicketStatusHandler;
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
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Ticket endpoints.
 *
 * Controllers only connect the request to a handler and return a resource.
 * All business logic lives in app/Handlers/Ticket and app/Services.
 */
class TicketController extends Controller
{
    // =====================================================================
    // List & Show
    // =====================================================================

    /**
     * GET /api/tickets
     */
    public function index(ListTicketsRequest $request, ListTicketsHandler $handler): AnonymousResourceCollection
    {
        $tickets = $handler->handle(
            $request->user(),
            $request->safe()->only(['filter', 'sort']),
            (int) $request->validated('per_page', 15),
        );

        return TicketResource::collection($tickets);
    }

    /**
     * GET /api/tickets/{ticket}
     */
    public function show(Ticket $ticket, ShowTicketHandler $handler): TicketResource
    {
        return new TicketResource($handler->handle($ticket));
    }

    // =====================================================================
    // Create
    // =====================================================================

    /**
     * POST /api/tickets
     */
    public function store(StoreTicketRequest $request, CreateTicketHandler $handler): JsonResponse
    {
        $ticket = $handler->handle($request->user(), $request->validated());

        return response()->json([
            'message' => 'Ticket created successfully.',
            'data' => new TicketResource($ticket),
        ], 201);
    }

    // =====================================================================
    // Assignment actions (claim / assign)
    // =====================================================================

    /**
     * POST /api/tickets/{ticket}/claim
     */
    public function claim(Request $request, Ticket $ticket, ClaimTicketHandler $handler): JsonResponse
    {
        $claimed = $handler->handle($ticket, $request->user());

        return response()->json([
            'message' => 'Ticket claimed successfully.',
            'data' => new TicketResource($claimed),
        ]);
    }

    /**
     * POST /api/tickets/{ticket}/assign
     */
    public function assign(AssignTicketRequest $request, Ticket $ticket, AssignTicketHandler $handler): JsonResponse
    {
        $assigned = $handler->handle(
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

    /**
     * GET /api/tickets/{ticket}/assignments
     */
    public function assignments(Ticket $ticket, ListTicketAssignmentsHandler $handler): AnonymousResourceCollection
    {
        return TicketAssignmentResource::collection($handler->handle($ticket));
    }

    // =====================================================================
    // Status
    // =====================================================================

    /**
     * PATCH /api/tickets/{ticket}/status
     */
    public function updateStatus(
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

    /**
     * GET /api/tickets/{ticket}/history
     */
    public function history(Ticket $ticket, ListTicketHistoryHandler $handler): AnonymousResourceCollection
    {
        return ActivityResource::collection($handler->handle($ticket));
    }

    // =====================================================================
    // Replies (conversation)
    // =====================================================================

    /**
     * GET /api/tickets/{ticket}/replies
     */
    public function replies(Ticket $ticket, ListRepliesHandler $handler): AnonymousResourceCollection
    {
        return TicketReplyResource::collection($handler->handle($ticket));
    }

    /**
     * POST /api/tickets/{ticket}/replies
     */
    public function storeReply(StoreReplyRequest $request, Ticket $ticket, CreateReplyHandler $handler): JsonResponse
    {
        $reply = $handler->handle($ticket, $request->user(), $request->validated('message'));

        return response()->json([
            'message' => 'Reply added successfully.',
            'data' => new TicketReplyResource($reply),
        ], 201);
    }
}
