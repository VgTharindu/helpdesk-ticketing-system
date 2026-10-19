<x-mail::message>
# We are still waiting for your reply

Hello {{ $ticket->customer->name }}, we asked for more information on ticket #{{ $ticket->id }} ({{ $ticket->subject }}) and have not heard back since {{ $ticket->updated_at->diffForHumans() }}.

Please reply to the ticket so we can continue helping you.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
