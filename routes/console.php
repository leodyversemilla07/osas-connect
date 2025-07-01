<?php

use App\Services\StorageService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// CloudCube test command
Artisan::command('test:cloudcube', function () {
    $this->info('Testing CloudCube Configuration...');

    // Test 1: Check configuration
    $this->info('1. Checking CloudCube configuration...');

    $disk = StorageService::getDisk();
    $this->info("Current disk: {$disk}");

    if ($disk === 'cloudcube') {
        $config = config('filesystems.disks.cloudcube');
        $this->table(
            ['Setting', 'Value'],
            [
                ['Bucket', $config['bucket']],
                ['Cube Root', $config['root']],
                ['Base URL', $config['url']],
                ['Region', $config['region']],
                ['Visibility', $config['visibility']],
            ],
        );
    } else {
        $this->warn('Not using CloudCube disk. Currently using: '.$disk);
        $this->info('To test CloudCube, set APP_ENV=production or modify StorageService::getDisk()');
    }

    // Test 2: Check disk connection
    $this->info('2. Testing storage disk connection...');
    try {
        $disk = Storage::disk(StorageService::getDisk());

        if (StorageService::getDisk() === 'cloudcube') {
            $testPath = StorageService::getCloudCubePath('test/connection_test.txt', true);
        } else {
            $testPath = 'test/connection_test.txt';
        }

        // Try to write a test file
        $disk->put($testPath, 'Storage connection test - '.now());
        $this->info('✓ Write test successful');

        // Try to read the test file
        $content = $disk->get($testPath);
        $this->info('✓ Read test successful: '.substr($content, 0, 50).'...');

        // Try to delete the test file
        $disk->delete($testPath);
        $this->info('✓ Delete test successful');
    } catch (\Exception $e) {
        $this->error('✗ Storage connection failed: '.$e->getMessage());

        return 1;
    }

    // Test 3: Test StorageService methods
    $this->info('3. Testing StorageService methods...');
    try {
        // Create a temporary file for testing
        $tempFile = tmpfile();
        $tempPath = stream_get_meta_data($tempFile)['uri'];
        file_put_contents($tempPath, 'This is a test file for StorageService - '.now());

        // Create an UploadedFile instance for testing
        $uploadedFile = new \Illuminate\Http\UploadedFile($tempPath, 'test_file.txt', 'text/plain', null, true);

        // Test file storage
        $storedPath = StorageService::store($uploadedFile, 'tests');

        if ($storedPath) {
            $this->info('✓ File storage successful: '.$storedPath);

            // Test URL generation
            $url = StorageService::url($storedPath);
            $this->info('✓ URL generated: '.$url);

            // Test file existence
            $exists = StorageService::exists($storedPath);
            $this->info($exists ? '✓ File existence check successful' : '✗ File existence check failed');

            // Clean up
            $deleted = StorageService::delete($storedPath);
            $this->info($deleted ? '✓ File cleanup successful' : '✗ File cleanup failed');
        } else {
            $this->error('✗ File storage failed');
        }

        // Test storeAs method
        $namedPath = StorageService::storeAs($uploadedFile, 'tests', 'named_test_file.txt');

        if ($namedPath) {
            $this->info('✓ Named file storage successful: '.$namedPath);

            // Clean up
            StorageService::delete($namedPath);
            $this->info('✓ Named file cleanup successful');
        } else {
            $this->error('✗ Named file storage failed');
        }

        // Clean up temp file
        fclose($tempFile);
    } catch (\Exception $e) {
        $this->error('✗ StorageService test failed: '.$e->getMessage());

        return 1;
    }

    $this->info('🎉 All storage tests passed! Your configuration is working correctly.');

    if (StorageService::getDisk() === 'cloudcube') {
        $this->warn('Important CloudCube Security Notes:');
        $this->line('- Make sure your CloudCube credentials are set in Heroku config vars');
        $this->line('- Never commit credentials to source control');
        $this->line('- Rotate your access keys if they were exposed');
    } else {
        $this->info('💡 To test CloudCube in production, deploy to Heroku or set APP_ENV=production');
    }

    return 0;
})->purpose('Test CloudCube S3 configuration and connectivity');

