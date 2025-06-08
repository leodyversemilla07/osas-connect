# OSAS Connect - System Flowchart

This document contains comprehensive flowcharts showing the complete workflow of the OSAS Connect scholarship management system.

## Main System Overview

```mermaid
flowchart TD
    A[User Access] --> B{User Type?}
    
    B -->|Student| C[Student Portal]
    B -->|OSAS Staff| D[Staff Portal]
    B -->|Admin| E[Admin Portal]
    B -->|Public| F[Public Website]
    
    C --> G[Student Workflows]
    D --> H[Staff Workflows]
    E --> I[Admin Workflows]
    F --> J[Public Content]
    
    G --> K[Profile Management]
    G --> L[Scholarship Applications]
    G --> M[Application Status Tracking]
    G --> N[Document Management]
    G --> O[Interview Management]
    
    H --> P[Application Review]
    H --> Q[Document Verification]
    H --> R[Interview Scheduling]
    H --> S[Student Records Management]
    
    I --> T[System Administration]
    I --> U[Staff Management]
    I --> V[Scholarship Management]
    I --> W[Content Management]
    I --> X[Reports & Analytics]
    
    J --> Y[CMS Pages]
    J --> Z[Announcements]
    J --> AA[Available Scholarships]
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style H fill:#e8f5e8
    style I fill:#fff3e0
    style J fill:#fce4ec
```

## User Registration & Authentication Flow

```mermaid
flowchart TD
    A[User Registration] --> B{Registration Type}
    
    B -->|Student| C[Student Registration]
    B -->|Staff Invitation| D[Staff Invitation Link]
    
    C --> E[Email Verification]
    D --> F[Accept Invitation]
    
    E --> G[Complete Student Profile]
    F --> H[Complete Staff Profile]
    
    G --> I[Academic Information]
    G --> J[Family Information]
    G --> K[Financial Information]
    G --> L[Personal Information]
    
    H --> M{Staff Type}
    M -->|OSAS Staff| N[OSAS Staff Profile]
    M -->|Admin| O[Admin Profile]
    
    I --> P[Profile Validation]
    J --> P
    K --> P
    L --> P
    N --> Q[Staff Dashboard Access]
    O --> R[Admin Dashboard Access]
    
    P --> S{Profile Complete?}
    S -->|Yes| T[Student Dashboard Access]
    S -->|No| U[Complete Missing Information]
    U --> P
    
    style A fill:#e3f2fd
    style T fill:#e8f5e8
    style Q fill:#e8f5e8
    style R fill:#fff3e0
```

## Scholarship Application Workflow

```mermaid
flowchart TD
    A[Student Dashboard] --> B[Browse Available Scholarships]
    B --> C[Select Scholarship]
    C --> D{Eligibility Check}
    
    D -->|Eligible| E[Start Application]
    D -->|Not Eligible| F[Show Requirements]
    
    E --> G[Fill Application Form]
    G --> H[Upload Required Documents]
    H --> I{All Documents Uploaded?}
    
    I -->|No| J[Upload Missing Documents]
    J --> H
    I -->|Yes| K[Submit Application]
    
    K --> L[Application Status: Submitted]
    L --> M[OSAS Staff Notification]
    
    M --> N[Document Verification Process]
    N --> O{Documents Valid?}
    
    O -->|Invalid| P[Request Document Resubmission]
    O -->|Valid| Q[Application Status: Verified]
    
    P --> R[Student Notification]
    R --> S[Resubmit Documents]
    S --> N
    
    Q --> T[Academic/Financial Evaluation]
    T --> U{Meets Criteria?}
    
    U -->|No| V[Application Status: Rejected]
    U -->|Yes| W[Schedule Interview]
    
    W --> X[Interview Notification]
    X --> Y[Conduct Interview]
    Y --> Z[Interview Evaluation]
    
    Z --> AA{Interview Passed?}
    AA -->|No| V
    AA -->|Yes| BB[Application Status: Approved]
    
    V --> CC[Rejection Notification]
    BB --> DD[Approval Notification]
    DD --> EE[Stipend Processing Setup]
    
    style A fill:#e3f2fd
    style L fill:#fff3e0
    style Q fill:#e8f5e8
    style BB fill:#c8e6c9
    style V fill:#ffcdd2
```

## Document Management Flow

```mermaid
flowchart TD
    A[Document Upload Request] --> B[Student Uploads Document]
    B --> C[Document Storage]
    C --> D[OSAS Staff Notification]
    
    D --> E[Staff Reviews Document]
    E --> F{Document Valid?}
    
    F -->|Valid| G[Mark as Verified]
    F -->|Invalid| H[Mark as Rejected]
    F -->|Needs Info| I[Request Clarification]
    
    G --> J[Update Application Status]
    H --> K[Rejection Notification]
    I --> L[Clarification Request Notification]
    
    K --> M[Student Resubmits]
    L --> N[Student Provides Info]
    
    M --> B
    N --> E
    
    J --> O{All Required Docs Verified?}
    O -->|Yes| P[Proceed to Evaluation]
    O -->|No| Q[Wait for Remaining Documents]
    
    style G fill:#c8e6c9
    style H fill:#ffcdd2
    style I fill:#fff3e0
```

