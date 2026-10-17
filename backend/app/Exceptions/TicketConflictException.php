<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TicketConflictException extends Exception
{
     public function render(Request $request): JsonResponse
    {
        return response()->json(['message' => $this->getMessage()], 409);
    }

    public function report(): void
    {
        // Expected business error, not a bug: do not write it to the log.
    }
}
