<x-mail::message>
# New ticket for the support team

Hello {{ $agent->name }}, a new ticket is waiting to be claimed.

**Ticket #{{ $ticket->id }}:** {{ $ticket->subject }}

**Customer:** {{ $ticket->customer->name }}

**Priority:** {{ $ticket->priority->value }}

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
