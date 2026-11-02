<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class TicketAttachmentService
{
    /** @param array<int, UploadedFile> $files */
    public function storeMany(Ticket $ticket, User $uploader, array $files): void
    {
        $disk = config('filesystems.attachments_disk');
        $storedPaths = [];

        try {
            foreach ($files as $file) {
                // Saves with a random unique name inside tickets/{id}
                $path = Storage::disk($disk)->putFile("tickets/{$ticket->id}", $file);

                if ($path === false) {
                    throw new RuntimeException('Failed to store attachment.');
                }

                $storedPaths[] = $path;

                $ticket->attachments()->create([
                    'uploaded_by' => $uploader->id,
                    'disk' => $disk,
                    'path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                ]);
            }
        } catch (Throwable $e) {
            // Remove files already saved so no orphan files are left
            Storage::disk($disk)->delete($storedPaths);

            throw $e;
        }
    }
}
