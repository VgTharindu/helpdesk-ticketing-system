<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketReplyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'message' => $this->message,
            'author' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'role' => $this->user->getRoleNames()->first(),
            ],
            'created_at' => $this->created_at,
        ];
    }
}
