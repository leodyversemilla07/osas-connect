<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scholarship Application Status Update</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .email-container {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px 20px;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            margin: 10px 0;
        }
        .status-approved {
            background-color: #dcfce7;
            color: #166534;
        }
        .status-rejected {
            background-color: #fef2f2;
            color: #dc2626;
        }
        .status-under-evaluation {
            background-color: #fef3c7;
            color: #d97706;
        }
        .status-verified {
            background-color: #e0f2fe;
            color: #0369a1;
        }
        .status-under-verification {
            background-color: #f3e8ff;
            color: #7c3aed;
        }
        .status-submitted {
            background-color: #f0f9ff;
            color: #0284c7;
        }
        .status-incomplete {
            background-color: #fef2f2;
            color: #dc2626;
        }
        .scholarship-info {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .next-steps {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .next-steps h3 {
            margin-top: 0;
            color: #0369a1;
        }
        .next-steps ul {
            margin: 0;
            padding-left: 20px;
        }
        .next-steps li {
            margin-bottom: 8px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        .contact-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>OSAS Connect</h1>
            <p>Scholarship Application Status Update</p>
        </div>
        
        <div class="content">
            <h2>Hello {{ $studentName }},</h2>
            
            <p>We have an update regarding your scholarship application.</p>
            
            <div class="scholarship-info">
                <h3>{{ $scholarshipName }}</h3>
                <p><strong>Application ID:</strong> #{{ $application->id }}</p>
                <p><strong>Status:</strong> 
                    <span class="status-badge status-{{ str_replace('_', '-', $currentStatus) }}">
                        {{ ucwords(str_replace('_', ' ', $currentStatus)) }}
                    </span>
                </p>
            </div>
            
            <div style="margin: 20px 0;">
                <h3>Status Update</h3>
                <p>{{ $statusMessage }}</p>
            </div>
            
            @if(count($nextSteps) > 0)
            <div class="next-steps">
                <h3>Next Steps</h3>
                <ul>
                    @foreach($nextSteps as $step)
                        <li>{{ $step }}</li>
                    @endforeach
                </ul>
            </div>
            @endif
            
            @if($currentStatus === 'approved')
            <div style="background-color: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #166534; margin-top: 0;">🎉 Congratulations!</h3>
                <p style="color: #166534;">Your scholarship application has been approved. You will receive additional information about the next steps via email and through your dashboard.</p>
            </div>
            @endif
            
            @if($currentStatus === 'incomplete')
            <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">⚠️ Action Required</h3>
                <p style="color: #dc2626;">Your application needs additional information or documents. Please review the feedback and update your application as soon as possible.</p>
            </div>
            @endif
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{ $applicationUrl }}" class="button">View Application Status</a>
            </div>
            
            <div class="contact-info">
                <p><strong>Need Help?</strong></p>
                <p>If you have any questions about your application, please contact the Office of Student Affairs and Services (OSAS).</p>
                <p>Email: osas@university.edu.ph | Phone: (02) 123-4567</p>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated message from OSAS Connect. Please do not reply to this email.</p>
            <p>© {{ date('Y') }} University Name. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
