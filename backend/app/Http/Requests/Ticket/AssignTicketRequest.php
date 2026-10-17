<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\UserRole;
use App\Models\User;
use Closure;

class AssignTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'agent_id' => [
                'bail',
                'required',
                'integer',
                'exists:users,id',
                function (string $attribute, mixed $value, Closure $fail) {
                    $user = User::find($value);

                    if ($user && ! $user->hasRole(UserRole::Agent->value)) {
                        $fail('The selected user is not an agent.');
                    }
                },
            ],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }
}
