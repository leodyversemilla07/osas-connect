# CloudCube S3 Storage Setup Guide

This guide explains how to configure and use CloudCube S3 storage for file uploads in your Laravel application deployed on Heroku.

## What is CloudCube?

CloudCube is a Heroku add-on that provides S3-compatible cloud storage. It pre-creates an S3 bucket and gives each add-on instance a dedicated "cube" (prefix) within that bucket.

## URL Structure

CloudCube URLs follow this pattern:
```
https://BUCKETNAME.s3.amazonaws.com/CUBENAME/...
```

For our application:
- **Bucket Name**: `cloud-cube`
- **Cube Name**: `m2on55doosrx` (your personal prefix)
- **Example File URL**: `https://cloud-cube.s3.amazonaws.com/m2on55doosrx/public/my-photo.jpg`

## Heroku Setup

### 1. Add CloudCube to Your Heroku App

```bash
heroku addons:create cloudcube:basic
```

### 2. Get Your CloudCube Credentials

```bash
heroku config:get CLOUDCUBE_URL
# Returns: https://cloud-cube.s3.amazonaws.com/m2on55doosrx

heroku addons:open cloudcube
# Opens CloudCube dashboard to get Access Key and Secret
```

### 3. Set Environment Variables

In your Heroku config vars, set:

```bash
heroku config:set CLOUDCUBE_ACCESS_KEY_ID=your_access_key_here
heroku config:set CLOUDCUBE_SECRET_ACCESS_KEY=your_secret_key_here
heroku config:set CLOUDCUBE_BUCKET=cloud-cube
heroku config:set CLOUDCUBE_CUBE_NAME=m2on55doosrx
heroku config:set CLOUDCUBE_BASE_URL=https://cloud-cube.s3.amazonaws.com/m2on55doosrx
```

## Laravel Configuration

### 1. Filesystem Configuration

The `config/filesystems.php` file is already configured with the CloudCube disk:

```php
'cloudcube' => [
    'driver' => 's3',
    'key' => env('CLOUDCUBE_ACCESS_KEY_ID'),
    'secret' => env('CLOUDCUBE_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'bucket' => env('CLOUDCUBE_BUCKET', 'cloud-cube'),
    'root' => env('CLOUDCUBE_CUBE_NAME', 'm2on55doosrx'),
    'url' => env('CLOUDCUBE_BASE_URL'),
    'visibility' => 'public',
    'throw' => false,
    'report' => false,
],
```

### 2. Environment Variables

For local development, add these to your `.env` file (with empty values):

```env
CLOUDCUBE_ACCESS_KEY_ID=
CLOUDCUBE_SECRET_ACCESS_KEY=
CLOUDCUBE_BUCKET=cloud-cube
CLOUDCUBE_CUBE_NAME=m2on55doosrx
CLOUDCUBE_BASE_URL=https://cloud-cube.s3.amazonaws.com/m2on55doosrx
```

## Usage

### Using the CloudCubeService

The application includes a dedicated `CloudCubeService` class for easy file operations:

```php
use App\Services\CloudCubeService;

// Upload a public file (directly accessible via URL)
$path = CloudCubeService::uploadPublic($uploadedFile, 'my-document.pdf', 'documents');
if ($path) {
    $publicUrl = CloudCubeService::getPublicUrl($path);
    echo "File available at: " . $publicUrl;
}

// Upload a private file (requires signed URL for access)
$path = CloudCubeService::uploadPrivate($uploadedFile, 'sensitive.pdf', 'private-docs');
if ($path) {
    $signedUrl = CloudCubeService::getSignedUrl($path, 60); // 60 minutes expiry
    echo "Download link: " . $signedUrl;
}

// Check if file exists
if (CloudCubeService::exists($path)) {
    echo "File exists!";
}

// Delete a file
if (CloudCubeService::delete($path)) {
    echo "File deleted successfully";
}
```

### Using the StorageService

The `StorageService` automatically switches between local storage (development) and CloudCube (production):

