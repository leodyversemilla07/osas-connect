# Scholarship Application Process Flow

## Overview
This diagram shows the complete flow of scholarship applications in the OSAS Connect system, based on the status transitions defined in the `ScholarshipApplication` model.

## Mermaid Diagram

```mermaid
flowchart TD
    A[Student Creates Application] --> B[Draft Status]
    B --> C{Student Submits Application}
    C --> D[Submitted Status]
    
    D --> E{OSAS Staff Initial Review}
    E -->|Complete & Eligible| F[Under Verification]
    E -->|Missing Documents| G[Incomplete]
    E -->|Basic Requirements Not Met| H[Rejected]
    
    F --> I{Document Verification}
    I -->|All Documents Valid| J[Verified]
    I -->|Missing/Invalid Documents| G
    I -->|Eligibility Issues| H
    
    G --> K{Student Resubmits}
    K -->|Provides Missing Items| D
    K -->|Deadline Passed/No Response| H
    
    J --> L[Under Evaluation]
    L --> M{Committee Evaluation}
    M -->|Interview Required| N[Schedule Interview]
    N --> O[Conduct Interview]
    O --> P{Final Decision}
    M -->|No Interview Required| P
    
    P -->|Meets All Criteria| Q[Approved]
    P -->|Doesn't Meet Criteria| H
    
    Q --> R[End - Scholarship Awarded]
    H --> S[End - Application Closed]
    
    %% Additional Processes
    Q --> T[Stipend Processing]
    T --> U[Disbursement]
    U --> V[Renewal Evaluation]
    V -->|Eligible| W[Renewal Process]
    V -->|Not Eligible| X[Scholarship Ends]
    
    %% Styling
    classDef startEnd fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef process fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef decision fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef approved fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef rejected fill:#ffebee,stroke:#c62828,stroke-width:2px
    
    class A,R,S,X startEnd
    class B,D,F,G,J,L,N,O,T,U,V,W process
    class C,E,I,K,M,P decision
    class Q,U approved
    class H rejected
```

## Status Definitions

### Main Application Statuses
- **Draft**: Application being prepared by student
- **Submitted**: Complete application submitted for review
- **Under Verification**: OSAS staff verifying documents and eligibility
- **Incomplete**: Missing documents or information required
- **Verified**: All documents and eligibility confirmed
- **Under Evaluation**: Committee reviewing and evaluating application
- **Approved**: Application approved for scholarship award
- **Rejected**: Application denied
- **End**: Final status, no further transitions

### Priority Levels
- **Urgent**: Requires immediate attention
- **High**: High priority applications
- **Medium**: Standard priority
- **Low**: Lower priority

## Key Validation Points

### Document Verification (`areDocumentsComplete()`)
- Checks if all required documents are uploaded
- Validates document authenticity and completeness
- Staff can verify individual documents

### Eligibility Criteria (`meetsEligibilityCriteria()`)
The system checks various scholarship-specific criteria:
- **Academic Full/Partial**: GWA requirements, course load, grades
- **Student Assistantship**: Units enrolled, screening completion
- **Performing Arts**: Group membership, performance participation
- **Economic Assistance**: Financial need, indigency certification

### Status Transition Rules (`canTransitionTo()`)
- **Draft** → Submitted only
- **Submitted** → Under Verification, Incomplete, or Rejected
- **Under Verification** → Verified, Incomplete, or Rejected
- **Incomplete** → Submitted or Rejected
- **Verified** → Under Evaluation or Rejected
- **Under Evaluation** → Approved or Rejected
- **Approved/Rejected** → End

## Additional Features

### Timeline Tracking
- `buildApplicationTimeline()` creates audit trail
- Timestamps for each status change
- Reviewer and comments tracking

### Interview Management
- Optional interview scheduling
- Interview notes and scoring
- Integration with evaluation process

### Stipend Management
- Stipend status tracking (pending, processing, released)
- Disbursement history
- Renewal eligibility assessment

### Reporting and Analytics
- Application statistics by status
- Performance metrics and trends
- Export functionality for reports
```

## Detailed State Diagram

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Submitted : Student submits application
    
    Submitted --> Under_Verification : Initial review passed
    Submitted --> Incomplete : Missing documents
    Submitted --> Rejected : Basic requirements not met
    
    Under_Verification --> Verified : All documents valid
    Under_Verification --> Incomplete : Invalid/missing documents
    Under_Verification --> Rejected : Eligibility issues
    
    Incomplete --> Submitted : Student provides missing items
    Incomplete --> Rejected : Deadline passed
    
    Verified --> Under_Evaluation : Ready for committee review
    Verified --> Rejected : Late eligibility issues
    
    Under_Evaluation --> Approved : Meets all criteria
    Under_Evaluation --> Rejected : Doesn't meet criteria
    
    Approved --> End : Process completed
    Rejected --> End : Process completed
    
    End --> [*]
    
    note right of Under_Verification
        Document verification
        Eligibility checking
        Staff review
    end note
    
    note right of Under_Evaluation
        Committee review
        Interview (optional)
        Final scoring
    end note
```
