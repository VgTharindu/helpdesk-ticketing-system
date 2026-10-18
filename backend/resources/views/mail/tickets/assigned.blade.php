<x-mail::message>
# A ticket was assigned to you

Hello {{ $agent->name }}, ticket #{{ $ticket->id }} is now yours.

**Subject:** {{ $ticket->subject }}

**Customer:** {{ $ticket->customer->name }}

**Status:** {{ $ticket->status->value }}

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
