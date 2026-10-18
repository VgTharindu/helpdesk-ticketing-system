<x-mail::message>
# Your ticket was resolved

Hello {{ $ticket->customer->name }}, ticket #{{ $ticket->id }} ({{ $ticket->subject }}) is now resolved.

You can still read the full conversation history at any time.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
