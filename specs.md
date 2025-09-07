
# Software Requirements Specification (SRS)
# Scholarship Management System (SMS)

**Version:** 1.0  
**Date:** August 2, 2025  
**Author:** OSAS Connect Team

---

## Revision History
| Version | Date       | Author            | Description           |
|---------|------------|-------------------|-----------------------|
| 1.0     | 2025-08-02 | OSAS Connect Team | Initial version       |

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [References](#2-references)
3. [Overall Description](#3-overall-description)
4. [Specific Requirements](#4-specific-requirements)
5. [External Interface Requirements](#5-external-interface-requirements)
6. [Other Non-Functional Requirements](#6-other-non-functional-requirements)
7. [Appendices](#7-appendices)

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to specify the requirements for the Scholarship Management System (SMS) for Mindoro State University (MinSU). The SMS will automate and streamline the administration of institutional scholarships, financial assistance, grants, and incentives, supporting application, evaluation, awarding, and monitoring processes.

### 1.2 Scope
The SMS will manage:
- Academic scholarships (Full/Partial)
- Student assistantship programs
- Performing arts scholarships
- Scholarships for economically deprived/marginalized students

The system will handle application intake, eligibility verification, document management, interview scheduling, stipend disbursement, and reporting.

### 1.3 Definitions, Acronyms, and Abbreviations
- **MinSU**: Mindoro State University
- **SMS**: Scholarship Management System
- **GWA**: General Weighted Average
- **OSAS**: Office of Student Affairs and Services
- **MSWDO**: Municipal Social Welfare and Development Office

### 1.4 References
- MinSU Scholarship Policy Document (scholarships.md)
- [IEEE 830-1998 SRS Standard](https://ieeexplore.ieee.org/document/720574)
- University IT Security Policy

### 1.5 Overview
This document is organized according to IEEE/ISO SRS standards. It includes an overview of the system, detailed requirements, interface specifications, and non-functional requirements.

---


## 2. Overall Description

### 2.1 Product Perspective
The SMS is a new, web-based application that will integrate with the university’s student information system (SIS) and authentication services. It will be accessible to students, staff, and administrators, and will automate the full lifecycle of institutional scholarships, financial assistance, grants, and incentives as defined in university policy.

### 2.2 Product Functions
- Application management for all scholarship types:
  - Academic Scholarships (Full/Partial)
  - Student Assistantship Program
  - Performing Arts Scholarships (Full/Partial)
  - Scholarships for Economically Deprived/Marginalized Students
- Eligibility verification for each scholarship type, including:
  - Academic standing (GWA, grades, load)
  - Good moral character (Guidance Counselor certification)
  - Indigency (MSWDO certificate)
  - Membership/participation (Performing Arts)
  - Parent consent (Assistantship)
- Document management (upload, verification, certification)
- Interview scheduling, tracking, and results recording
- Awarding, stipend calculation, and disbursement tracking (with fund source tracking)
- Scholarship renewal management (eligibility revalidation, document resubmission)
- Reporting and certification (qualified lists, fund usage, performance)
- Notifications and reminders (application status, interview, stipend, renewal)

### 2.3 User Classes and Characteristics
- **Registrar**: Certifies student status, grades, loads, and issues certifications
- **Guidance Counselor**: Certifies good moral character
- **OSAS Staff**: Screens applications, schedules interviews, manages assistantship assignments, verifies documents
- **Screening Committee**: Conducts interviews, evaluates applications, records recommendations
- **Coaches/Advisers**: Recommend and verify performing arts scholars
- **Administrators**: Manage funds, generate reports, configure system settings
- **Students**: Apply for scholarships, upload documents, track status

### 2.4 Operating Environment
- Web browsers (Chrome, Firefox, Edge)
- University network and secure internet access
- Integration with existing student records and authentication systems

### 2.5 Design and Implementation Constraints
- Compliance with university data privacy and security policies
- Support for document uploads (PDF, image formats)
- Role-based access control
- User manual for students and staff
- Online help and FAQ

### 2.7 Assumptions and Dependencies
- All students and staff have university-issued credentials
- Required data (grades, enrollment, etc.) is available from SIS
- Sufficient funds are available for scholarship disbursement



## 3. Specific Requirements

### 3.1 Scholarship Application Management

#### 3.1.1 General
- FR-1. The system shall allow students to view all available scholarships and their requirements, including eligibility, required documents, and stipend details.
- FR-2. The system shall allow students to submit applications for eligible scholarships, upload required documents, and track application status.
- FR-3. The system shall verify that the applicant is a bona fide MinSU student (Registrar certification).
- FR-4. The system shall verify that the applicant has a regular load per semester (Registrar certification).
- FR-5. The system shall verify good moral character via Guidance Counselor certification.
- FR-6. The system shall ensure that no student receives more than one scholarship at a time.

#### 3.1.2 Academic Scholarships (Full/Partial)
- FR-7. The system shall allow students to apply for academic scholarships if they meet the following:
  - Computed GWA of 1.000–1.450 (Full) or 1.460–1.750 (Partial)
  - No grade below 1.75 in any course
  - No marks of “Dropped”, “Deferred”, or “Failed” in any subject (including NSTP)
  - Not receiving any other scholarship grants
  - Enrolled as a regular student with at least 18 units or prescribed load
- FR-8. The system shall require and verify Certification of Grades (Registrar-signed) for all applicants.
- FR-9. The system shall allow the Registrar to certify the list of qualified students each semester.
- FR-10. The system shall record and display stipend amounts (₱500/month for Full, ₱300/month for Partial) and fund source (Special Trust Fund/Student Development Fund).
- FR-11. The system shall ensure scholarship validity for one semester and manage renewal based on GWA and fund availability.

#### 3.1.3 Student Assistantship Program
- FR-12. The system shall allow students to apply for assistantship if they:
  - Submit a letter of intent to OSAS
  - Attach parent’s consent
  - Have no failing or incomplete grades in the previous semester
  - Pass pre-hiring screening by OSAS
- FR-13. The system shall verify that the student is enrolled in not more than 21 units per semester (Registrar certification).
- FR-14. The system shall allow OSAS to schedule and record pre-hiring screening results.
- FR-15. The system shall track assistantship assignments, hours worked, and student-rate wage disbursement.

#### 3.1.4 Performing Arts Scholarships
- FR-16. The system shall allow students to apply for performing arts scholarships if they:
  - Are active members of a MinSU-accredited group (at least one year for Full, one semester for Partial)
  - Participate in major local, regional, or national performances (Full) or at least two major university activities (Partial)
  - Are recommended by coach/adviser
- FR-17. The system shall allow coaches/advisers to submit recommendations and verify participation.

#### 3.1.5 Economically Deprived/Marginalized Students
- FR-18. The system shall allow students to apply for this scholarship if they:
  - Have a GWA of 2.25 or better
  - Present a valid Certification of Indigency from MSWDO
- FR-19. The system shall verify and store indigency certificates and GWA.

#### 3.1.6 Interview and Screening
- FR-20. The system shall schedule interviews for eligible applicants and notify them of schedule and requirements.
- FR-21. The system shall allow the Screening Committee to record interview results and recommendations.

#### 3.1.7 Awarding, Stipend, and Renewal
- FR-22. The system shall determine scholarship type (Full/Partial) and stipend based on GWA and other criteria.
- FR-23. The system shall record stipend amounts, disbursement dates, and fund sources.
- FR-24. The system shall track stipend disbursement and fund availability.
- FR-25. The system shall allow the Registrar to certify the list of qualified students.
- FR-26. The system shall generate reports on scholarship distribution, fund usage, and student performance.
- FR-27. The system shall manage scholarship renewal, including eligibility revalidation and document resubmission.

---
### 4.1 User Interfaces
- Web-based user interface for students, staff, and administrators
- Standard desktop and mobile devices

- Integration with university authentication (SSO)
- Email/SMS gateway for notifications


## 5. Other Non-Functional Requirements

### 5.1 Security
NFR-1. The system shall implement role-based access control.
NFR-2. The system shall encrypt sensitive data at rest and in transit.
NFR-3. The system shall maintain audit logs for all actions.

### 5.2 Usability
NFR-4. The system shall provide an intuitive user interface for students and staff.
NFR-5. The system shall be mobile-responsive.

### 5.3 Performance
NFR-6. The system shall support concurrent access by at least 500 users.
NFR-7. The system shall provide application response times of less than 2 seconds for all major actions.

### 5.4 Reliability & Availability
NFR-8. The system shall provide 99.5% uptime during academic periods.
NFR-9. The system shall perform daily backups of all data.

### 5.5 Maintainability
NFR-10. The system shall use a modular codebase for easy updates and bug fixes.
NFR-11. The system shall include comprehensive documentation.

---


## 6. Business Rules

- BR-1. Scholarships are valid for one semester and are renewable upon meeting all requirements and subject to fund availability.
- BR-2. No student may receive more than one scholarship or assistantship at a time.
- BR-3. Academic scholarships require a computed GWA of 1.750 or better, with no grade below 1.75, and no “Dropped”, “Deferred”, or “Failed” marks in any subject.
- BR-4. Academic scholarship applicants must be regular students with at least 18 units or prescribed load.
- BR-5. Assistantship applicants must not exceed 21 units per semester, must have no failing/incomplete grades in the previous semester, and must pass pre-hiring screening.
- BR-6. Assistantship applicants must submit a letter of intent and parent’s consent.
- BR-7. Performing arts scholars must meet membership duration and participation requirements, and be recommended by a coach/adviser.
- BR-8. Economically deprived/marginalized students must have a GWA of 2.25 or better and present a valid indigency certificate from MSWDO.
- BR-9. All applicants must be bona fide MinSU students and have good moral character (Guidance Counselor certification).
- BR-10. All required documents must be submitted and verified before awarding.

---


## 7. Data Model (Entities)

### 7.1 Entity List
- **Student**: id, name, student_number, course, year_level, contact_info, status, moral_character_certified (bool), registrar_certified (bool)
- **ScholarshipApplication**: id, student_id, scholarship_type_id, status (pending/approved/rejected/expired), date_applied, interview_score, renewal_flag, academic_gwa, grades_verified (bool), parent_consent (file), letter_of_intent (file), mswdo_indigency_certificate (file), coach_recommendation (file), membership_duration, participation_count, screening_result, certified_by_registrar (bool)
- **ScholarshipType**: id, name, description, requirements, stipend_amount, duration, min_gwa, min_units, max_units, is_renewable, fund_source
- **Document**: id, application_id, type (grades, consent, indigency, etc.), file_path, verified_by, date_uploaded
- **StipendDisbursement**: id, application_id, amount, date, status (pending/paid), fund_source
- **Notification**: id, user_id, message, date_sent, type (status, interview, stipend, renewal)
- **User**: id, name, role (student, staff, registrar, etc.), email

### 7.2 Relationships
- Student 1---* ScholarshipApplication
- ScholarshipApplication 1---* Document
- ScholarshipType 1---* ScholarshipApplication
- ScholarshipApplication 1---* StipendDisbursement
- User 1---* Notification

---

### 8.1 Student Application
1. Student logs in and views available scholarships.
3. Student uploads required documents.
4. System validates eligibility and notifies student of next steps.
2. System schedules interviews for eligible applicants.
3. Screening Committee records interview results.
5. System updates application status and notifies students.
### 8.3 Stipend Disbursement
1. System calculates stipend based on scholarship type.
2. Staff processes stipend disbursement.
3. System records transaction and notifies student.

### 8.4 Renewal
1. System notifies students of renewal period.
2. Student submits renewal application and updated documents.
3. System revalidates eligibility and updates status.

---

## 9. Appendices

### 9.1 Assumptions and Dependencies
- All students and staff have university-issued credentials.
- Required data (grades, enrollment, etc.) is available from SIS.
- Sufficient funds are available for scholarship disbursement.



### 9.2 Requirements Traceability Matrix
| Requirement ID | Description                                      | Source (Policy Section) | Design/Module Reference |
|---------------|--------------------------------------------------|------------------------|------------------------|
| FR-1          | View available scholarships and requirements      | 16.5, 16.4             | UI: Scholarship List   |
| FR-2          | Submit applications and upload documents          | 16.4, 16.5             | Application Module     |
| FR-3          | Verify bona fide student status                   | 16.4.a                 | Registrar Integration  |
| FR-4          | Verify regular load per semester                  | 16.4.b                 | Registrar Integration  |
| FR-5          | Verify good moral character                       | 16.4.c                 | Guidance Integration   |
| FR-6          | Prevent multiple scholarships per student         | 16.4.f                 | Business Logic         |
| FR-7          | Academic scholarship eligibility                  | 16.5.a                 | Application Logic      |
| FR-8          | Certification of Grades required                  | 16.4.e, 16.5.a.iv      | Document Module        |
| FR-9          | Registrar certifies qualified list                | 16.5.a.iv              | Registrar Integration  |
| FR-10         | Stipend calculation and fund source               | 16.5.a.iii             | Stipend Module         |
| FR-11         | Scholarship renewal management                    | 16.5.a.ii              | Renewal Module         |
| FR-12         | Assistantship application and screening           | 16.5.b                 | Application/Screening  |
| FR-13         | Assistantship eligibility (units, grades, consent)| 16.5.b                 | Application Logic      |
| FR-14         | Pre-hiring screening tracking                     | 16.5.b                 | Screening Module       |
| FR-15         | Assistantship wage disbursement                   | 16.5.b                 | Stipend Module         |
| FR-16         | Performing arts eligibility and recommendation    | 16.5.c                 | Application Logic      |
| FR-17         | Coach/adviser recommendation                      | 16.5.c                 | Document Module        |
| FR-18         | Marginalized student eligibility                  | 16.5.d                 | Application Logic      |
| FR-19         | Indigency certificate verification                | 16.5.d                 | Document Module        |
| FR-20         | Interview scheduling and results                  | 16.4.g, 16.5           | Interview Module       |
| FR-21         | Awarding, stipend, and renewal                    | 16.5                   | Awarding/Renewal       |
| ...           | ...                                              | ...                    | ...                    |

### 9.3 System Overview Diagram
Below is a high-level system architecture diagram (to be replaced with a graphical version during design):

```
       |                  |                    |                        |
       |<-----------------+--------------------+------------------------|
       |                 [Scholarship Management System (SMS)]          |
       |---------------->|   - Application Intake                        |
```
### 9.4 Expanded Data Model

#### Entity: Student
- id (PK)
- name
- student_number
- course
- year_level
- contact_info
- status

#### Entity: ScholarshipApplication
- id (PK)
- student_id (FK)
- scholarship_type_id (FK)
- status (pending/approved/rejected/expired)
- date_applied
- interview_score
- renewal_flag

#### Entity: ScholarshipType
- id (PK)
- name
- description
- requirements
- stipend_amount

#### Entity: Document
- id (PK)
- application_id (FK)
- date_uploaded

#### Entity: StipendDisbursement
- id (PK)
- application_id (FK)
- amount
- date
- status (pending/paid)

#### Entity: User
- id (PK)
- name
- role (student, staff, registrar, etc.)
- email

#### Entity: Notification
- id (PK)
- user_id (FK)
- message
- date_sent
- type (status, interview, stipend, renewal)

#### Relationships
- Student 1---* ScholarshipApplication
- ScholarshipApplication 1---* Document
- ScholarshipType 1---* ScholarshipApplication
- ScholarshipApplication 1---* StipendDisbursement
- User 1---* Notification

### 9.5 Glossary
- **Applicant**: A student applying for a scholarship or assistantship.
- **Certification of Grades**: Official document from Registrar listing grades.
- **Indigency Certificate**: Document from MSWDO certifying economic status.

---

##### 3.2.2 Usability

##### 3.2.4 Reliability & Availability

---
- Academic scholarships require a minimum GWA and no grade below 1.75.
- Assistantship applicants must not exceed 21 units per semester.

### 5. Data Model (Entities)
- **StipendDisbursement**: id, application_id, amount, date, status, etc.
- **User**: id, name, role, email, etc.

#### 6.1 Student Application
1. Staff reviews applications and verifies documents.
2. System schedules interviews for eligible applicants.
5. System updates application status and notifies students.
#### 6.3 Stipend Disbursement
1. System calculates stipend based on scholarship type.
2. Staff processes stipend disbursement.
3. System records transaction and notifies student.

#### 6.4 Renewal
1. System notifies students of renewal period.
2. Student submits renewal application and updated documents.
3. System revalidates eligibility and updates status.

---

### 7. External Interfaces

- Integration with Student Information System (SIS) for student data
- Integration with university authentication (SSO)
- Email/SMS gateway for notifications

---

### 8. Assumptions and Dependencies

- All students and staff have university-issued credentials.
- Required data (grades, enrollment, etc.) is available from SIS.
- Sufficient funds are available for scholarship disbursement.

---

This SRS/specification provides a comprehensive blueprint for developing the Scholarship Management System as described in the provided policy document.
