<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{ config('app.name') }}</title>
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

        .content {
            padding: 30px;
        }

        .panel {
            border-left: 3px solid #064e3b;
            padding: 20px;
            margin: 20px 0;
            background: #ffffff;
        }

        .panel.warning {
            border-left-color: #d97706;
            background: #fffbeb;
        }

        .panel h2 {
            color: #064e3b;
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .panel.warning h2 {
            color: #d97706;
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

        .features-list {
            list-style: none;
            padding: 0;
        }

        .features-list li {
            padding: 6px 0;
            font-size: 14px;
            color: #374151;
        }

        .features-list li::before {
            content: "•";
            color: #064e3b;
            margin-right: 10px;
            font-weight: bold;
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

        strong {
            font-weight: 600;
        }
    </style>
</head>

<body>
    <div class="email-container">        <!-- Consistent Email Header -->
        <div class="email-header">
            <div class="logo-section">
                <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px;">
                    <img src="https://minsu.edu.ph/template/images/logo.png" alt="MinSU Logo" style="width: 50px; height: 50px; margin-right: 15px; border-radius: 50%; object-fit: contain;">                    <div style="text-align: center;">
                        <h1 style="font-size: 18px; margin: 0; font-weight: 600;">Mindoro State University - Bongabong Campus</h1>
                        <p style="font-size: 12px; margin: 2px 0 0 0; opacity: 0.8;">Office of Student Affairs & Services</p>
                        <p style="font-size: 11px; margin: 2px 0 0 0; opacity: 0.7;">Scholarship Unit</p>
                    </div>
                    <img src="{{ asset('images/logo.png') }}" alt="MinSU Logo" style="width: 50px; height: 50px; margin-left: 15px; border-radius: 50%; object-fit: contain;">
                </div>
            </div>
        </div>
        <div class="header">
            <h1 style="font-size: 24px; margin-bottom: 8px; font-weight: 600; color: #1f2937;">Welcome to the Team!</h1>
            <p style="font-size: 14px; color: #6b7280;">You've been invited to join Mindoro State University - Bongabong
                Campus</p>
        </div>
        <div class="content">
            <div class="panel">
                <h2>Invitation Details</h2>
                <p><strong>Invited by:</strong> {{ $inviter }}</p>
                <p>
                    You've been invited to join Mindoro State University - Bongabong Campus as a staff member to help
                    manage scholarship
                    applications and support students.
                </p>
            </div>
            <div class="btn-container">
                <a href="{{ $url }}" class="btn"
                    style="background: #064e3b !important; background-color: #064e3b !important; color: white !important; text-decoration: none !important; display: inline-block; padding: 12px 24px; font-weight: 500; font-size: 14px; margin: 15px 0;">Accept
                    Invitation</a>
            </div>

            <div class="panel warning">
                <h2>Expires {{ $expiresAt }}</h2>
                <p>Please accept your invitation before it expires.</p>
            </div>

            <div class="panel">
                <h2>Your Access</h2>
                <ul class="features-list">
                    <li>Review scholarship applications</li>
                    <li>Communicate with applicants</li>
                    <li>Access analytics and reports</li>
                    <li>Manage scholarship processes</li>
                </ul>
            </div>

            <div class="panel">
                <h2>Security</h2>
                <p>If you didn't expect this invitation, please ignore this email. For questions, contact our support
                    team.
                </p>
            </div>
        </div>        
        <div class="footer">
            <div style="margin-top: 20px;">
                <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px;">
                    <img src="https://minsu.edu.ph/template/images/logo.png" alt="MinSU Logo"
                        style="width: 30px; height: 30px; margin-right: 10px; border-radius: 50%;">
                    <span style="font-weight: 600; color: #064e3b; font-size: 14px;">Mindoro State University -
                        Bongabong Campus</span>
                    <img src="{{ asset('images/logo.png') }}" alt="MinSU Logo" 
                        style="width: 30px; height: 30px; margin-left: 10px; border-radius: 50%;">
                </div>                <div style="text-align: center; color: #6b7280; font-size: 12px; line-height: 1.4;">
                    <p style="margin: 0 0 8px 0;"><strong>Office of Student Affairs & Services</strong></p>
                    <p style="margin: 0 0 8px 0;"><em>Scholarship Unit</em></p>
                    <p style="margin: 0 0 8px 0;">Bongabong, Oriental Mindoro, Philippines</p>
                    <p style="margin: 0 0 8px 0;">
                        <a href="mailto:osas@minsu.edu.ph"
                            style="color: #064e3b; text-decoration: none;">osas@minsu.edu.ph</a> |
                        <a href="tel:+63434567890" style="color: #064e3b; text-decoration: none;">+63 (43) 456-7890</a>
                    </p>
                    <p style="margin: 0 0 8px 0;">
                        <a href="https://minsu.edu.ph"
                            style="color: #064e3b; text-decoration: none;">www.minsu.edu.ph</a>
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
