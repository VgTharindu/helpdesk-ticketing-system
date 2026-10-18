<x-mail::message>
# You have a new reply

{{ $reply->user->name }} from our support team replied on ticket #{{ $reply->ticket->id }} ({{ $reply->ticket->subject }}):

<x-mail::panel>
{{ $reply->message }}
</x-mail::panel>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
