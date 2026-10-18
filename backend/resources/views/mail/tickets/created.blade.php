<x-mail::message>
# Hello {{ $ticket->customer->name }},

We received your ticket and our support team will look into it soon.

**Ticket #{{ $ticket->id }}:** {{ $ticket->subject }}

**Priority:** {{ $ticket->priority->value }}

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
