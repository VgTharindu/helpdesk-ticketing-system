<x-mail::message>
# New reply from the customer

{{ $reply->user->name }} replied on ticket #{{ $reply->ticket->id }} ({{ $reply->ticket->subject }}):

<x-mail::panel>
{{ $reply->message }}
</x-mail::panel>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
