<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Reminder - {{ config('app.name') }}</title>
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
            background: #fef3c7;
            padding: 30px 20px;
            text-align: center;
            color: #1f2937;
            border-bottom: 1px solid #fcd34d;
        }

        .status-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #f59e0b;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .content {
            padding: 30px;
        }

        .urgent-notice {
            background: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }

        .urgent-notice h3 {
            color: #dc2626;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
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
            margin-bottom: 10px;
            font-weight: 600;
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

        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #064e3b;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 0;
        }

        .checklist {
            background: #f0fdf4;
            border-left: 3px solid #10b981;
            padding: 20px;
            margin: 20px 0;
        }

        .checklist h3 {
            color: #059669;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .checklist ul {
            margin-left: 20px;
        }

        .checklist li {
            margin-bottom: 8px;
            color: #065f46;
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            </div>
            <h1 style="font-size: 24px; margin: 0 0 10px; color: #d97706;">Interview Reminder</h1>
            <p style="color: #92400e; font-size: 16px; font-weight: 600;">Your interview is in {{ $hoursUntilInterview }} hours!</p>
        </div>

        <div class="content">
            <p style="margin-bottom: 20px;">Dear {{ $studentName }},</p>

            <div class="urgent-notice">
                <h3>⏰ Upcoming Interview</h3>
                <p>This is a friendly reminder that your scholarship interview is scheduled for <strong>tomorrow</strong>.</p>
            </div>

            <div class="panel">
                <h2>📅 Interview Details</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Date</div>
                        <div class="info-value">{{ $scheduledDate }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Time</div>
                        <div class="info-value">{{ $scheduledTime }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Location</div>
                        <div class="info-value">{{ $location }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Interviewer</div>
                        <div class="info-value">{{ $interviewerName }}</div>
                    </div>
                </div>

                @if($notes)
                    <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px;">
                        <div class="info-label">Additional Notes</div>
                        <p style="margin-top: 5px; color: #374151;">{{ $notes }}</p>
                    </div>
                @endif
            </div>

            <div class="checklist">
                <h3>✅ Pre-Interview Checklist</h3>
                <ul>
                    <li>✓ Review your application and supporting documents</li>
                    <li>✓ Prepare to discuss your academic achievements and goals</li>
                    <li>✓ Bring a valid ID and any required documents</li>
                    <li>✓ Plan to arrive 10-15 minutes early</li>
                    <li>✓ Dress appropriately and professionally</li>
                    <li>✓ Prepare questions about the scholarship program</li>
                </ul>
            </div>

            <p style="margin: 20px 0;">
                <strong>Scholarship:</strong> {{ $scholarshipName }}
            </p>

            <p style="margin: 20px 0; padding: 15px; background: #fef3c7; border-radius: 8px; color: #92400e;">
                <strong>Important:</strong> If you cannot attend the interview, please contact the OSAS office immediately to reschedule.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $applicationUrl }}" class="button">View Application Details</a>
            </div>

            <p style="margin-top: 20px;">
                We look forward to meeting you tomorrow!
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
