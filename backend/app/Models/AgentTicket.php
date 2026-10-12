<?php

namespace App\Models;

use App\Enums\AssignmentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentTicket extends Model
{
    protected $table = 'agent_ticket';

    protected $fillable = [
        'ticket_id', 'agent_id', 'assigned_by', 'assigned_type',
        'reason', 'assigned_at', 'unassigned_at', 'current_agent',
    ];

    protected function casts(): array
    {
        return [
            'assigned_type' => AssignmentType::class,
            'assigned_at' => 'datetime',
            'unassigned_at' => 'datetime',
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function currentAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'current_agent');
    }
}