## Interview Management Flow

```mermaid
flowchart TD
    A[Application Approved for Interview] --> B[OSAS Staff Schedules Interview]
    B --> C[Interview Notification Sent]
    C --> D[Student Confirms Attendance]
    
    D --> E{Student Response}
    E -->|Confirms| F[Interview Scheduled]
    E -->|Requests Reschedule| G[Reschedule Request]
    E -->|No Response| H[Follow-up Reminder]
    
    G --> I[Staff Reviews Request]
    I --> J{Approve Reschedule?}
    J -->|Yes| K[Reschedule Interview]
    J -->|No| L[Maintain Original Schedule]
    
    K --> C
    L --> M[Notify Student of Decision]
    H --> N{Response Received?}
    N -->|Yes| E
    N -->|No| O[Mark as No Response]
    
    F --> P[Conduct Interview]
    P --> Q[Record Interview Notes]
    Q --> R[Interview Evaluation]
    
    R --> S{Interview Result}
    S -->|Pass| T[Recommend for Approval]
    S -->|Fail| U[Recommend for Rejection]
    S -->|Conditional| V[Set Conditions]
    
    style F fill:#e8f5e8
    style T fill:#c8e6c9
    style U fill:#ffcdd2
    style V fill:#fff3e0
```

## Stipend Management Flow

```mermaid
flowchart TD
    A[Application Approved] --> B[Setup Stipend Schedule]
    B --> C{Stipend Type}
    
    C -->|Monthly| D[Monthly Disbursement]
    C -->|Semestral| E[Semestral Disbursement]
    
    D --> F[Generate Monthly Stipend Records]
    E --> G[Generate Semestral Stipend Records]
    
    F --> H[Monthly Processing Cycle]
    G --> I[Semestral Processing Cycle]
    
    H --> J[Verify Student Enrollment]
    I --> J
    
    J --> K{Student Enrolled?}
    K -->|Yes| L[Process Stipend Payment]
    K -->|No| M[Hold Payment]
    
    L --> N[Record Payment]
    N --> O[Notify Student]
    O --> P[Update Stipend Status]
    
    M --> Q[Notify Student of Hold]
    Q --> R[Request Enrollment Proof]
    R --> S[Student Provides Proof]
    S --> J
    
    P --> T{More Payments Due?}
    T -->|Yes| U[Schedule Next Payment]
    T -->|No| V[Complete Stipend Cycle]
    
    U --> H
    
    style L fill:#c8e6c9
    style M fill:#fff3e0
    style V fill:#e8f5e8
```

## Administrative Workflows

```mermaid
flowchart TD
    A[Admin Dashboard] --> B{Admin Task}
    
    B -->|User Management| C[Manage Users]
    B -->|Staff Management| D[Manage Staff]
    B -->|Scholarship Management| E[Manage Scholarships]
    B -->|Content Management| F[Manage Content]
    B -->|System Settings| G[System Configuration]
    
    C --> H[View All Users]
    C --> I[Edit User Profiles]
    C --> J[Deactivate Users]
    
    D --> K[Invite Staff Members]
    D --> L[Manage Staff Roles]
    D --> M[View Staff Activities]
    
    E --> N[Create Scholarships]
    E --> O[Edit Scholarship Details]
    E --> P[Set Eligibility Criteria]
    E --> Q[Manage Scholarship Status]
    
    F --> R[Edit Website Pages]
    F --> S[Manage Announcements]
    F --> T[Update Header/Footer]
    F --> U[Configure Site Theme]
    
    G --> V[System Backups]
    G --> W[Database Management]
    G --> X[Security Settings]
    G --> Y[Performance Monitoring]
    
    K --> Z[Send Invitation Email]
    Z --> AA[Staff Accepts Invitation]
    AA --> BB[Create Staff Account]
    
    N --> CC[Define Scholarship Parameters]
    CC --> DD[Set Required Documents]
    DD --> EE[Publish Scholarship]
    
    style A fill:#fff3e0
    style EE fill:#c8e6c9
    style BB fill:#c8e6c9
```

## Notification System Flow

