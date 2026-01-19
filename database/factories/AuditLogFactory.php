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
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'action' => fake()->randomElement([
                'scholarship_approval',
                'stipend_release',
                'user_management',
                'document_verification',
                'scholarship_rejection',
                'stipend_cancellation',
                'account_creation',
                'account_deletion',
            ]),
            'entity_type' => fake()->randomElement([
                Scholarship::class,
                ScholarshipStipend::class,
                User::class,
                Document::class,
            ]),
            'entity_id' => function () {
                $type = fake()->randomElement(['scholarship', 'user', 'document']);
                return match ($type) {
                    'scholarship' => Scholarship::factory()->create()->id,
                    'user' => null, // User entity ID will be set when testing user management
                    'document' => null, // Document entity ID will be set when testing document verification
                };
            },
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
}
}
