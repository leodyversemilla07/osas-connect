<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Scheduled - {{ config('app.name') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
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

        .logo-section {
            margin-bottom: 15px;
        }

        .header {
            background: #f8fafc;
            padding: 30px 20px;
            text-align: center;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
        }

        .status-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #10b981;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .content {
            padding: 30px;
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
            background: #f9fafb;
            border-radius: 8px;
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

        .button:hover {
            background: #065f46;
        }

        .tips-section {
            background: #fef3c7;
            border-left: 3px solid #f59e0b;
            padding: 20px;
            margin: 20px 0;
        }

        .tips-section h3 {
            color: #d97706;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .tips-section ul {
            margin-left: 20px;
        }

        .tips-section li {
            margin-bottom: 8px;
            color: #92400e;
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

            .content {
                padding: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo-section">
                <h1 style="font-size: 24px; margin: 0;">{{ config('app.name') }}</h1>
                <p style="font-size: 14px; margin: 5px 0 0; opacity: 0.9;">Office of Student Affairs and Services</p>
            </div>
        </div>

        <div class="header">
            <div class="status-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <path d="m9 16 2 2 4-4"></path>
                </svg>
            </div>
            <h1 style="font-size: 24px; margin: 0 0 10px; color: #064e3b;">Interview Scheduled</h1>
            <p style="color: #6b7280; font-size: 16px;">Your scholarship application interview has been scheduled</p>
        </div>

        <div class="content">
            <p style="margin-bottom: 20px;">Dear {{ $studentName }},</p>

            <p style="margin-bottom: 20px;">
                We are pleased to inform you that an interview has been scheduled for your scholarship application for
                <strong>{{ $scholarshipName }}</strong>.
            </p>

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
            </div>

            <div class="tips-section">
                <h3>💡 Interview Tips</h3>
                <ul>
                    <li>Arrive at least 10 minutes before your scheduled time</li>
                    <li>Bring a valid ID and any required documents</li>
                    <li>Dress appropriately and professionally</li>
                    <li>Be prepared to discuss your academic goals and achievements</li>
                    <li>Have questions ready about the scholarship program</li>
                </ul>
            </div>

            <p style="margin: 20px 0;">
                If you need to reschedule or have any questions, please contact the OSAS office as soon as possible.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $applicationUrl }}" class="button">View Application Details</a>
            </div>

            <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
                We look forward to meeting with you and learning more about your qualifications.
            </p>

            <p style="margin-top: 20px;">Best regards,<br><strong>OSAS Team</strong></p>
        </div>

        <div class="footer">
            <p style="margin-bottom: 10px;"><strong>Mindoro State University</strong></p>
            <p style="margin-bottom: 10px;">Office of Student Affairs and Services</p>
            <p>
                This is an automated message. Please do not reply directly to this email.<br>
                For inquiries, contact the OSAS office.
            </p>
        </div>
    </div>
</body>

</html>
