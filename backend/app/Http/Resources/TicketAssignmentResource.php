<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketAssignmentResource extends JsonResource
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
            'type' => $this->assigned_type->value,
            'agent' => [
                'id' => $this->agent->id,
                'name' => $this->agent->name,
            ],
            'assigned_by' => $this->assignedBy ? [
                'id' => $this->assignedBy->id,
                'name' => $this->assignedBy->name,
            ] : null,
            'reason' => $this->reason,
            'assigned_at' => $this->assigned_at,
            'unassigned_at' => $this->unassigned_at,
            'is_current' => $this->current_agent !== null,
        ];
    }
}
