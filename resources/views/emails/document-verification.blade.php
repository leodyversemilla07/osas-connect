<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Verification Update - {{ config('app.name') }}</title>
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
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .status-icon.verified {
            background: #10b981;
        }

        .status-icon.rejected {
            background: #ef4444;
        }

        .status-icon.pending {
            background: #f59e0b;
        }

        .content {
            padding: 30px;
        }

        .status-badge {
            padding: 6px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            display: inline-block;
            margin: 10px 0;
        }

        .status-badge.verified {
            background: #d1fae5;
            color: #065f46;
        }

        .status-badge.rejected {
            background: #fee2e2;
            color: #991b1b;
        }

        .status-badge.pending {
            background: #fef3c7;
            color: #92400e;
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
            font-weight: 500;
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

        .message-box {
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid;
        }

        .message-box.success {
            background: #d1fae5;
            border-color: #10b981;
            color: #065f46;
        }

        .message-box.error {
            background: #fee2e2;
            border-color: #ef4444;
            color: #991b1b;
        }

        .message-box.warning {
            background: #fef3c7;
            border-color: #f59e0b;
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
    </style>
</head>

<body>
    <div class="email-container">
        <div class="email-header">
            <h1 style="font-size: 24px; margin: 0;">{{ config('app.name') }}</h1>
            <p style="font-size: 14px; margin: 5px 0 0; opacity: 0.9;">Office of Student Affairs and Services</p>
        </div>

        <div class="header">
            <div class="status-icon {{ $document->verification_status }}">
                @if($document->verification_status === 'verified')
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                @elseif($document->verification_status === 'rejected')
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                @else
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                        stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                @endif
            </div>
            <h1 style="font-size: 24px; margin: 0 0 10px; color: #064e3b;">Document Verification Update</h1>
            <span class="status-badge {{ $document->verification_status }}">{{ $verificationStatus }}</span>
        </div>

        <div class="content">
            <p style="margin-bottom: 20px;">Dear {{ $studentName }},</p>

            <div class="message-box {{ $document->verification_status === 'verified' ? 'success' : ($document->verification_status === 'rejected' ? 'error' : 'warning') }}">
                <strong>{{ $statusMessage }}</strong>
            </div>

            <div class="panel">
                <h2>📄 Document Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Document Type</div>
                        <div class="info-value">{{ $documentType }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Scholarship</div>
                        <div class="info-value">{{ $scholarshipName }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Verified By</div>
                        <div class="info-value">{{ $verifiedBy }}</div>
                    </div>
                    @if($verifiedAt)
                        <div class="info-item">
                            <div class="info-label">Verification Date</div>
                            <div class="info-value">{{ $verifiedAt }}</div>
                        </div>
                    @endif
                </div>

                @if($verificationNotes)
                    <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <div class="info-label">Verification Notes</div>
                        <p style="margin-top: 5px; color: #374151;">{{ $verificationNotes }}</p>
                    </div>
                @endif
            </div>

            <div style="background: #eff6ff; border-left: 3px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3 style="color: #1e40af; font-size: 14px; font-weight: 600; margin-bottom: 10px;">📋 Next Steps</h3>
                <p style="color: #1e3a8a;">{{ $nextSteps }}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $applicationUrl }}" class="button">View Application Details</a>
            </div>

            @if($document->verification_status === 'rejected')
                <p style="margin: 20px 0; padding: 15px; background: #fee2e2; border-radius: 8px; color: #991b1b;">
                    <strong>Action Required:</strong> Please review the verification notes and resubmit the corrected document as soon as possible to avoid delays in your application processing.
                </p>
            @endif

            <p style="margin-top: 20px;">
                If you have any questions about this verification, please contact the OSAS office.
            </p>

            <p style="margin-top: 20px;">Best regards,<br><strong>OSAS Team</strong></p>
        </div>

        <div class="footer">
            <p style="margin-bottom: 10px;"><strong>Mindoro State University</strong></p>
            <p style="margin-bottom: 10px;">Office of Student Affairs and Services</p>
            <p>
                This is an automated notification. Please do not reply directly to this email.<br>
                For inquiries, contact the OSAS office.
            </p>
        </div>
    </div>
</body>

</html>
