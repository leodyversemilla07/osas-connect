<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\Scholarship;
use App\Models\ScholarshipStipend;
use App\Models\User;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AuditLog>
 */
class AuditLogFactory extends Factory
{
    public function configure(): static
    {
        return $this->afterMaking(function (AuditLog $audit): void {
            $this->synchronizeEntityForAction($audit);
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $action = fake()->randomElement([
            'scholarship_approval',
            'stipend_release',
            'user_management',
            'document_verification',
            'scholarship_rejection',
            'stipend_cancellation',
            'account_creation',
            'account_deletion',
        ]);

        $entityType = match ($action) {
            'scholarship_approval', 'scholarship_rejection' => Scholarship::class,
            'stipend_release', 'stipend_cancellation' => ScholarshipStipend::class,
            'document_verification' => Document::class,
            default => User::class,
        };

        $entityId = match ($entityType) {
            Scholarship::class => Scholarship::factory()->create()->getKey(),
            ScholarshipStipend::class => ScholarshipStipend::factory()->create()->getKey(),
            User::class => User::factory()->create()->getKey(),
            Document::class => Document::factory()->create()->getKey(),
        };

        return [
            'user_id' => User::factory(),
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => null,
            'new_values' => fake()->randomElement([
                ['status' => 'approved'],
                ['status' => 'released', 'amount' => fake()->randomFloat(100, 1000)],
                ['role' => 'admin', 'is_active' => true],
                ['role' => 'student', 'is_active' => false],
            ]),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'description' => fake()->sentence(),
        ];
    }

    private function synchronizeEntityForAction(AuditLog $audit): void
    {
        $entityType = match ($audit->action) {
            'scholarship_approval', 'scholarship_rejection' => Scholarship::class,
            'stipend_release', 'stipend_cancellation' => ScholarshipStipend::class,
            'document_verification' => Document::class,
            default => User::class,
        };

        if ($audit->entity_type === $entityType && $audit->entity_id) {
            return;
        }

        $entityId = match ($entityType) {
            Scholarship::class => Scholarship::factory()->create()->getKey(),
            ScholarshipStipend::class => ScholarshipStipend::factory()->create()->getKey(),
            User::class => User::factory()->create()->getKey(),
            Document::class => Document::factory()->create()->getKey(),
        };

        $audit->entity_type = $entityType;
        $audit->entity_id = $entityId;
    }
}
