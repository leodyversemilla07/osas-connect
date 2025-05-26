<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class StorageService
{    /**
     * Get the appropriate storage disk based on environment
     */
    public static function getDisk(): string
    {
        // Use CloudCube for production on Heroku, local otherwise
        return config('app.env') === 'production' ? 'cloudcube' : 'public';
    }

    /**
     * Get the proper path for CloudCube storage
     * CloudCube requires all paths to be in the public or private folder
     */
    public static function getCloudCubePath(string $path, bool $isPublic = true): string
    {
        $visibility = $isPublic ? 'public' : 'private';
        return $visibility . '/' . ltrim($path, '/');
    }

    /**
     * Store a file using the appropriate disk
     */
    public static function store($file, string $path): string
    {
        $disk = self::getDisk();
        
        if ($disk === 'cloudcube') {
            // For CloudCube, prepend the cube prefix and public folder
            $cloudCubePath = self::getCloudCubePath($path, true);
            return Storage::disk($disk)->putFile($cloudCubePath, $file);
        }
        
        return Storage::disk($disk)->putFile($path, $file);
    }

    /**
     * Store a file with a specific name using the appropriate disk
     */
    public static function storeAs($file, string $path, string $name): string
    {
        $disk = self::getDisk();
        
        if ($disk === 'cloudcube') {
            // For CloudCube, prepend the cube prefix and public folder
            $cloudCubePath = self::getCloudCubePath($path, true);
            return Storage::disk($disk)->putFileAs($cloudCubePath, $file, $name);
        }
          return Storage::disk($disk)->putFileAs($path, $file, $name);
    }

    /**
     * Delete a file using the appropriate disk
     */
    public static function delete(string $path): bool
    {
        $disk = self::getDisk();
        
        if ($disk === 'cloudcube') {
            // For CloudCube, ensure the path has the proper prefix
            if (!str_starts_with($path, 'public/') && !str_starts_with($path, 'private/')) {
                $path = self::getCloudCubePath($path, true);
            }
        }
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
            
            // If the path already starts with public/ or private/, use it as-is
            if (str_starts_with($path, 'public/') || str_starts_with($path, 'private/')) {
                return $baseUrl . '/' . ltrim($path, '/');
            }
            
            // Otherwise, add the public prefix
            return $baseUrl . '/public/' . ltrim($path, '/');
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
        
        if ($disk === 'cloudcube') {
            // For CloudCube, ensure the path has the proper prefix
            if (!str_starts_with($path, 'public/') && !str_starts_with($path, 'private/')) {
                $path = self::getCloudCubePath($path, true);
            }
        }
        
        return Storage::disk($disk)->exists($path);
    }
}
