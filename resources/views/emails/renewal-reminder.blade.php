<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scholarship Renewal Reminder - {{ config('app.name') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background-color: #ffffff;
        }

        .email-container {
            max-width: 580px;
            margin: 40px auto;
            background: white;
            border: 1px solid #e5e7eb;
        }

        .email-header {
            background: #064e3b;
            padding: 20px;
            text-align: center;
            color: white;
            border-bottom: 3px solid #065f46;
        }

        .header {
            background: {{ $urgencyLevel === 'urgent' ? '#fee2e2' : ($urgencyLevel === 'high' ? '#fef3c7' : '#f8fafc') }};
            padding: 30px 20px;
            text-align: center;
            color: #1f2937;
            border-bottom: 1px solid {{ $urgencyLevel === 'urgent' ? '#fecaca' : ($urgencyLevel === 'high' ? '#fcd34d' : '#e5e7eb') }};
        }

        .status-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: {{ $urgencyLevel === 'urgent' ? '#ef4444' : ($urgencyLevel === 'high' ? '#f59e0b' : '#3b82f6') }};
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .content {
            padding: 30px;
        }

        .urgency-banner {
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            border-left: 4px solid;
        }

        .urgency-banner.urgent {
            background: #fee2e2;
            border-color: #ef4444;
            color: #991b1b;
        }

        .urgency-banner.high {
            background: #fef3c7;
            border-color: #f59e0b;
            color: #92400e;
        }

        .urgency-banner.medium {
            background: #dbeafe;
            border-color: #3b82f6;
            color: #1e40af;
        }

        .panel {
            border-left: 3px solid #064e3b;
            padding: 20px;
            margin: 20px 0;
            background: #f9fafb;
        }

        .panel h2 {
            color: #064e3b;
            font-size: 16px;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .requirements-list {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
        }

        .requirements-list h3 {
            color: #064e3b;
            font-size: 14px;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .requirements-list ul {
            margin-left: 20px;
        }

        .requirements-list li {
            margin-bottom: 8px;
            color: #374151;
        }

        .button {
            display: inline-block;
            padding: 14px 28px;
            background: #064e3b;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 0;
            font-size: 16px;
        }

        .button:hover {
            background: #065f46;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }

        .info-item {
            padding: 15px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .info-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .info-value {
            font-size: 16px;
            color: #1f2937;
            font-weight: 600;
        }

        .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }

        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1 style="font-size: 24px; margin: 0;">{{ config('app.name') }}</h1>
            <p style="font-size: 14px; margin: 5px 0 0; opacity: 0.9;">Office of Student Affairs and Services</p>
        </div>

        <div class="header">
            <div class="status-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
                </svg>
            </div>
            <h1 style="font-size: 24px; margin: 0 0 10px; color: {{ $urgencyLevel === 'urgent' ? '#dc2626' : ($urgencyLevel === 'high' ? '#d97706' : '#064e3b') }};">
                Scholarship Renewal Reminder
            </h1>
            <p style="color: #6b7280; font-size: 16px;">Action required for your scholarship renewal</p>
        </div>

        <div class="content">
            <p style="margin-bottom: 20px;">Dear {{ $studentName }},</p>

            <div class="urgency-banner {{ $urgencyLevel }}">
                @if($urgencyLevel === 'urgent')
                    ⚠️ <strong>URGENT:</strong> You have only {{ $daysUntilDeadline }} days left to renew your scholarship!
                @elseif($urgencyLevel === 'high')
                    ⏰ <strong>REMINDER:</strong> You have {{ $daysUntilDeadline }} days to submit your renewal application.
                @else
                    📅 Your scholarship renewal is due in {{ $daysUntilDeadline }} days.
                @endif
            </div>

            <p style="margin: 20px 0;">
                This is a reminder that your <strong>{{ $scholarshipName }}</strong> scholarship requires renewal for the upcoming semester.
            </p>

            <div class="panel">
                <h2>📋 Current Scholarship Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Current Semester</div>
                        <div class="info-value">{{ $currentSemester }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Academic Year</div>
                        <div class="info-value">{{ $academicYear }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Scholarship Type</div>
                        <div class="info-value">{{ $scholarshipName }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Days Until Deadline</div>
                        <div class="info-value" style="color: {{ $urgencyLevel === 'urgent' ? '#dc2626' : '#059669' }};">
                            {{ $daysUntilDeadline }} days
                        </div>
                    </div>
                </div>
            </div>

            <div class="requirements-list">
                <h3>📄 Required Documents</h3>
                <ul>
                    @foreach($requiredDocuments as $document)
                        <li>{{ $document }}</li>
                    @endforeach
                </ul>
            </div>

            <div class="requirements-list">
                <h3>✅ Eligibility Requirements</h3>
                <ul>
                    @foreach($eligibilityRequirements as $requirement)
                        <li>{{ $requirement }}</li>
                    @endforeach
                </ul>
            </div>

            <div style="background: #eff6ff; border-left: 3px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #1e40af; font-size: 14px; font-weight: 600; margin-bottom: 10px;">💡 Renewal Process</h3>
                <ol style="margin-left: 20px; color: #1e3a8a;">
                    <li style="margin-bottom: 8px;">Click the button below to start your renewal application</li>
                    <li style="margin-bottom: 8px;">Upload all required documents</li>
                    <li style="margin-bottom: 8px;">Review and submit your renewal application</li>
                    <li style="margin-bottom: 8px;">Wait for OSAS staff to verify your documents</li>
                    <li style="margin-bottom: 8px;">Receive confirmation once your renewal is approved</li>
                </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $renewalUrl }}" class="button">Start Renewal Application Now</a>
            </div>

            @if($urgencyLevel === 'urgent')
                <p style="margin: 20px 0; padding: 15px; background: #fee2e2; border-radius: 8px; color: #991b1b; text-align: center; font-weight: 600;">
                    ⚠️ <strong>IMPORTANT:</strong> Failure to renew before the deadline will result in the termination of your scholarship benefits.
                </p>
            @endif

            <div style="background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;"><strong>Need Help?</strong></p>
                <p style="color: #6b7280; font-size: 14px;">
                    If you have questions about the renewal process or requirements, please visit the OSAS office or contact us during office hours.
                </p>
            </div>

            <p style="margin-top: 20px;">
                We look forward to continuing to support your academic journey at Mindoro State University.
            </p>

            <p style="margin-top: 20px;">Best regards,<br><strong>OSAS Team</strong></p>
        </div>

        <div class="footer">
            <p style="margin-bottom: 10px;"><strong>Mindoro State University</strong></p>
            <p style="margin-bottom: 10px;">Office of Student Affairs and Services</p>
            <p>
                This is an automated reminder. Please do not reply directly to this email.<br>
                For inquiries, contact the OSAS office.
            </p>
        </div>
    </div>
</body>

</html>
