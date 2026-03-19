<?php

namespace App\Services;

use App\Models\ApplicationComment;
use App\Models\Document;
use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class ScholarshipApplicationPresenter
{
    private const STATUS_LABELS = [
        ScholarshipApplication::STATUS_DRAFT => 'Draft',
        ScholarshipApplication::STATUS_SUBMITTED => 'Submitted',
        ScholarshipApplication::STATUS_UNDER_VERIFICATION => 'Under Verification',
        ScholarshipApplication::STATUS_INCOMPLETE => 'Incomplete Documents',
        ScholarshipApplication::STATUS_VERIFIED => 'Documents Verified',
        ScholarshipApplication::STATUS_UNDER_EVALUATION => 'Under Evaluation',
        ScholarshipApplication::STATUS_APPROVED => 'Approved',
        ScholarshipApplication::STATUS_REJECTED => 'Rejected',
        ScholarshipApplication::STATUS_END => 'Completed',
    ];

    private const STATUS_PROGRESS = [
        ScholarshipApplication::STATUS_DRAFT => 10,
        ScholarshipApplication::STATUS_SUBMITTED => 25,
        ScholarshipApplication::STATUS_UNDER_VERIFICATION => 40,
        ScholarshipApplication::STATUS_INCOMPLETE => 35,
        ScholarshipApplication::STATUS_VERIFIED => 60,
        ScholarshipApplication::STATUS_UNDER_EVALUATION => 80,
        ScholarshipApplication::STATUS_APPROVED => 100,
        ScholarshipApplication::STATUS_REJECTED => 100,
        ScholarshipApplication::STATUS_END => 100,
    ];

    public function presentStudentList(ScholarshipApplication $application): array
    {
        $application = $this->loadPresentationRelations($application);

        return array_merge($this->buildListPayload($application), [
            'can_edit' => in_array($application->status, [
                ScholarshipApplication::STATUS_DRAFT,
                ScholarshipApplication::STATUS_INCOMPLETE,
            ], true),
        ]);
    }

    public function presentStudentDetail(ScholarshipApplication $application): array
    {
        $application = $this->loadPresentationRelations($application);

        return array_merge($this->buildBasePayload($application), [
            'timeline' => $this->buildTimeline($application),
            'next_steps' => $this->buildNextSteps($application->status),
        ]);
    }

    public function presentStaffList(ScholarshipApplication $application): array
    {
        $application = $this->loadPresentationRelations($application);
        $list = $this->buildListPayload($application);

        return array_merge($list, [
            'student' => $this->buildStudent($application),
            'reviewer' => $this->buildReviewer($application),
        ]);
    }

    public function presentStaffReview(ScholarshipApplication $application, ?User $viewer = null): array
    {
        $application = $this->loadPresentationRelations($application);
        $detail = $this->presentStudentDetail($application);

        return array_merge($detail, [
            'student' => $this->buildStudent($application),
            'comments' => $this->buildComments($application),
            'progress_flags' => $this->buildProgressFlags($application),
            'reviewer' => $viewer ? [
                'id' => $viewer->id,
                'name' => $viewer->full_name,
                'email' => $viewer->email,
            ] : $this->buildReviewer($application),
        ]);
    }

    public function presentAdminList(ScholarshipApplication $application): array
    {
        $application = $this->loadPresentationRelations($application);
        $list = $this->buildListPayload($application);

        return array_merge($list, [
            'student' => $this->buildStudent($application),
            'reviewer' => $this->buildReviewer($application),
            'amount_received' => $application->amount_received ? (float) $application->amount_received : null,
            'approved_at' => $this->formatDateTime($application->approved_at),
            'rejected_at' => $this->formatDateTime($application->rejected_at),
        ]);
    }

    public function presentAdminDetail(ScholarshipApplication $application): array
    {
        $application = $this->loadPresentationRelations($application);
        $detail = $this->presentStudentDetail($application);

        return array_merge($detail, [
            'student' => $this->buildStudent($application),
            'reviewer' => $this->buildReviewer($application),
            'comments' => $this->buildComments($application),
            'approved_at' => $this->formatDateTime($application->approved_at),
            'rejected_at' => $this->formatDateTime($application->rejected_at),
            'verified_at' => $this->formatDateTime($application->verified_at),
            'amount_received' => $application->amount_received ? (float) $application->amount_received : null,
            'last_stipend_date' => $this->formatDateTime($application->last_stipend_date),
            'stipend_status' => $application->stipend_status,
        ]);
    }

    private function loadPresentationRelations(ScholarshipApplication $application): ScholarshipApplication
    {
        $application->loadMissing([
            'user.studentProfile',
            'scholarship',
            'documents.verifiedBy',
            'comments.user',
            'interview.interviewer',
            'reviewer',
        ]);

        return $application;
    }

    private function buildListPayload(ScholarshipApplication $application): array
    {
        $documentSummary = $this->buildDocumentSummary($application, false);
        $interviewSummary = $this->buildInterviewSummary($application);
        $reviewSummary = $this->buildReviewSummary($application);

        return [
            'id' => $application->id,
            'status' => $application->status,
            'status_label' => $this->getStatusLabel($application->status),
            'progress' => $this->getProgress($application->status),
            'priority' => $application->priority ?? ScholarshipApplication::PRIORITY_MEDIUM,
            'submitted_at' => $this->formatDateTime($application->applied_at ?: $application->created_at),
            'updated_at' => $this->formatDateTime($application->updated_at),
            'scholarship' => $this->buildScholarship($application),
            'document_summary' => $documentSummary,
            'interview_summary' => $interviewSummary,
            'review_summary' => $reviewSummary,
            'timeline' => $this->buildTimeline($application),
        ];
    }

    private function buildBasePayload(ScholarshipApplication $application): array
    {
        return array_merge($this->buildListPayload($application), [
            'created_at' => $this->formatDateTime($application->created_at),
            'application_data' => $application->application_data ?? [],
            'purpose_letter' => $application->purpose_letter ?: ($application->application_data['personal_statement'] ?? null),
            'academic_year' => $application->academic_year,
            'semester' => $application->semester,
        ]);
    }

    private function buildScholarship(ScholarshipApplication $application): array
    {
        $scholarship = $application->scholarship;
        $stipendAmount = $scholarship?->getStipendAmount();

        return [
            'id' => $scholarship?->id,
            'name' => $scholarship?->name ?? 'Unknown Scholarship',
            'type' => $scholarship?->type ?? 'unknown',
            'type_label' => $this->formatScholarshipType($scholarship?->type),
            'amount' => $stipendAmount,
            'amount_display' => $stipendAmount ? $this->formatCurrency($stipendAmount) . '/month' : 'Amount TBD',
            'description' => $scholarship?->description ?? '',
            'deadline' => $this->formatDateTime($scholarship?->deadline),
            'eligibility' => $scholarship?->getEligibilityCriteria() ?? [],
            'requirements' => array_values($scholarship?->getRequiredDocuments() ?? []),
            'required_documents' => collect($scholarship?->getRequiredDocuments() ?? [])
                ->map(fn (string $label, string $key) => ['key' => $key, 'label' => $label])
                ->values()
                ->all(),
        ];
    }

    private function buildStudent(ScholarshipApplication $application): array
    {
        $user = $application->user;
        $studentProfile = $user?->studentProfile;

        return [
            'id' => $user?->id,
            'name' => $user?->full_name ?? 'Unknown Student',
            'email' => $user?->email,
            'student_id' => $studentProfile?->student_id ?? 'N/A',
            'course' => $studentProfile?->course ?? 'N/A',
            'year_level' => $studentProfile?->year_level ?? 'N/A',
            'major' => $studentProfile?->major,
            'phone' => $studentProfile?->mobile_number,
            'address' => $this->buildStudentAddress($studentProfile),
            'gpa' => $studentProfile?->current_gwa ? (float) $studentProfile->current_gwa : null,
            'photo_url' => $user?->avatar,
        ];
    }

    private function buildDocumentSummary(ScholarshipApplication $application, bool $includeItems = true): array
    {
        $requiredDocuments = collect($application->scholarship?->getRequiredDocuments() ?? []);
        $uploadedMetadata = collect($application->uploaded_documents ?? []);
        $documents = $application->documents instanceof EloquentCollection
            ? $application->documents->sortByDesc('created_at')->groupBy('type')->map->first()
            : collect();

        $allTypes = $requiredDocuments->keys()
            ->merge($uploadedMetadata->keys())
            ->merge($documents->keys())
            ->unique()
            ->values();

        $items = $allTypes->map(function (string $type) use ($requiredDocuments, $uploadedMetadata, $documents) {
            /** @var Document|null $document */
            $document = $documents->get($type);
            $metadata = $uploadedMetadata->get($type);
            $required = $requiredDocuments->has($type);
            $uploaded = $document !== null || is_array($metadata);
            $status = $uploaded ? Document::STATUS_PENDING : 'missing';

            if ($document) {
                $status = $document->status;
            } elseif (is_array($metadata) && isset($metadata['verified']) && $metadata['verified'] === true) {
                $status = Document::STATUS_VERIFIED;
            }

            return [
                'id' => $document?->id,
                'type' => $type,
                'name' => $requiredDocuments->get($type, $this->humanizeKey($type)),
                'required' => $required,
                'uploaded' => $uploaded,
                'status' => $status,
                'uploaded_at' => $this->formatDateTime($document?->created_at ?? ($metadata['uploaded_at'] ?? null)),
                'verified_at' => $this->formatDateTime($document?->verified_at ?? null),
                'comments' => $document?->verification_remarks,
                'original_name' => $document?->original_name ?? ($metadata['original_name'] ?? null),
                'file_path' => $document?->file_path ?? ($metadata['path'] ?? null),
                'file_size' => $document?->file_size,
                'mime_type' => $document?->mime_type,
                'verified_by' => $document?->verifiedBy ? [
                    'id' => $document->verifiedBy->id,
                    'name' => $document->verifiedBy->full_name,
                ] : null,
            ];
        });

        return [
            'required_count' => $items->where('required', true)->count(),
            'uploaded_count' => $items->where('uploaded', true)->count(),
            'verified_count' => $items->where('status', Document::STATUS_VERIFIED)->count(),
            'pending_count' => $items->where('status', Document::STATUS_PENDING)->count(),
            'rejected_count' => $items->where('status', Document::STATUS_REJECTED)->count(),
            'items' => $includeItems ? $items->values()->all() : [],
        ];
    }

    private function buildInterviewSummary(ScholarshipApplication $application): array
    {
        $interview = $application->interview;
        $scheduledAt = $interview?->schedule ?? $application->interview_schedule;
        $status = $interview?->status ?? ($scheduledAt ? 'scheduled' : 'not_scheduled');
        $completed = $interview?->isCompleted()
            ?? ($scheduledAt !== null && $application->interview_notes !== null);

        return [
            'scheduled' => $scheduledAt !== null,
            'scheduled_at' => $this->formatDateTime($scheduledAt),
            'location' => $interview?->location,
            'type' => $interview?->interview_type,
            'status' => $status,
            'completed' => $completed,
            'remarks' => $interview?->remarks ?? $application->interview_notes,
            'recommendation' => $interview?->recommendation,
            'interviewer' => $interview?->interviewer ? [
                'id' => $interview->interviewer->id,
                'name' => $interview->interviewer->full_name,
            ] : null,
        ];
    }

    private function buildReviewSummary(ScholarshipApplication $application): array
    {
        return [
            'completed' => in_array($application->status, [
                ScholarshipApplication::STATUS_APPROVED,
                ScholarshipApplication::STATUS_REJECTED,
                ScholarshipApplication::STATUS_END,
            ], true),
            'feedback' => $application->verifier_comments,
            'committee_recommendation' => $application->committee_recommendation,
            'admin_remarks' => $application->admin_remarks,
            'reviewer' => $this->buildReviewer($application),
        ];
    }

    private function buildReviewer(ScholarshipApplication $application): ?array
    {
        if (! $application->reviewer) {
            return null;
        }

        return [
            'id' => $application->reviewer->id,
            'name' => $application->reviewer->full_name,
            'email' => $application->reviewer->email,
        ];
    }

    private function buildComments(ScholarshipApplication $application): array
    {
        return $application->comments
            ->sortByDesc('created_at')
            ->map(function (ApplicationComment $comment) {
                return [
                    'id' => $comment->id,
                    'comment' => $comment->comment,
                    'type' => $comment->type,
                    'created_at' => $this->formatDateTime($comment->created_at),
                    'created_at_human' => $comment->created_at?->diffForHumans(),
                    'user' => [
                        'id' => $comment->user?->id,
                        'name' => $comment->user?->full_name ?? 'Unknown User',
                    ],
                ];
            })
            ->values()
            ->all();
    }

    private function buildProgressFlags(ScholarshipApplication $application): array
    {
        $documentSummary = $this->buildDocumentSummary($application, false);
        $interviewSummary = $this->buildInterviewSummary($application);

        return [
            'submitted' => $application->status !== ScholarshipApplication::STATUS_DRAFT,
            'documents_verified' => $documentSummary['required_count'] > 0
                && $documentSummary['required_count'] === $documentSummary['verified_count'],
            'interview_completed' => $interviewSummary['completed'],
            'review_completed' => in_array($application->status, [
                ScholarshipApplication::STATUS_APPROVED,
                ScholarshipApplication::STATUS_REJECTED,
                ScholarshipApplication::STATUS_END,
            ], true),
        ];
    }

    private function buildTimeline(ScholarshipApplication $application): array
    {
        $timeline = [
            [
                'title' => 'Application Started',
                'description' => 'The scholarship application record was created.',
                'date' => $this->formatDateTime($application->created_at),
                'status' => 'completed',
                'icon' => 'document-plus',
            ],
        ];

        if ($application->applied_at) {
            $timeline[] = [
                'title' => 'Application Submitted',
                'description' => 'The application was submitted for OSAS review.',
                'date' => $this->formatDateTime($application->applied_at),
                'status' => 'completed',
                'icon' => 'check-circle',
            ];
        }

        if (in_array($application->status, [
            ScholarshipApplication::STATUS_UNDER_VERIFICATION,
            ScholarshipApplication::STATUS_INCOMPLETE,
            ScholarshipApplication::STATUS_VERIFIED,
            ScholarshipApplication::STATUS_UNDER_EVALUATION,
            ScholarshipApplication::STATUS_APPROVED,
            ScholarshipApplication::STATUS_REJECTED,
            ScholarshipApplication::STATUS_END,
        ], true)) {
            $timeline[] = [
                'title' => 'Under Verification',
                'description' => 'OSAS staff is verifying the submitted requirements.',
                'date' => null,
                'status' => in_array($application->status, [
                    ScholarshipApplication::STATUS_UNDER_VERIFICATION,
                    ScholarshipApplication::STATUS_INCOMPLETE,
                ], true) ? 'current' : 'completed',
                'icon' => 'eye',
            ];
        }

        if ($application->status === ScholarshipApplication::STATUS_INCOMPLETE) {
            $timeline[] = [
                'title' => 'Additional Documents Required',
                'description' => 'The application needs corrected or missing documents before review can continue.',
                'date' => $this->formatDateTime($application->updated_at),
                'status' => 'current',
                'icon' => 'alert-circle',
            ];
        }

        if (in_array($application->status, [
            ScholarshipApplication::STATUS_VERIFIED,
            ScholarshipApplication::STATUS_UNDER_EVALUATION,
            ScholarshipApplication::STATUS_APPROVED,
            ScholarshipApplication::STATUS_REJECTED,
            ScholarshipApplication::STATUS_END,
        ], true)) {
            $timeline[] = [
                'title' => 'Documents Verified',
                'description' => 'All required documents have been verified.',
                'date' => $this->formatDateTime($application->verified_at),
                'status' => $application->status === ScholarshipApplication::STATUS_VERIFIED ? 'current' : 'completed',
                'icon' => 'document-check',
            ];
        }

        $interviewSummary = $this->buildInterviewSummary($application);
        if ($interviewSummary['scheduled']) {
            $timeline[] = [
                'title' => 'Interview Scheduled',
                'description' => 'An interview was scheduled as part of scholarship evaluation.',
                'date' => $interviewSummary['scheduled_at'],
                'status' => $interviewSummary['completed'] ? 'completed' : 'current',
                'icon' => 'calendar',
            ];
        }

        if (in_array($application->status, [
            ScholarshipApplication::STATUS_UNDER_EVALUATION,
            ScholarshipApplication::STATUS_APPROVED,
            ScholarshipApplication::STATUS_REJECTED,
            ScholarshipApplication::STATUS_END,
        ], true)) {
            $timeline[] = [
                'title' => 'Under Evaluation',
                'description' => 'The scholarship committee is evaluating the application.',
                'date' => null,
                'status' => $application->status === ScholarshipApplication::STATUS_UNDER_EVALUATION ? 'current' : 'completed',
                'icon' => 'academic-cap',
            ];
        }

        if ($application->status === ScholarshipApplication::STATUS_APPROVED) {
            $timeline[] = [
                'title' => 'Application Approved',
                'description' => 'The scholarship application has been approved.',
                'date' => $this->formatDateTime($application->approved_at),
                'status' => 'completed',
                'icon' => 'check-badge',
            ];
        } elseif ($application->status === ScholarshipApplication::STATUS_REJECTED) {
            $timeline[] = [
                'title' => 'Application Rejected',
                'description' => 'The scholarship application was not approved.',
                'date' => $this->formatDateTime($application->rejected_at),
                'status' => 'completed',
                'icon' => 'x-circle',
            ];
        } elseif ($application->status === ScholarshipApplication::STATUS_END) {
            $timeline[] = [
                'title' => 'Application Completed',
                'description' => 'The scholarship application workflow has finished.',
                'date' => $this->formatDateTime($application->updated_at),
                'status' => 'completed',
                'icon' => 'check-badge',
            ];
        }

        return $timeline;
    }

    private function buildNextSteps(string $status): array
    {
        return match ($status) {
            ScholarshipApplication::STATUS_DRAFT => [
                'Complete the scholarship form.',
                'Upload every required document.',
                'Submit the application before the deadline.',
            ],
            ScholarshipApplication::STATUS_SUBMITTED => [
                'Wait for OSAS staff to begin document verification.',
                'Watch your notifications for any follow-up requests.',
            ],
            ScholarshipApplication::STATUS_UNDER_VERIFICATION => [
                'Wait for document verification to finish.',
                'Respond quickly if OSAS requests corrections or replacements.',
            ],
            ScholarshipApplication::STATUS_INCOMPLETE => [
                'Upload the missing or corrected documents.',
                'Resubmit so verification can continue.',
            ],
            ScholarshipApplication::STATUS_VERIFIED => [
                'Wait for committee evaluation.',
                'Be available in case an interview is scheduled.',
            ],
            ScholarshipApplication::STATUS_UNDER_EVALUATION => [
                'Attend the scheduled interview if required.',
                'Wait for the final decision from the scholarship committee.',
            ],
            ScholarshipApplication::STATUS_APPROVED => [
                'Review the scholarship guidelines and next instructions.',
                'Maintain the academic and conduct requirements of the grant.',
            ],
            ScholarshipApplication::STATUS_REJECTED => [
                'Review the feedback provided by OSAS.',
                'Consider applying to other scholarships you qualify for.',
            ],
            default => [],
        };
    }

    private function buildStudentAddress($studentProfile): ?string
    {
        if (! $studentProfile) {
            return null;
        }

        $address = array_filter([
            $studentProfile->street,
            $studentProfile->barangay,
            $studentProfile->city,
            $studentProfile->province,
        ]);

        return $address === [] ? null : implode(', ', $address);
    }

    private function getStatusLabel(string $status): string
    {
        return self::STATUS_LABELS[$status] ?? $this->humanizeKey($status);
    }

    private function getProgress(string $status): int
    {
        return self::STATUS_PROGRESS[$status] ?? 0;
    }

    private function humanizeKey(?string $value): string
    {
        if (! $value) {
            return 'Unknown';
        }

        return ucfirst(str_replace('_', ' ', $value));
    }

    private function formatScholarshipType(?string $type): string
    {
        return match ($type) {
            Scholarship::TYPE_ACADEMIC_FULL => 'Academic Scholarship (Full)',
            Scholarship::TYPE_ACADEMIC_PARTIAL => 'Academic Scholarship (Partial)',
            Scholarship::TYPE_STUDENT_ASSISTANTSHIP => 'Student Assistantship',
            Scholarship::TYPE_PERFORMING_ARTS_FULL => 'Performing Arts (Full)',
            Scholarship::TYPE_PERFORMING_ARTS_PARTIAL => 'Performing Arts (Partial)',
            Scholarship::TYPE_ECONOMIC_ASSISTANCE => 'Economic Assistance',
            default => $this->humanizeKey($type),
        };
    }

    private function formatCurrency(float $amount): string
    {
        return 'PHP ' . number_format($amount, 0);
    }

    private function formatDateTime($value): ?string
    {
        if ($value instanceof CarbonInterface) {
            return $value->toIso8601String();
        }

        if (is_string($value) && $value !== '') {
            return Carbon::parse($value)->toIso8601String();
        }

        return null;
    }
}
