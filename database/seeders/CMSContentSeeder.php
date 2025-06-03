<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class CMSContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create announcements
        $announcements = [
            [
                'title' => 'New Scholarship Programs Available',
                'slug' => 'new-scholarship-programs-available-2025-06-02',
                'content' => [
                    'type' => 'announcement',
                    'description' => 'Several new scholarship opportunities have been added for the upcoming academic year. Check them out in the scholarships section.',
                    'category' => 'Scholarship',
                    'priority' => 'high',
                    'date' => '2025-05-15',
                ],
            ],
            [
                'title' => 'Application Deadline Extension',
                'slug' => 'application-deadline-extension-2025-06-02',
                'content' => [
                    'type' => 'announcement',
                    'description' => 'The deadline for Merit-Based Scholarship applications has been extended to June 30, 2025. Make sure to submit your applications before the new deadline.',
                    'category' => 'Deadlines',
                    'priority' => 'medium',
                    'date' => '2025-05-10',
                ],
            ],
            [
                'title' => 'Scholarship Orientation Schedule',
                'slug' => 'scholarship-orientation-schedule-2025-06-02',
                'content' => [
                    'type' => 'announcement',
                    'description' => 'Mandatory orientation for all new scholarship recipients will be held next week. Check the schedule for your assigned time slot.',
                    'category' => 'Events',
                    'priority' => 'high',
                    'date' => '2025-05-05',
                ],
            ],
            [
                'title' => 'Document Submission Reminder',
                'slug' => 'document-submission-reminder-2025-06-02',
                'content' => [
                    'type' => 'announcement',
                    'description' => 'This is a reminder for all scholarship holders to submit their mid-term grades by May 25, 2025.',
                    'category' => 'Requirements',
                    'priority' => 'medium',
                    'date' => '2025-05-01',
                ],
            ],
        ];

        foreach ($announcements as $announcement) {
            Page::updateOrCreate(
                ['slug' => $announcement['slug']],
                $announcement
            );
        }

        // Create scholarships
        $scholarships = [
            [
                'title' => 'Academic Scholarship (Full)',
                'slug' => 'academic-scholarship-full-2025-06-02',
                'content' => [
                    'type' => 'scholarship',
                    'description' => "President's Lister Scholarship for exceptional academic achievement",
                    'amount' => 'PHP 500/month',
                    'deadline' => '2025-06-30',
                    'daysRemaining' => 28,
                    'scholarshipType' => 'Academic Scholarship',
                    'requirements' => [
                        'GWA between 1.000 - 1.450',
                        'No grade below 1.75 in any course',
                        'No Dropped/Deferred/Failed marks',
                        'Minimum of 18 units enrollment',
                    ],
                ],
            ],
            [
                'title' => 'Academic Scholarship (Partial)',
                'slug' => 'academic-scholarship-partial-2025-06-02',
                'content' => [
                    'type' => 'scholarship',
                    'description' => "Dean's Lister Scholarship for outstanding academic performance",
                    'amount' => 'PHP 300/month',
                    'deadline' => '2025-06-30',
                    'daysRemaining' => 28,
                    'scholarshipType' => 'Academic Scholarship',
                    'requirements' => [
                        'GWA between 1.460 - 1.750',
                        'No grade below 1.75 in any course',
                        'No Dropped/Deferred/Failed marks',
                        'Minimum of 18 units enrollment',
                    ],
                ],
            ],
            [
                'title' => 'Student Assistantship Program',
                'slug' => 'student-assistantship-program-2025-06-02',
                'content' => [
                    'type' => 'scholarship',
                    'description' => 'Work opportunity for students to earn while studying',
                    'amount' => 'Student Rate',
                    'deadline' => '2025-06-30',
                    'daysRemaining' => 28,
                    'scholarshipType' => 'Student Assistantship Program',
                    'requirements' => [
                        'Maximum load of 21 units',
                        'No failing grades from previous semester',
                        'Must pass pre-hiring screening',
                        "Must submit parent's consent",
                    ],
                ],
            ],
            [
                'title' => 'MinSU Performing Arts (Full)',
                'slug' => 'minsu-performing-arts-full-2025-06-02',
                'content' => [
                    'type' => 'scholarship',
                    'description' => 'For active members of MinSU performing arts groups',
                    'amount' => 'Full Scholarship',
                    'deadline' => '2025-06-30',
                    'daysRemaining' => 28,
                    'scholarshipType' => 'Performing Arts Scholarship',
                    'requirements' => [
                        'Active member for at least 1 year',
                        'Participated in major local/regional/national events',
                        'Must be recommended by coach/adviser',
                    ],
                ],
            ],
            [
                'title' => 'MinSU Performing Arts (Partial)',
                'slug' => 'minsu-performing-arts-partial-2025-06-02',
                'content' => [
                    'type' => 'scholarship',
                    'description' => 'For members of MinSU performing arts groups',
                    'amount' => 'Partial Scholarship',
                    'deadline' => '2025-06-30',
                    'daysRemaining' => 28,
                    'scholarshipType' => 'Performing Arts Scholarship',
                    'requirements' => [
                        'Member for at least 1 semester',
                        'Performed in 2+ major University activities',
                        'Must be recommended by coach/adviser',
                    ],
                ],
            ],
            [
                'title' => 'Economic Assistance Grant',
                'slug' => 'economic-assistance-grant-2025-06-02',
                'content' => [
                    'type' => 'scholarship',
                    'description' => 'Financial support for economically disadvantaged students',
                    'amount' => 'Financial Aid',
                    'deadline' => '2025-06-30',
                    'daysRemaining' => 28,
                    'scholarshipType' => 'Economic Assistance',
                    'requirements' => [
                        'General Weighted Average of 2.25',
                        'Must provide MSWDO Indigency Certificate',
                    ],
                ],
            ],
        ];

        foreach ($scholarships as $scholarship) {
            Page::updateOrCreate(
                ['slug' => $scholarship['slug']],
                $scholarship
            );
        }
    }
}
