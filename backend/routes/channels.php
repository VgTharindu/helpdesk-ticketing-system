<?php

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

// Personal channel: Laravel sends every notification broadcast here
Broadcast::channel('App.Models.User.{id}', function (User $user, string $id) {
    return (int) $user->id === (int) $id;
});

// Ticket channel: reuses the same visibility rule the REST endpoints apply
Broadcast::channel('tickets.{ticket}', function (User $user, Ticket $ticket) {
    return $user->can('view', $ticket);
});
