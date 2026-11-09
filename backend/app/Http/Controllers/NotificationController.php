<?php

namespace App\Http\Controllers;

use App\Handlers\NotificationHandler;
use App\Http\Requests\Notification\ListNotificationsRequest;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NotificationController extends Controller
{
    public function __construct(private readonly NotificationHandler $handler) {}

    public function index(ListNotificationsRequest $request): AnonymousResourceCollection
    {
        $user = $request->user();
        $perPage = (int) $request->validated('per_page', 10);

        // unread_count sits beside the paginator meta, not inside it
        return NotificationResource::collection($this->handler->index($user, $perPage))
            ->additional(['unread_count' => $this->handler->unreadCount($user)]);
    }

    public function markAsRead(Request $request, string $notification): JsonResponse
    {
        $this->handler->markAsRead($request->user(), $notification);

        return response()->json(['message' => 'Notification marked as read.']);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $count = $this->handler->markAllAsRead($request->user());

        return response()->json(['message' => "Marked {$count} notifications as read."]);
    }
}