```mermaid
flowchart TD
    A[System Event Trigger] --> B{Event Type}
    
    B -->|Application Status Change| C[Application Status Notification]
    B -->|Document Request| D[Document Request Notification]
    B -->|Interview Schedule| E[Interview Notification]
    B -->|Stipend Release| F[Stipend Notification]
    B -->|System Announcement| G[General Notification]
    
    C --> H[Determine Recipients]
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I{Notification Method}
    I -->|In-App| J[Create In-App Notification]
    I -->|Email| K[Send Email Notification]
    I -->|Both| L[Create Both Notifications]
    
    J --> M[Store in Database]
    K --> N[Queue Email Job]
    L --> M
    L --> N
    
    M --> O[Display in User Dashboard]
    N --> P[Process Email Queue]
    P --> Q[Send Email]
    
    O --> R[User Views Notification]
    Q --> S[Email Delivered]
    
    R --> T{User Action}
    T -->|Mark as Read| U[Update Read Status]
    T -->|Delete| V[Remove Notification]
    T -->|Click Link| W[Navigate to Related Page]
    
    style J fill:#e3f2fd
    style K fill:#e8f5e8
    style U fill:#c8e6c9
```

## Public Website Flow

```mermaid
flowchart TD
    A[Public Website Access] --> B{Page Type}
    
    B -->|Home Page| C[Load Home Content]
    B -->|About Page| D[Load About Content]
    B -->|Contact Page| E[Load Contact Content]
    B -->|Announcements| F[Load Announcements]
    B -->|Scholarships| G[Load Available Scholarships]
    B -->|Custom Page| H[Load CMS Page]
    
    C --> I[Get CMS Content]
    D --> I
    E --> I
    H --> I
    
    F --> J[Get Published Announcements]
    G --> K[Get Active Scholarships]
    
    I --> L[Load Site Components]
    J --> L
    K --> L
    
    L --> M[Get Header Content]
    L --> N[Get Footer Content]
    
    M --> O[Render Page Header]
    N --> P[Render Page Footer]
    
    O --> Q[Display Complete Page]
    P --> Q
    
    Q --> R{User Action}
    R -->|Register| S[Registration Flow]
    R -->|Login| T[Authentication Flow]
    R -->|Apply| U[Redirect to Application]
    R -->|Contact| V[Contact Form]
    
    style A fill:#fce4ec
    style Q fill:#e8f5e8
```

## Data Verification Flow

```mermaid
flowchart TD
    A[Application Submitted] --> B[Multi-Level Verification Process]
    
    B --> C[Registrar Verification]
    B --> D[Guidance Verification]
    B --> E[OSAS Verification]
    B --> F[Coach/Adviser Verification]
    
    C --> G{Academic Records Valid?}
    D --> H{Guidance Clearance Valid?}
    E --> I{OSAS Requirements Met?}
    F --> J{Performance/Conduct Valid?}
    
    G -->|Yes| K[Registrar: Verified]
    G -->|No| L[Registrar: Incomplete]
    
    H -->|Yes| M[Guidance: Verified]
    H -->|No| N[Guidance: Incomplete]
    
    I -->|Yes| O[OSAS: Verified]
    I -->|No| P[OSAS: Incomplete]
    
    J -->|Yes| Q[Coach/Adviser: Verified]
    J -->|No| R[Coach/Adviser: Incomplete]
    
    L --> S[Request Academic Documents]
    N --> T[Request Guidance Clearance]
    P --> U[Request OSAS Requirements]
    R --> V[Request Performance Records]
    
    K --> W[Check All Verifications]
    M --> W
    O --> W
    Q --> W
    
    W --> X{All Verifications Complete?}
    X -->|Yes| Y[Application Status: Verified]
    X -->|No| Z[Wait for Pending Verifications]
    
    S --> AA[Student Resubmits]
    T --> AA
    U --> AA
    V --> AA
    
    AA --> B
    
    style Y fill:#c8e6c9
    style Z fill:#fff3e0
```

## System Integration Overview

```mermaid
flowchart LR
    A[Frontend - Inertia.js/Vue] --> B[Laravel Backend]
    B --> C[Database - MySQL]
    B --> D[File Storage]
    B --> E[Email System]
    B --> F[Queue System]
    
    G[External Systems] --> H[PDF Generation]
    G --> I[Document Verification APIs]
    
    B --> H
    B --> I
    
    J[Admin Panel] --> B
    K[Staff Portal] --> B
    L[Student Portal] --> B
    M[Public Website] --> B
    
    N[Authentication] --> B
    O[Authorization] --> B
    P[Notifications] --> E
    P --> F
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
```

## Key System Features

### Multi-Role Support
- **Students**: Application management, status tracking, document uploads
- **OSAS Staff**: Application review, verification, interview scheduling
- **Administrators**: System management, scholarship creation, user management

### Scholarship Types Supported
- Academic Full Scholarship
- Academic Partial Scholarship  
- Student Assistantship
- Performing Arts Full/Partial
- Economic Assistance
- Custom Scholarship Types

### Document Management
- Secure file uploads and storage
- Multi-level verification process
- Document status tracking
- Automated notifications

### Workflow Management
- Status-based application tracking
- Automated workflow transitions
- Multi-step verification process
- Interview scheduling and management

### Content Management System
- Dynamic page content
- Announcement management
- Site component configuration
- Theme customization

### Financial Management
- Stipend calculation and scheduling
- Payment tracking and reporting
- Multi-semester support
- Renewal management
