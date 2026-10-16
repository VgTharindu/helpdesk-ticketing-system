<?php

namespace App\Handlers\Ticket;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ListTicketsHandler
{
    public function handle(User $user, array $query = [], int $perPage = 15): LengthAwarePaginator
    {
        return QueryBuilder::for(Ticket::query()->visibleTo($user), new Request($query))
            ->with(['customer', 'agent'])
            ->allowedFilters(
                AllowedFilter::exact('status'),
                AllowedFilter::exact('priority'),
                AllowedFilter::callback('assigned', function (Builder $builder, $value) use ($user) {
                    if ($value === 'me') {
                        $builder->where('agent_id', $user->id);
                    } else {
                        $builder->whereNull('agent_id');
                    }
                }),
                AllowedFilter::callback('search', function (Builder $builder, $value) {
                    $builder->where(function (Builder $q) use ($value) {
                        $q->where('subject', 'like', "%{$value}%")
                            ->orWhere('description', 'like', "%{$value}%");
                    });
                }),
            )
            ->allowedSorts('created_at', 'updated_at')
            ->defaultSort('-created_at')
            ->paginate($perPage)
            ->withQueryString();
    }
}
