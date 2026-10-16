<?php

namespace App\Models;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;
use App\Enums\PermissionName;
use Illuminate\Database\Eloquent\Builder;
class Ticket extends Model
{
    use LogsActivity;

    protected $fillable = ['customer_id', 'subject', 'description', 'priority'];

    protected $attributes = [
        'status' => TicketStatus::Open->value,
    ];

    protected function casts(): array
    {
        return [
            'status' => TicketStatus::class,
            'priority' => TicketPriority::class,
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status'])
            ->logOnlyDirty();

    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(TicketReply::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(AgentTicket::class);
    }

    public function scopeVisibleTo(Builder $query, User $user): Builder
    {
        if ($user->can(PermissionName::ViewAllTickets->value)) {          // admin
            return $query;
        }

        if ($user->can(PermissionName::ViewTicketQueue->value)) {         // agent
            return $query->where(function (Builder $q) use ($user) {
                $q->whereNull('agent_id')->orWhere('agent_id', $user->id);
            });
        }

        return $query->where('customer_id', $user->id);                   // customer
    }
}
