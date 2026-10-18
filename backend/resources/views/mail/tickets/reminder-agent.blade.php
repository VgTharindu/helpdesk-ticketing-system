<x-mail::message>
# Reminder: this ticket needs attention

Hello {{ $ticket->agent->name }}, ticket #{{ $ticket->id }} has had no update since {{ $ticket->updated_at->diffForHumans() }}.

**Subject:** {{ $ticket->subject }}

**Customer:** {{ $ticket->customer->name }}

**Status:** {{ $ticket->status->value }}

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
