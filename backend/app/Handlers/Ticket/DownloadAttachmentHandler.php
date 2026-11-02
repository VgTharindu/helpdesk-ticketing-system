<?php

namespace App\Handlers\Ticket;

use App\Models\TicketAttachment;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloadAttachmentHandler
{
    public function handle(TicketAttachment $attachment): StreamedResponse
    {
        // Read from the disk the file was saved on (local or r2)
        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk($attachment->disk);

        abort_unless($disk->exists($attachment->path), 404, 'File not found.');

        return $disk->download($attachment->path, $attachment->original_name, [
            'Content-Type' => $attachment->mime_type,
        ]);
    }
}
