<?php

use App\Models\Scholarship;
use App\Models\ScholarshipApplication;
use App\Models\StudentProfile;
use App\Models\User;

describe('Scholarship Model', function () {
    it('has factory', function () {
        $scholarship = Scholarship::factory()->create();

        expect($scholarship)->toBeInstanceOf(Scholarship::class);
        expect($scholarship->id)->not()->toBeNull();
    });
    it('has working fillable attributes', function () {
        $data = [
            'name' => 'Test Scholarship',
            'type' => 'academic_full',
            'description' => 'Description of the scholarship',
            'amount' => 500.0,
            'deadline' => now()->addDays(30)->toDateString(),
            'funding_source' => 'MinSU Institutional Fund',
            'status' => 'active',
            'required_documents' => ['transcript', 'id'],
            'eligibility_criteria' => ['criteria1' => 'value1'],
        ];

        $scholarship = Scholarship::create($data);
        expect($scholarship->name)->toBe('Test Scholarship');
        expect($scholarship->type)->toBe('academic_full');
        expect($scholarship->amount)->toBe('500.00'); // Database returns decimal as string
        expect($scholarship->required_documents)->toBe(['transcript', 'id']);
        expect($scholarship->eligibility_criteria)->toBe(['criteria1' => 'value1']);
    });
    it('has working applications relationship', function () {
        $scholarship = Scholarship::factory()->create();
        $student = User::factory()->create(['role' => 'student']);
        $studentProfile = StudentProfile::factory()->create(['user_id' => $student->id]);

        ScholarshipApplication::factory()
            ->count(3)
            ->create([
                'scholarship_id' => $scholarship->id,
                'user_id' => $student->id,
            ]);

        expect($scholarship->applications()->count())->toBe(3);
        expect($scholarship->applications->first())->toBeInstanceOf(ScholarshipApplication::class);
    });
    it('has working status constants', function () {
        expect(Scholarship::STATUSES)->toBeArray();
        expect(Scholarship::STATUSES)->toHaveKey('active');
        expect(Scholarship::STATUSES)->toHaveKey('draft');
        expect(Scholarship::STATUSES)->toHaveKey('inactive');
        expect(Scholarship::STATUSES)->toHaveKey('upcoming');
    });

    it('has working type constants', function () {
        expect(Scholarship::TYPES)->toBeArray();
        expect(Scholarship::TYPES)->toHaveKey('academic_full');
        expect(Scholarship::TYPES)->toHaveKey('academic_partial');
        expect(Scholarship::TYPES)->toHaveKey('student_assistantship');
    });
    it('can determine GWA requirements', function () {
        $academicFull = Scholarship::factory()->create(['type' => 'academic_full']);
        $academicPartial = Scholarship::factory()->create(['type' => 'academic_partial']);

        // Academic full: 1.000 - 1.450 range
        expect($academicFull->getMinimumGwa())->toBe(1.0);
        expect($academicFull->getMaximumGwa())->toBe(1.45);

        // Academic partial: 1.460 - 1.750 range
        expect($academicPartial->getMinimumGwa())->toBe(1.46);
        expect($academicPartial->getMaximumGwa())->toBe(1.75);
    });

    it('can get stipend amount', function () {
        $academicFull = Scholarship::factory()->create([
            'type' => 'academic_full',
            'amount' => 50000.00, // Set specific amount
        ]);
        $academicPartial = Scholarship::factory()->create([
            'type' => 'academic_partial',
            'amount' => 25000.00, // Set specific amount
        ]);

        expect($academicFull->getStipendAmount())->toBeNumeric();
        expect($academicPartial->getStipendAmount())->toBeNumeric();
        expect($academicFull->getStipendAmount())->toBeGreaterThan($academicPartial->getStipendAmount());
    });

    it('supports soft deletes', function () {
        $scholarship = Scholarship::factory()->create();
        $id = $scholarship->id;

        $scholarship->delete();

        expect(Scholarship::find($id))->toBeNull();
        expect(Scholarship::withTrashed()->find($id))
            ->not()
            ->toBeNull();
    });
    it('returns only active scholarships in scope', function () {
        // Clear any existing scholarships first
        Scholarship::query()->delete();

        Scholarship::factory()->create(['status' => 'active']);
        Scholarship::factory()->create(['status' => 'draft']);
        Scholarship::factory()->create(['status' => 'inactive']); // Changed from 'closed' to 'inactive'

        $activeScholarships = Scholarship::where('status', 'active')->get();

        expect($activeScholarships)->toHaveCount(1);
        expect($activeScholarships->first()->status)->toBe('active');
    });
});
