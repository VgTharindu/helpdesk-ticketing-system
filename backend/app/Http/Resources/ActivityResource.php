<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
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
            'event' => $this->event,
            'ticket' => [
                'id' => $this->subject_id,
                'subject' => $this->subject?->subject,
            ],
            'actor' => $this->causer ? [
                'id' => $this->causer->id,
                'name' => $this->causer->name,
            ] : null,
            'from_status' => data_get($this->attribute_changes, 'old.status'),
            'to_status' => data_get($this->attribute_changes, 'attributes.status'),
            'at' => $this->created_at,
        ];
    }
}
