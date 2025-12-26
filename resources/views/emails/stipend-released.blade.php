<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stipend Released - {{ config('app.name') }}</title>
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
            background: #f0fdf4;
            padding: 30px 20px;
            text-align: center;
            color: #1f2937;
            border-bottom: 1px solid #bbf7d0;
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

        .amount-display {
            background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
            padding: 30px;
            margin: 20px 0;
            border-radius: 12px;
            text-align: center;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .amount-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 10px;
        }

        .amount-value {
            font-size: 40px;
            font-weight: 700;
            margin: 10px 0;
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

        .success-message {
            background: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }

        .success-message p {
            color: #065f46;
            font-weight: 500;
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

            .amount-value {
                font-size: 32px;
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
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
            </div>
            <h1 style="font-size: 24px; margin: 0 0 10px; color: #059669;">Stipend Released!</h1>
            <p style="color: #065f46; font-size: 16px;">Your scholarship stipend has been processed</p>
        </div>

        <div class="content">
            <p style="margin-bottom: 20px;">Dear {{ $studentName }},</p>

            <div class="success-message">
                <p>✓ Congratulations! Your scholarship stipend for <strong>{{ $scholarshipName }}</strong> has been successfully released.</p>
            </div>

            <div class="amount-display">
                <div class="amount-label">STIPEND AMOUNT</div>
                <div class="amount-value">₱{{ $amount }}</div>
                <p style="opacity: 0.9; font-size: 14px; margin-top: 10px;">{{ $semester }} • {{ $academicYear }}</p>
            </div>

            <div class="panel">
                <h2>💰 Payment Details</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Release Date</div>
                        <div class="info-value">{{ $releaseDate }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Semester</div>
                        <div class="info-value">{{ $semester }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Academic Year</div>
                        <div class="info-value">{{ $academicYear }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Fund Source</div>
                        <div class="info-value">{{ $fundSource }}</div>
                    </div>
                </div>
            </div>

            <div style="background: #eff6ff; border-left: 3px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #1e40af; font-size: 14px; font-weight: 600; margin-bottom: 10px;">📋 Important Information</h3>
                <ul style="margin-left: 20px; color: #1e3a8a;">
                    <li style="margin-bottom: 8px;">Please proceed to the Finance Office to claim your stipend</li>
                    <li style="margin-bottom: 8px;">Bring a valid ID and your student ID</li>
                    <li style="margin-bottom: 8px;">Stipend must be claimed within 30 days of release</li>
                    <li style="margin-bottom: 8px;">For inquiries, contact the OSAS or Finance Office</li>
                </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $applicationUrl }}" class="button">View Scholarship Details</a>
            </div>

            <p style="margin: 20px 0; padding: 15px; background: #fef3c7; border-radius: 8px; color: #92400e;">
                <strong>Note:</strong> This stipend is provided to support your educational expenses. Please use it wisely for your academic needs.
            </p>

            <p style="margin-top: 20px;">
                Thank you for your dedication to your studies. We wish you continued success in your academic journey.
            </p>

            <p style="margin-top: 20px;">Best regards,<br><strong>OSAS Team</strong></p>
        </div>

        <div class="footer">
            <p style="margin-bottom: 10px;"><strong>Mindanao State University</strong></p>
            <p style="margin-bottom: 10px;">Office of Student Affairs and Services</p>
            <p>
                This is an automated notification. Please do not reply directly to this email.<br>
                For inquiries, contact the OSAS or Finance office.
            </p>
        </div>
    </div>
</body>

</html>
