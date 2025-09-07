<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\ScholarshipApplication;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    public function definition(): array
    {
        $documentTypes = [
            Document::TYPE_GRADES,
            Document::TYPE_INDIGENCY,
            Document::TYPE_GOOD_MORAL,
            Document::TYPE_PARENT_CONSENT,
            Document::TYPE_RECOMMENDATION,
            Document::TYPE_TRANSCRIPTS,
            Document::TYPE_RECOMMENDATION_LETTER,
            Document::TYPE_FINANCIAL_STATEMENT,
        ];

        $type = fake()->randomElement($documentTypes);
        $fileName = fake()->word().'.'.fake()->randomElement(['pdf', 'jpg', 'png']);

        return [
            'application_id' => ScholarshipApplication::factory(),
            'type' => $type,
            'file_path' => 'scholarship-documents/'.fake()->numberBetween(1, 100).'/'.fake()->numberBetween(1, 100).'/'.$fileName,
            'original_name' => $fileName,
            'file_size' => fake()->numberBetween(1024, 5242880), // 1KB to 5MB
            'mime_type' => fake()->randomElement(['application/pdf', 'image/jpeg', 'image/png']),
            'status' => fake()->randomElement([Document::STATUS_PENDING, Document::STATUS_VERIFIED, Document::STATUS_REJECTED]),
            'verified_by' => null,
            'verified_at' => null,
            'verification_remarks' => null,
        ];
    }

    /**
     * Indicate that the document is verified.
     */
    public function verified(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Document::STATUS_VERIFIED,
                'verified_at' => fake()->dateTimeBetween('-1 month', 'now'),
            ];
        });
    }

    /**
     * Indicate that the document is pending.
     */
    public function pending(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Document::STATUS_PENDING,
                'verified_at' => null,
                'verified_by' => null,
                'rejection_reason' => null,
            ];
        });
    }

    /**
     * Indicate that the document is rejected.
     */
    public function rejected(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => Document::STATUS_REJECTED,
                'verified_at' => fake()->dateTimeBetween('-1 month', 'now'),
                'verification_remarks' => fake()->sentence(),
            ];
        });
    }
}