```php
use App\Services\StorageService;

// Store file (automatically uses correct disk)
$path = StorageService::store($uploadedFile, 'documents');

// Get URL (automatically generates correct URL)
$url = StorageService::url($path);

// Delete file
StorageService::delete($path);
```

### Direct Laravel Storage Usage

You can also use Laravel's Storage facade directly:

```php
use Illuminate\Support\Facades\Storage;

// Upload to CloudCube
$path = Storage::disk('cloudcube')->putFile('m2on55doosrx/public/uploads', $file);

// Get a temporary signed URL for private files
$url = Storage::disk('cloudcube')->temporaryUrl('m2on55doosrx/private/document.pdf', now()->addHour());
```

## File Organization

### Public Files (Direct Access)
```
m2on55doosrx/public/
├── profiles/           # User profile photos
├── uploads/           # General file uploads
├── assets/           # Application assets
└── exports/          # Public reports and exports
```

### Private Files (Signed URL Access)
```
m2on55doosrx/private/
├── applications/     # Scholarship application documents
├── reports/         # Sensitive reports
├── documents/       # User private documents
└── backups/        # System backups
```

## Security Best Practices

1. **Never commit credentials**: CloudCube credentials should only be in Heroku config vars
2. **Rotate keys if exposed**: If credentials are accidentally exposed, rotate them in the CloudCube dashboard
3. **Use signed URLs for sensitive files**: Private documents should use temporary signed URLs
4. **Set appropriate expiry times**: Don't make signed URLs valid longer than necessary

## Testing

Test your CloudCube configuration using the included test command:

```bash
php artisan test:cloudcube
```

This command will:
- Verify configuration settings
- Test file upload/download/delete operations
- Validate URL generation
- Check connectivity

## Troubleshooting

### Common Issues

1. **403 Forbidden Errors**
   - Check that your access key and secret are correct
   - Verify the bucket name is `cloud-cube`
   - Ensure your cube prefix is correct

2. **File Not Found Errors**
   - Make sure you're including the cube prefix in file paths
   - Verify the file was uploaded successfully

3. **URL Generation Issues**
   - Check that `CLOUDCUBE_BASE_URL` is set correctly
   - Ensure the cube name matches your CloudCube instance

### Debug Information

Get your CloudCube configuration:

```php
use App\Services\CloudCubeService;

$config = CloudCubeService::getConfig();
dd($config);
```

## Example Controller Implementation

```php
<?php

namespace App\Http\Controllers;

use App\Services\CloudCubeService;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,doc,docx|max:10240'
        ]);

        $file = $request->file('document');
        $filename = auth()->id() . '_' . time() . '.' . $file->getClientOriginalExtension();
        
        // Upload as private file
        $path = CloudCubeService::uploadPrivate($file, $filename, 'user-documents');
        
        if ($path) {
            // Save to database
            auth()->user()->documents()->create([
                'name' => $file->getClientOriginalName(),
                'path' => $path,
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);
            
            return response()->json(['success' => true]);
        }
        
        return response()->json(['error' => 'Upload failed'], 500);
    }
    
    public function download($documentId)
    {
        $document = auth()->user()->documents()->findOrFail($documentId);
        
        // Generate signed URL valid for 15 minutes
        $downloadUrl = CloudCubeService::getSignedUrl($document->path, 15);
        
        return redirect($downloadUrl);
    }
}
```

## Migration from Local Storage

If you have existing files in local storage that need to be migrated to CloudCube:

```php
// Example migration command
php artisan make:command MigrateToCloudCube

// In the command:
$localFiles = Storage::disk('public')->allFiles();
foreach ($localFiles as $file) {
    $content = Storage::disk('public')->get($file);
    CloudCubeService::uploadPublic($content, basename($file), dirname($file));
}
```

## Monitoring and Logs

- Monitor CloudCube usage in the Heroku dashboard
- Check Laravel logs for CloudCube-related errors
- Use the test command regularly to verify connectivity
