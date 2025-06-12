# OSAS Connect User Manual

## Table of Contents

1. [System Overview](#system-overview)
2. [Getting Started](#getting-started)
3. [User Roles and Access](#user-roles-and-access)
4. [Student User Guide](#student-user-guide)
5. [OSAS Staff User Guide](#osas-staff-user-guide)
6. [Administrator User Guide](#administrator-user-guide)
7. [Common Features](#common-features)
8. [Troubleshooting](#troubleshooting)
9. [Technical Information](#technical-information)

---

## System Overview

**OSAS Connect** is a comprehensive web-based scholarship management system designed for Mindanao State University - Bongabong Campus (MinSU). The system digitizes the entire scholarship lifecycle from application submission to disbursement, providing a seamless experience for students, staff, and administrators.

### Key Features

- **Multi-role Access Control**: Separate interfaces for Students, OSAS Staff, and Administrators
- **Scholarship Management**: Complete lifecycle management for various scholarship types
- **Application Tracking**: Real-time status updates and progress monitoring
- **Document Management**: Secure file upload, verification, and storage
- **Interview Scheduling**: Automated scheduling and management system
- **Payment Tracking**: Stipend disbursement and financial management
- **Reporting**: Comprehensive analytics and data export capabilities
- **Content Management**: Dynamic website content and announcements

### Technology Stack

- **Backend**: Laravel 12.x (PHP 8.2+)
- **Frontend**: React 18 with TypeScript
- **UI Framework**: Inertia.js for Single Page Application experience
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: MySQL/PostgreSQL
- **File Storage**: Laravel Storage with AWS S3 support

---

## Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Stable internet connection
- JavaScript enabled

### Accessing the System

1. **URL**: Visit the OSAS Connect website
2. **Login**: Use your MinSU credentials or register as a new student
3. **Account Types**:
   - **Students**: Self-register with @minsu.edu.ph email
   - **OSAS Staff**: Invitation-based registration
   - **Administrators**: Created by existing administrators

### First-Time Registration (Students)

1. Click "Register" on the login page
2. Fill out the comprehensive registration form:
   - **Personal Information**: Name, contact details, address
   - **Academic Information**: Student ID, course, year level
   - **Family Information**: Parent/guardian details
   - **Financial Information**: Family income, scholarship history
3. Verify your email address
4. Complete your profile setup

---

## User Roles and Access

### Student Users
- **Purpose**: Apply for scholarships and track applications
- **Access Level**: Personal data and applications only
- **Registration**: Self-registration with @minsu.edu.ph email

### OSAS Staff Users
- **Purpose**: Review applications, manage scholarships, assist students
- **Access Level**: All student data and applications
- **Registration**: Invitation-based by administrators

### Administrator Users
- **Purpose**: System management, oversight, and configuration
- **Access Level**: Full system access
- **Registration**: Created by existing administrators

---

## Student User Guide

### Dashboard Overview

The Student Dashboard provides a comprehensive view of your scholarship journey:

#### Quick Stats Cards
- **Total Applications**: Number of scholarship applications submitted
- **Active Scholarships**: Currently approved scholarships
- **Available Scholarships**: Open scholarship opportunities
- **Current GWA**: Your academic performance indicator

#### Main Sections

1. **Available Scholarships**
   - Browse open scholarship opportunities
   - View scholarship details and requirements
   - Quick application access

2. **My Applications**
   - Track all submitted applications
   - View status and progress
   - Access detailed application information

3. **Recent Notifications**
   - System announcements
   - Application status updates
   - Important deadlines

4. **Quick Actions**
   - Browse Scholarships
   - My Applications
   - Upload Documents
   - Update Profile

### Applying for Scholarships

#### Step 1: Browse Available Scholarships
1. Navigate to "Browse Scholarships" from dashboard or sidebar
2. Review scholarship types available:
   - **Academic Scholarships** (Full/Partial)
   - **Student Assistantship Program**
   - **Performing Arts Scholarships**
   - **Economic Assistance Program**

#### Step 2: Check Eligibility
- Review scholarship requirements
- Verify your GWA meets minimum requirements
- Ensure you have required documents
- Check deadline dates

#### Step 3: Submit Application
1. Click "Apply Now" on chosen scholarship
2. Complete the application form:
   - **Purpose Letter**: Explain why you deserve the scholarship
   - **Academic Information**: Current GWA, units enrolled
   - **Type-specific Information**: Additional requirements based on scholarship type
3. Upload required documents
4. Review and submit application

#### Required Documents by Scholarship Type

**Academic Scholarships**:
- Official Transcript of Records
- Certificate of Registration
- Birth Certificate
- 2x2 ID Photo
- Grade Reports
- Certificate of Good Moral Character

**Student Assistantship**:
- Parent/Guardian Consent Form
- Medical Certificate
- Application Letter

**Performing Arts**:
- Coach/Adviser Recommendation Letter
- Portfolio of Performances/Activities
- Group Membership Certificate

**Economic Assistance**:
- Indigency Certificate (valid for 6 months)
- Barangay Certificate
- Family Income Statement

### Tracking Your Applications

#### Application Status Flow
1. **Submitted**: Application received by OSAS
2. **Under Verification**: Documents being reviewed
3. **Incomplete**: Missing/invalid documents (requires resubmission)
4. **Verified**: Documents approved
5. **Under Evaluation**: Application being assessed
6. **Approved**: Scholarship granted
7. **Rejected**: Application denied

#### Viewing Application Details
1. Go to "My Applications"
2. Click on any application to view:
   - Current status and progress
   - Document verification status
   - Timeline of updates
   - Staff comments and feedback
   - Next steps required

### Managing Your Profile

#### Updating Personal Information
1. Navigate to Settings → Profile
2. Update sections as needed:
   - Personal Information
   - Academic Information
   - Family Information
   - Contact Details
3. Upload profile photo if desired
4. Save changes

#### Document Management
- View uploaded documents
- Replace outdated documents
- Track verification status
- Download submitted files

### Notifications and Communication

#### Notification Types
- **Application Status Updates**: Status changes and progress
- **Document Requests**: Missing or invalid document notifications
- **Interview Schedules**: Meeting appointments with staff
- **Payment Notifications**: Stipend release confirmations
- **System Announcements**: Important updates and deadlines

#### Managing Notifications
- Mark notifications as read
- Delete old notifications
- View notification history
- Configure notification preferences

---

## OSAS Staff User Guide

### Staff Dashboard Overview

The OSAS Staff Dashboard provides tools for managing scholarship applications and assisting students:

#### Key Metrics
- **Pending Applications**: Applications awaiting review
- **Recent Documents**: Recently submitted documents
- **Interview Schedules**: Upcoming student meetings
- **Application Statistics**: Performance metrics

#### Main Functions
1. **Application Management**: Review and process applications
2. **Student Management**: View and manage student profiles
3. **Document Verification**: Approve or reject submitted documents
4. **Interview Scheduling**: Coordinate meetings with students
5. **Scholarship Management**: Oversee scholarship programs
6. **Reporting**: Generate reports and analytics

### Application Management

#### Reviewing Applications
1. Navigate to "Application Overview" or "Student Records"
2. Filter applications by:
   - Status (Submitted, Under Review, etc.)
   - Scholarship Type
   - Date Range
   - Student Information
3. Click on application to view details

#### Application Review Process
1. **Document Verification**:
   - Check all required documents are submitted
   - Verify document authenticity and completeness
   - Mark documents as "Verified" or "Incomplete"
   - Add comments for missing/invalid documents

2. **Eligibility Assessment**:
   - Verify student meets GWA requirements
   - Check enrollment status and units
   - Validate scholarship-specific criteria
   - Review financial need (for economic assistance)

3. **Application Evaluation**:
   - Score application based on criteria
   - Add evaluation comments
   - Make recommendation (Approve/Reject)

#### Status Management
- **Update Status**: Move applications through workflow
- **Add Comments**: Provide feedback to students
- **Set Priority**: Mark urgent applications
- **Assign Reviewer**: Delegate to specific staff members

### Student Management

#### Student Profile Access
1. Navigate to "Student Records"
2. Search by:
   - Student Name
   - Student ID
   - Course
   - Year Level
3. View comprehensive student information:
   - Academic Records
   - Family Background
   - Financial Information
   - Application History

#### Student Communication
- Add notes to student profiles
- Send notifications about application status
- Schedule interviews and meetings
- Track communication history

### Document Verification

#### Verification Process
1. Access application documents
2. Review each document for:
   - Completeness
   - Authenticity
   - Current validity
   - Proper format
3. Mark as "Verified" or "Incomplete"
4. Add specific comments for issues

#### Document Types and Verification Criteria
- **Transcripts**: Current grades, official seal
- **Certificates**: Valid dates, proper signatures
- **Financial Documents**: Recent issuance, accurate information
- **ID Photos**: Clear, appropriate format

### Interview Management

#### Scheduling Interviews
1. Open student application
2. Click "Schedule Interview"
3. Set date, time, and location
4. Add interview notes and agenda
5. Send notification to student

#### Conducting Interviews
- Review student application beforehand
- Use structured interview questions
- Document responses and observations
- Make final recommendation

### Scholarship Administration

#### Managing Scholarship Programs
1. Navigate to "Manage Scholarships"
2. View all scholarship programs:
   - Active Scholarships
   - Application Statistics
   - Funding Status
   - Deadline Management

#### Creating/Updating Scholarships
- Define scholarship criteria
- Set application deadlines
- Configure required documents
- Manage slot allocations

### Stipend Management

#### Recording Stipend Payments
1. Access approved applications
2. Navigate to "Stipend Tracking"
3. Record payment details:
   - Amount
   - Payment Date
   - Payment Method
   - Reference Number
4. Update payment status

#### Payment Tracking
- Monitor payment schedules
- Track disbursement history
- Generate payment reports
- Manage payment issues

### Reporting and Analytics

#### Available Reports
- **Application Statistics**: Success rates, processing times
- **Student Demographics**: Course distribution, GWA analysis
- **Financial Reports**: Budget utilization, payment tracking
- **Performance Metrics**: Staff productivity, application volumes

#### Generating Reports
1. Navigate to "Reports" section
2. Select report type
3. Set date range and filters
4. Generate and download report
5. Export to Excel/PDF formats

---

## Administrator User Guide

### Admin Dashboard Overview

The Administrator Dashboard provides complete system oversight and management capabilities:

#### System Statistics
- **Total Students**: Registered student count
- **Total Staff**: OSAS staff members
- **Total Scholarships**: Available scholarship programs
- **Total Applications**: All scholarship applications
- **System Performance**: Application success rates, funding allocation

#### Administrative Sections
1. **User Management**: Manage all system users
2. **Scholarship Oversight**: Complete scholarship program management
3. **Staff Management**: OSAS staff administration
4. **System Configuration**: Platform settings and customization
5. **Content Management**: Website content and announcements
6. **Analytics**: Comprehensive system analytics

### User Management

#### Student Management
1. **View All Students**:
   - Navigate to "Manage Students"
   - Search and filter student records
   - View detailed student profiles
   - Export student data

2. **Student Profile Management**:
   - Edit student information
   - Update academic records
   - Manage account status
   - Reset passwords if needed

#### Staff Management
1. **Invite New Staff**:
   - Navigate to "Manage Staff" → "Invite Staff"
   - Enter staff email address
   - Assign role and permissions
   - Send invitation email

2. **Manage Existing Staff**:
   - View all staff members
   - Edit staff profiles
   - Deactivate/reactivate accounts
   - Monitor staff activity

3. **Staff Invitation Management**:
   - Track pending invitations
   - Resend invitations
   - Revoke pending invitations
   - Monitor invitation status

### Scholarship Management

#### Comprehensive Scholarship Oversight
1. **View All Scholarships**:
   - Complete list of all scholarship programs
   - Application statistics per scholarship
   - Budget allocation and utilization
   - Performance metrics

2. **Scholarship Configuration**:
   - Create new scholarship programs
   - Modify existing scholarships
   - Set eligibility criteria
   - Configure required documents
   - Manage application deadlines

#### Application Oversight
1. **Application Management**:
   - View all applications across the system
   - Filter by status, type, date
   - Monitor application processing times
   - Identify bottlenecks

2. **Quality Assurance**:
   - Review staff decisions
   - Monitor approval/rejection rates
   - Ensure consistent evaluation standards
   - Handle appeals and disputes

### System Configuration

#### General Settings
- Platform configuration
- Email settings and templates
- File upload limits and types
- Security settings
- Backup configurations

#### User Role Management
- Define role permissions
- Configure access levels
- Set workflow rules
- Manage approval hierarchies

### Content Management System (CMS)

#### Website Content Management
1. **Page Management**:
   - Create/edit static pages
   - Manage page content and layout
   - Configure navigation menus
   - Handle page SEO settings

2. **Announcement Management**:
   - Create system announcements
   - Schedule announcement publication
   - Target specific user groups
   - Track announcement engagement

3. **Scholarship Content**:
   - Manage public scholarship information
   - Update scholarship descriptions
   - Configure application forms
   - Handle promotional content

#### Site Component Management
1. **Header Configuration**:
   - University branding
   - Navigation menu setup
   - Contact information
   - Social media links

2. **Footer Configuration**:
   - Quick links
   - Support information
   - Legal information
   - Additional resources

### Analytics and Reporting

#### System Analytics
1. **User Activity**:
   - Login patterns and frequency
   - User engagement metrics
   - Feature usage statistics
   - Performance indicators

2. **Application Analytics**:
   - Application submission trends
   - Processing time analysis
   - Success rate metrics
   - Bottleneck identification

3. **Financial Analytics**:
   - Budget utilization
   - Scholarship funding analysis
   - Cost per application
   - ROI calculations

#### Advanced Reporting
1. **Custom Reports**:
   - Create tailored reports
   - Define specific metrics
   - Schedule automated reports
   - Export to various formats

2. **Data Export**:
   - Bulk data exports
   - API data access
   - Integration with external systems
   - Compliance reporting

### System Administration

#### Database Management
- Monitor database performance
- Manage data backups
- Handle data migrations
- Ensure data integrity

#### Security Management
- Monitor security logs
- Manage user access
- Handle security incidents
- Update security policies

#### Performance Monitoring
- Track system performance
- Monitor server resources
- Handle performance issues
- Optimize system efficiency

---

## Common Features

### Navigation and Interface

#### Sidebar Navigation
All users have access to a responsive sidebar with role-appropriate menu items:
- **Dashboard**: Main overview page
- **Primary Functions**: Role-specific main features
- **Settings**: Profile and system settings
- **Help**: Documentation and support

#### Search and Filtering
- **Global Search**: Find applications, students, or content
- **Advanced Filters**: Filter by date, status, type, etc.
- **Saved Searches**: Save frequently used search criteria
- **Export Options**: Download filtered results

### Document Management

#### File Upload System
- **Supported Formats**: PDF, DOC, DOCX, JPG, PNG
- **File Size Limits**: Configurable per document type
- **Security Scanning**: Automatic virus and malware detection
- **Version Control**: Track document updates and changes

#### Document Verification
- **Status Tracking**: Pending, Verified, Incomplete, Rejected
- **Staff Comments**: Detailed feedback on document issues
- **Resubmission**: Easy document replacement process
- **Download Access**: Secure document retrieval

### Notification System

#### Notification Types
- **Status Updates**: Application progress notifications
- **Document Requests**: Missing document alerts
- **System Announcements**: Important system updates
- **Deadlines**: Upcoming deadline reminders
- **Payment Notifications**: Stipend and payment updates

#### Notification Management
- **Real-time Alerts**: Instant browser notifications
- **Email Notifications**: Optional email delivery
- **Notification History**: Complete notification log
- **Preferences**: Customizable notification settings

### Security Features

#### Authentication
- **Secure Login**: Email and password authentication
- **Email Verification**: Account verification requirement
- **Password Reset**: Secure password recovery process
- **Session Management**: Automatic session timeout

#### Authorization
- **Role-based Access**: Permissions based on user role
- **Data Protection**: Users can only access authorized data
- **Audit Trails**: Complete activity logging
- **Privacy Controls**: GDPR-compliant data handling

---

## Troubleshooting

### Common Issues and Solutions

#### Login Problems

**Issue**: Cannot log in with correct credentials
**Solutions**:
- Verify your email address is verified
- Check if your account is active
- Ensure you're using the correct email format (@minsu.edu.ph for students)
- Try password reset if needed
- Clear browser cache and cookies
- Contact system administrator if account is locked

**Issue**: Forgot password
**Solutions**:
1. Click "Forgot Password" on login page
2. Enter your registered email address
3. Check email for reset link (including spam folder)
4. Follow reset instructions
5. Create a strong new password

#### Application Issues

**Issue**: Cannot submit application
**Solutions**:
- Ensure all required fields are completed
- Verify all required documents are uploaded
- Check document file formats and sizes
- Refresh the page and try again
- Check internet connection stability

**Issue**: Documents not uploading
**Solutions**:
- Verify file format is supported (PDF, DOC, DOCX, JPG, PNG)
- Check file size is within limits
- Ensure stable internet connection
- Try uploading one document at a time
- Clear browser cache if persistent issues

**Issue**: Application status not updating
**Solutions**:
- Refresh the page
- Check if you're viewing the correct application
- Wait for staff processing (may take 1-3 business days)
- Contact OSAS staff if status hasn't updated for over a week

#### Profile and Account Issues

**Issue**: Cannot update profile information
**Solutions**:
- Check if you have permission to edit specific fields
- Ensure required fields are completed
- Verify data format (dates, phone numbers, etc.)
- Save changes after each section
- Contact support if persistent issues

**Issue**: Missing notifications
**Solutions**:
- Check notification preferences in settings
- Verify email address is correct and verified
- Check spam/junk email folders
- Ensure notifications are enabled in browser
- Contact support for notification delivery issues

### Browser and Technical Issues

#### Supported Browsers
- **Chrome**: Version 90 or newer
- **Firefox**: Version 88 or newer
- **Safari**: Version 14 or newer
- **Edge**: Version 90 or newer

#### Performance Issues
**Solutions**:
- Clear browser cache and cookies
- Disable browser extensions temporarily
- Check internet connection speed
- Try using incognito/private browsing mode
- Update browser to latest version

#### Mobile Device Issues
- Use landscape orientation for better experience
- Ensure mobile browser is updated
- Check mobile data/wifi connection
- Some features may have limited mobile functionality

### Getting Help

#### Contact Information
- **OSAS Office**: Visit MinSU OSAS office during business hours
- **Email Support**: Contact system administrator
- **Help Documentation**: Access built-in help system
- **FAQ Section**: Check frequently asked questions

#### Reporting Issues
1. Document the issue with screenshots if possible
2. Note what you were trying to do when the issue occurred
3. Include your browser and operating system information
4. Contact appropriate support channel
5. Provide clear description of the problem

---

## Technical Information

### System Architecture

#### Backend Technology
- **Framework**: Laravel 12.x
- **Language**: PHP 8.2+
- **Database**: MySQL/PostgreSQL with Eloquent ORM
- **Authentication**: Laravel Sanctum
- **File Storage**: Laravel Storage with AWS S3 support
- **Email**: Laravel Mail with SMTP configuration

#### Frontend Technology
- **Framework**: React 18 with TypeScript
- **SPA Integration**: Inertia.js
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React

#### Security Features
- **CSRF Protection**: Laravel's built-in CSRF tokens
- **SQL Injection Prevention**: Eloquent ORM and prepared statements
- **XSS Protection**: HTML sanitization and escaping
- **File Upload Security**: Type validation, size limits, virus scanning
- **Rate Limiting**: Login attempt throttling
- **Session Security**: Secure session management

### Database Structure

#### Core Tables
- **users**: Base user authentication and profile data
- **student_profiles**: Detailed student information
- **osas_staff_profiles**: OSAS staff data
- **admin_profiles**: Administrator information
- **scholarships**: Scholarship program definitions
- **scholarship_applications**: Application data and tracking
- **documents**: File metadata and verification status
- **interviews**: Interview scheduling and management
- **pages**: CMS content management

#### Data Relationships
- Users have polymorphic relationships to role-specific profiles
- Applications belong to users and scholarships
- Documents are associated with applications
- Interviews are scheduled for specific applications
- Complete audit trail for all major actions

### API Integration

#### External Services
- **AWS S3**: File storage and management
- **Email Service**: Notification delivery
- **Payment Gateway**: Future integration for automated payments

#### Internal APIs
- **RESTful Endpoints**: Standard REST API structure
- **JSON Response Format**: Consistent API responses
- **Authentication**: Token-based API authentication
- **Rate Limiting**: API request throttling

### Performance and Scaling

#### Optimization Features
- **Database Indexing**: Optimized database queries
- **Caching**: Redis/Memcached for improved performance
- **Asset Optimization**: Compressed CSS/JS files
- **Image Optimization**: Automatic image compression
- **CDN Integration**: Content delivery network support

#### Scalability
- **Horizontal Scaling**: Multi-server deployment capability
- **Load Balancing**: Traffic distribution across servers
- **Database Clustering**: Database scalability options
- **Microservices Ready**: Architecture supports service separation

### Deployment and Maintenance

#### Server Requirements
- **PHP**: 8.2 or higher
- **Web Server**: Apache/Nginx
- **Database**: MySQL 8.0+ or PostgreSQL 13+
- **Node.js**: 18+ for frontend build process
- **Storage**: Local or cloud storage (AWS S3)

#### Backup and Recovery
- **Database Backups**: Automated daily backups
- **File Backups**: Regular file system backups
- **Version Control**: Git-based code versioning
- **Disaster Recovery**: Complete system recovery procedures

### Future Enhancements

#### Planned Features
- **Mobile Application**: Native iOS/Android apps
- **Advanced Analytics**: Enhanced reporting and insights
- **AI Integration**: Automated application processing
- **Payment Integration**: Direct payment processing
- **Document OCR**: Automatic document text extraction
- **Multi-language Support**: Localization capabilities

---

## Appendix

### Scholarship Types Reference

#### Academic Scholarships
1. **Academic Scholarship (Full) - President's Lister**
   - Amount: ₱500/month
   - GWA Requirement: 1.000-1.450
   - Additional Requirements: No grade below 2.00, minimum 18 units

2. **Academic Scholarship (Partial) - Dean's Lister**
   - Amount: ₱300/month
   - GWA Requirement: 1.460-1.750
   - Additional Requirements: No grade below 2.00, minimum 18 units

#### Student Assistantship Program
- Variable amount based on work assignment
- Maximum 21 units enrollment
- Pre-hiring screening required
- Parent consent needed

#### Performing Arts Scholarships
1. **Full Scholarship**
   - Amount: ₱500/month
   - Requirement: 1+ year group membership
   - Major performance participation required

2. **Partial Scholarship**
   - Amount: ₱300/month
   - Requirement: 1+ semester membership
   - Regular activity participation required

#### Economic Assistance Program
- Amount: ₱400/month
- GWA Requirement: ≤ 2.25
- Valid indigency certificate required

### Document Requirements Checklist

#### Required for All Applications
- [ ] Official Transcript of Records
- [ ] Certificate of Registration
- [ ] Birth Certificate (PSA)
- [ ] 2x2 ID Photo

#### Academic Scholarships
- [ ] Previous semester grade reports
- [ ] Certificate of Good Moral Character

#### Student Assistantship
- [ ] Parent/Guardian Consent Form
- [ ] Medical Certificate
- [ ] Application Letter

#### Performing Arts
- [ ] Coach/Adviser Recommendation Letter
- [ ] Portfolio of Performances/Activities
- [ ] Group Membership Certificate

#### Economic Assistance
- [ ] Indigency Certificate (within 6 months)
- [ ] Barangay Certificate
- [ ] Family Income Statement

### Frequently Asked Questions

**Q: How long does application processing take?**
A: Applications typically take 7-14 business days to process, depending on document verification and evaluation requirements.

**Q: Can I apply for multiple scholarships?**
A: Students can generally hold only one scholarship at a time. Check specific scholarship guidelines for exceptions.

**Q: What happens if my documents are rejected?**
A: You'll receive notification with specific feedback. You can resubmit corrected documents through your application dashboard.

**Q: When are stipends released?**
A: Stipends are typically released monthly after the first month of the semester, following verification of enrollment and academic standing.

**Q: Can I appeal a scholarship decision?**
A: Yes, appeals can be submitted through the OSAS office with additional supporting documentation.

---

*This manual is regularly updated to reflect system changes and improvements. For the most current information, please check the system's help section or contact the OSAS office.*

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Next Review**: June 2025
