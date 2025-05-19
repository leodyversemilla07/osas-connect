<x-mail::message>
    # You've Been Invited to OSAS Connect

    You have been invited by **{{ $inviter }}** to join OSAS Connect as a staff member.    Please click the button below to accept this invitation and complete your registration:

    <x-mail::button :url="$url">
        Accept Invitation
    </x-mail::button>

    This invitation will expire on {{ $expiresAt }}.

    If you did not expect to receive an invitation to this application, you can ignore this email.

    Thanks,<br>
    {{ config('app.name') }} Team
</x-mail::message>