@component('mail::message')
# You've Been Invited to OSAS Connect

You have been invited by **{{ $inviter }}** to join {{ config('app.name') }} as a staff member. Click the button below to accept this invitation and complete your registration.

@component('mail::button', ['url' => $url])
Accept Invitation
@endcomponent

This invitation will expire on {{ $expiresAt }}.

If you did not expect to receive an invitation to this application, you can ignore this email.

Thanks,<br>
{{ config('app.name') }} Team
@endcomponent