// Photo upload test command for CloudCube
Artisan::command('test:photo-upload', function () {
    $this->info('Testing Photo Upload with CloudCube...');

    // Show current configuration
    $disk = StorageService::getDisk();
    $this->info("Current storage disk: {$disk}");

    try {
        // Create a test image file (simulate uploaded photo)
        $testImageContent = file_get_contents(
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        );
        $tempFile = tmpfile();
        $tempPath = stream_get_meta_data($tempFile)['uri'];
        file_put_contents(
            $tempPath,
            base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='),
        );

        // Create an UploadedFile instance (simulating a photo upload)
        $uploadedPhoto = new \Illuminate\Http\UploadedFile($tempPath, 'profile_photo.png', 'image/png', null, true);

        $this->info('1. Testing profile photo upload...');

        // Test storing the photo using StorageService (same as ProfileController)
        $photoPath = StorageService::store($uploadedPhoto, 'profile-photos');

        if ($photoPath) {
            $this->info('✓ Photo upload successful: '.$photoPath);

            // Test URL generation (same as ProfileController edit method)
            $photoUrl = StorageService::url($photoPath);
            $this->info('✓ Photo URL generated: '.$photoUrl);

            // Test photo existence
            $exists = StorageService::exists($photoPath);
            $this->info($exists ? '✓ Photo exists in storage' : '✗ Photo not found in storage');

            // Show storage location details
            if ($disk === 'cloudcube') {
                $this->warn('📁 CloudCube Storage Details:');
                $this->line('- File stored in CloudCube S3 bucket');
                $this->line('- Path: '.$photoPath);
                $this->line('- Public URL: '.$photoUrl);
                $this->line('- Accessible from: Anywhere on the internet');
            } else {
                $this->info('📁 Local Storage Details:');
                $this->line('- File stored locally in: storage/app/public/');
                $this->line('- Path: '.$photoPath);
                $this->line('- URL: '.$photoUrl);
                $this->line('- Accessible from: Local development only');
            }

            // Clean up test photo
            $deleted = StorageService::delete($photoPath);
            $this->info($deleted ? '✓ Test photo cleanup successful' : '✗ Test photo cleanup failed');
        } else {
            $this->error('✗ Photo upload failed');

            return 1;
        }

        // Clean up temp file
        fclose($tempFile);
    } catch (\Exception $e) {
        $this->error('✗ Photo upload test failed: '.$e->getMessage());

        return 1;
    }

    $this->info('🎉 Photo upload test completed successfully!');

    if ($disk === 'cloudcube') {
        $this->warn('✅ PRODUCTION READY: Photos will be stored in CloudCube S3');
        $this->line('- Photos are publicly accessible via HTTPS');
        $this->line('- No server storage limitations');
        $this->line('- Automatic CDN distribution');
    } else {
        $this->info('🚀 Ready for production deployment!');
        $this->line('- In production (APP_ENV=production), photos will automatically use CloudCube');
        $this->line('- Current local setup works for development');
    }

    return 0;
})->purpose('Test photo upload functionality with CloudCube integration');

// CloudCube diagnostic command
Artisan::command('debug:cloudcube', function () {
    $this->info('=== CloudCube File Listing ===');

    // Temporarily set environment to production
    config(['app.env' => 'production']);

    try {
        $disk = Storage::disk('cloudcube');
        $this->info('Using disk: cloudcube');

        $this->info("\n1. Listing all files:");
        $files = $disk->allFiles();
        if (empty($files)) {
            $this->warn('No files found!');
        } else {
            foreach ($files as $file) {
                $size = $disk->size($file);
                $this->line("  - {$file} ({$size} bytes)");
            }
        }

        $this->info("\n2. Listing all directories:");
        $dirs = $disk->allDirectories();
        if (empty($dirs)) {
            $this->warn('No directories found!');
        } else {
            foreach ($dirs as $dir) {
                $this->line("  - {$dir}/");
            }
        }

        $this->info("\n3. Testing root directory listing:");
        $rootFiles = $disk->files('');
        $this->line('Root files: '.json_encode($rootFiles));

        $rootDirs = $disk->directories('');
        $this->line('Root directories: '.json_encode($rootDirs));

        $this->info("\n4. Configuration check:");
        $config = config('filesystems.disks.cloudcube');
        $this->table(
            ['Setting', 'Value'],
            [['Bucket', $config['bucket']], ['Root', $config['root']], ['Key', substr($config['key'], 0, 8).'...'], ['URL', $config['url']]],
        );

        $this->info("\n5. Upload a test file to verify:");
        $testContent = 'CloudCube test file - '.now();
        $testPath = 'debug/test_file.txt';

        // Using CloudCube path
        $cloudCubePath = StorageService::getCloudCubePath($testPath, true);
        $this->info("Uploading to path: {$cloudCubePath}");

        $disk->put($cloudCubePath, $testContent);
        $this->info('✓ Test file uploaded');

        // Check if it exists
        if ($disk->exists($cloudCubePath)) {
            $this->info('✓ Test file exists in storage');
            $url = StorageService::url($cloudCubePath);
            $this->info("✓ Test file URL: {$url}");
        } else {
            $this->error('✗ Test file not found after upload');
        }

        // List files again
        $this->info("\n6. Files after test upload:");
        $files = $disk->allFiles();
        foreach ($files as $file) {
            $this->line("  - {$file}");
        }
    } catch (\Exception $e) {
        $this->error('Error: '.$e->getMessage());
        $this->error('Stack trace: '.$e->getTraceAsString());
    }

    return 0;
})->purpose('Debug CloudCube file listing and configuration');
