<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteComponent extends Model
{
    protected $fillable = ['component_type', 'content', 'is_active'];

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get header component content
     */
    public static function getHeader()
    {
        return static::where('component_type', 'header')->where('is_active', true)->first();
    }

    /**
     * Get footer component content
     */
    public static function getFooter()
    {
        return static::where('component_type', 'footer')->where('is_active', true)->first();
    }

    /**
     * Update or create header content
     */
    public static function updateHeader(array $content)
    {
        return static::updateOrCreate(['component_type' => 'header'], ['content' => $content, 'is_active' => true]);
    }

    /**
     * Update or create footer content
     */
    public static function updateFooter(array $content)
    {
        return static::updateOrCreate(['component_type' => 'footer'], ['content' => $content, 'is_active' => true]);
    }
}
