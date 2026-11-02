<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketAttachmentResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->original_name,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            // Relative API path; the frontend adds /api/proxy in front
            'download_path' => "/tickets/{$this->ticket_id}/attachments/{$this->id}",
            'created_at' => $this->created_at,
        ];
    }
}
