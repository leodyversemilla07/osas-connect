<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class StorageService
{
    /**
     * Get the appropriate storage disk based on environment
     */
    public static function getDisk(): string
    {
        // Use CloudCube for production on Heroku, local otherwise
        return config('app.env') === 'production' ? 'cloudcube' : 'public';
    }

    /**
     * Store a file using the appropriate disk
     */
    public static function store($file, string $path): string
    {
        $disk = self::getDisk();
        return Storage::disk($disk)->putFile($path, $file);
    }

    /**
     * Store a file with a specific name using the appropriate disk
     */
    public static function storeAs($file, string $path, string $name): string
    {
        $disk = self::getDisk();
        return Storage::disk($disk)->putFileAs($path, $file, $name);
    }

    /**
     * Delete a file using the appropriate disk
     */
    public static function delete(string $path): bool
    {
        $disk = self::getDisk();
        return Storage::disk($disk)->delete($path);
    }

    /**
     * Get the URL for a file
     */
    public static function url(string $path): string
    {
        $disk = self::getDisk();
        
        if ($disk === 'cloudcube') {
            // For CloudCube, construct the public URL
            $baseUrl = config('filesystems.disks.cloudcube.url');
            return $baseUrl . '/' . $path;
        }
        
        // For local public disk
        return Storage::disk($disk)->url($path);
    }

    /**
     * Check if a file exists
     */
    public static function exists(string $path): bool
    {
        $disk = self::getDisk();
        return Storage::disk($disk)->exists($path);
    }
}
