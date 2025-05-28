<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scholarship Application Status Update - {{ config('app.name') }}</title>
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

        .logo-icon {
            width: 50px;
            height: 50px;
            margin: 0 auto 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .logo-icon img {
            width: 50px;
            height: 50px;
            object-fit: contain;
            border-radius: 50%;
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

        .content {
            padding: 30px;
        }

        .panel {
            border-left: 3px solid #064e3b;
            padding: 20px;
            margin: 20px 0;
            background: #ffffff;
        }

        .panel h2 {
            color: #064e3b;
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .status-badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            display: inline-block;
            margin-top: 5px;
        }

        .btn {
            display: inline-block !important;
            background: #064e3b !important;
            background-color: #064e3b !important;
            color: white !important;
            padding: 12px 24px;
            text-decoration: none !important;
            font-weight: 500;
            font-size: 14px;
            margin: 15px 0;
            transition: background 0.2s ease;
            border: none !important;
        }

        .btn:hover {
            background: #052e16 !important;
            background-color: #052e16 !important;
        }

        .btn:visited,
        .btn:link,
        .btn:active {
            color: white !important;
            background: #064e3b !important;
            background-color: #064e3b !important;
        }

        .btn-container {
            text-align: center;
            margin: 25px 0;
        }

        .footer {
            background: #f9fafb;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }

        .footer small {
            color: #6b7280;
            font-size: 12px;
        }

        .special-section {
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
            text-align: center;
        }

        .special-section h3 {
            margin: 0 0 12px 0;
            font-size: 20px;
            font-weight: bold;
        }

        .special-section p {
            margin: 0;
            line-height: 1.5;
        }

        .next-steps-list {
            list-style: none;
            padding: 0;
            text-align: left;
        }

        .next-steps-list li {
            padding: 6px 0;
            font-size: 14px;
            color: #374151;
        }

        .next-steps-list li::before {
            content: "•";
            color: #064e3b;
            margin-right: 10px;
            font-weight: bold;
        }

        strong {
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Consistent Email Header -->
        <div class="email-header">
            <div class="logo-section">
                <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px;">
                    <img src="https://minsu.edu.ph/template/images/logo.png" alt="MinSU Logo" style="width: 50px; height: 50px; margin-right: 15px; border-radius: 50%; object-fit: contain;">
                    <div style="text-align: center;">
                        <h1 style="font-size: 18px; margin: 0; font-weight: 600;">Mindoro State University - Bongabong Campus</h1>
                        <p style="font-size: 12px; margin: 2px 0 0 0; opacity: 0.8;">Office of Student Affairs & Services</p>
                        <p style="font-size: 11px; margin: 2px 0 0 0; opacity: 0.7;">Scholarship Unit</p>
                    </div>
                    <img src="{{ asset('images/logo.png') }}" alt="MinSU Logo" style="width: 50px; height: 50px; margin-left: 15px; border-radius: 50%; object-fit: contain;">
                </div>
            </div>
        </div>

        @php
            $statusIcons = [
                'approved' => '✓',
                'rejected' => '✗',
                'under_evaluation' => '•',
                'verified' => '✓',
                'under_verification' => '○',
                'submitted' => '→',
                'incomplete' => '!',
            ];
            $statusColors = [
                'approved' => '#059669',
                'rejected' => '#dc2626',
                'under_evaluation' => '#d97706',
                'verified' => '#0369a1',
                'under_verification' => '#7c3aed',
                'submitted' => '#0284c7',
                'incomplete' => '#dc2626',
            ];
            $icon = $statusIcons[$currentStatus] ?? 'i';
            $color = $statusColors[$currentStatus] ?? '#059669';
        @endphp

        <div class="header">
            <div class="status-icon"
                style="background: linear-gradient(135deg, {{ $color }} 0%, {{ $color }}dd 100%);">
                <span style="color: white; font-size: 32px;">{{ $icon }}</span>
            </div>
            <h1 style="font-size: 28px; margin-bottom: 10px; font-weight: bold; line-height: 1.2; color: #1f2937;">
                Application Status Update
            </h1>
            <p style="font-size: 16px; color: #6b7280;">
                Hello {{ $studentName }}, we have an update for you
            </p>
        </div>

        <div class="content">
            <div class="panel">
                <h2>Scholarship Details</h2>
                <p><strong>Scholarship:</strong> {{ $scholarshipName }}</p>
                <p><strong>Application ID:</strong> #{{ $application->id }}</p>
                <p><strong>Current Status:</strong></p>
                <span class="status-badge" style="background: {{ $color }}20; color: {{ $color }};">
                    {{ ucwords(str_replace('_', ' ', $currentStatus)) }}
                </span>
            </div>

            <div class="panel">
                <h2>Status Update</h2>
                <p>{{ $statusMessage }}</p>
            </div>

            @if ($currentStatus === 'approved')
                {{-- Congratulations Section --}}
                <div
                    style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
                    <div
                        style="background: #22c55e; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 24px;">✓</span>
                    </div>
                    <h3 style="color: #166534; margin: 0 0 12px 0; font-size: 20px; font-weight: bold;">
                        Congratulations!
                    </h3>
                    <p style="color: #166534; margin: 0; line-height: 1.5;">
                        Your scholarship application has been approved! You will receive additional information about
                        the next steps
                        via email and through your dashboard.
                    </p>
                </div>
            @elseif($currentStatus === 'incomplete')
                {{-- Action Required Section --}}
                <div
                    style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #f87171; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
                    <div
                        style="background: #ef4444; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 24px;">!</span>
                    </div>
                    <h3 style="color: #dc2626; margin: 0 0 12px 0; font-size: 20px; font-weight: bold;">
                        Action Required
                    </h3>
                    <p style="color: #dc2626; margin: 0; line-height: 1.5;">
                        Your application needs additional information or documents. Please review the feedback and
                        update your
                        application as soon as possible.
                    </p>
                </div>
            @elseif($currentStatus === 'rejected')
                {{-- Rejection Notice --}}
                <div
                    style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #f87171; border-radius: 12px; padding: 24px; margin: 30px 0; text-align: center;">
                    <div
                        style="background: #ef4444; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 24px;">✗</span>
                    </div>
                    <h3 style="color: #dc2626; margin: 0 0 12px 0; font-size: 20px; font-weight: bold;">
                        Application Update
                    </h3>
                    <p style="color: #dc2626; margin: 0; line-height: 1.5;">
                        We appreciate your interest in this scholarship. While this application was not successful, we
                        encourage you
                        to apply for other scholarship opportunities.
                    </p>
                </div>
            @endif

            @if (count($nextSteps) > 0)
                <div class="panel">
                    <h2>Next Steps</h2>
                    <ul class="next-steps-list">
                        @foreach ($nextSteps as $step)
                            <li>{{ $step }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <div class="btn-container">
                <a href="{{ $applicationUrl }}" class="btn"
                    style="background: #064e3b !important; background-color: #064e3b !important; color: white !important; text-decoration: none !important; display: inline-block; padding: 12px 24px; font-weight: 500; font-size: 14px; margin: 15px 0;">
                    View Application Dashboard
                </a>
            </div>

            {{-- Timeline Section --}}
            <div class="special-section"
                style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #bbf7d0;">
                <h3 style="color: #065f46; font-size: 18px; text-align: center;">
                    What Happens Next?
                </h3>
                <div style="display: grid; gap: 12px;">
                    @if ($currentStatus === 'approved')
                        <div style="display: flex; align-items: center; padding: 8px 0;">
                            <span style="color: #059669; font-size: 16px; margin-right: 12px;">•</span>
                            <span style="color: #374151; font-size: 14px;">You'll receive detailed next steps within 3-5
                                business days</span>
                        </div>
                        <div style="display: flex; align-items: center; padding: 8px 0;">
                            <span style="color: #059669; font-size: 16px; margin-right: 12px;">•</span>
                            <span style="color: #374151; font-size: 14px;">Complete any required documentation</span>
                        </div>
                        <div style="display: flex; align-items: center; padding: 8px 0;">
                            <span style="color: #059669; font-size: 16px; margin-right: 12px;">•</span>
                            <span style="color: #374151; font-size: 14px;">Scholarship funds will be processed according
                                to schedule</span>
                        </div>
                    @elseif($currentStatus === 'incomplete')
                        <div style="display: flex; align-items: center; padding: 8px 0;">
                            <span style="color: #d97706; font-size: 16px; margin-right: 12px;">•</span>
                            <span style="color: #374151; font-size: 14px;">Review the feedback provided in your
                                dashboard</span>
                        </div>
                        <div style="display: flex; align-items: center; padding: 8px 0;">
                            <span style="color: #d97706; font-size: 16px; margin-right: 12px;">•</span>
                            <span style="color: #374151; font-size: 14px;">Submit any missing documents or
                                information</span>
                        </div>
                        <div style="display: flex; align-items: center; padding: 8px 0;">
                            <span style="color: #d97706; font-size: 16px; margin-right: 12px;">•</span>
                            <span style="color: #374151; font-size: 14px;">Complete updates within the specified
                                deadline</span>
                        </div>
                    @else
                        <div style="display: flex; align-items: center; padding: 8px 0;">
                            <span style="color: #059669; font-size: 16px; margin-right: 12px;">•</span>
                            <span style="color: #374151; font-size: 14px;">Monitor your application status in the
                                dashboard</span>
                        </div>
                        <div style="display: flex; align-items: center; padding: 8px 0;">
                            <span style="color: #059669; font-size: 16px; margin-right: 12px;">•</span>
                            <span style="color: #374151; font-size: 14px;">You'll receive updates as your application
                                progresses</span>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="footer">
            <div style="margin-top: 20px;">
                <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px;">
                    <img src="https://minsu.edu.ph/template/images/logo.png" alt="MinSU Logo" style="width: 30px; height: 30px; margin-right: 10px; border-radius: 50%;">
                    <span style="font-weight: 600; color: #064e3b; font-size: 14px;">Mindoro State University - Bongabong Campus</span>
                    <img src="{{ asset('images/logo.png') }}" alt="MinSU Logo" style="width: 30px; height: 30px; margin-left: 10px; border-radius: 50%;">
                </div>
                
                <div style="text-align: center; color: #6b7280; font-size: 12px; line-height: 1.4;">
                    <p style="margin: 0 0 8px 0;"><strong>Office of Student Affairs & Services</strong></p>
                    <p style="margin: 0 0 8px 0;"><em>Scholarship Unit</em></p>
                    <p style="margin: 0 0 8px 0;">Bongabong, Oriental Mindoro, Philippines</p>
                    <p style="margin: 0 0 8px 0;">
                        <a href="mailto:osas@minsu.edu.ph" style="color: #064e3b; text-decoration: none;">osas@minsu.edu.ph</a> | 
                        <a href="tel:+63434567890" style="color: #064e3b; text-decoration: none;">+63 (43) 456-7890</a>
                    </p>
                    <p style="margin: 0 0 8px 0;">
                        <a href="https://minsu.edu.ph" style="color: #064e3b; text-decoration: none;">www.minsu.edu.ph</a>
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                        This email was sent by the Office of Student Affairs & Services. 
                        For questions, please contact us during office hours: Monday - Friday, 8:00 AM - 5:00 PM.
                    </p>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
