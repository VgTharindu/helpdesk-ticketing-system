<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Validation\Rule;

class ListTicketsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization logic can be added here if needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'filter.status' => ['nullable', Rule::enum(TicketStatus::class)],
            'filter.priority' => ['nullable', Rule::enum(TicketPriority::class)],
            'filter.assigned' => ['nullable', Rule::in(['me', 'unassigned'])],
            'filter.search' => ['nullable', 'string', 'max:100'],
            'sort' => ['nullable', Rule::in(['created_at', '-created_at', 'updated_at', '-updated_at'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ];
    }
}
