<?php

namespace App\Services;

class UserAgentParser
{
    /**
     * Parse user agent string to extract browser and device information
     */
    public static function parse(?string $userAgent): array
    {
        if (empty($userAgent)) {
            return [
                'browser' => 'Unknown',
                'device' => 'Unknown',
            ];
        }

        // Extract browser information
        $browser = self::getBrowser($userAgent);

        // Extract device/OS information
        $device = self::getDevice($userAgent);

        return [
            'browser' => $browser,
            'device' => $device,
        ];
    }

    /**
     * Extract browser name and version from user agent
     */
    private static function getBrowser(string $userAgent): string
    {
        $browsers = [
            '/Chrome\/([0-9.]+)/' => 'Chrome',
            '/Firefox\/([0-9.]+)/' => 'Firefox',
            '/Safari\/([0-9.]+)/' => 'Safari',
            '/Edge\/([0-9.]+)/' => 'Edge',
            '/Opera\/([0-9.]+)/' => 'Opera',
            '/MSIE ([0-9.]+)/' => 'Internet Explorer',
            '/Trident.*rv:([0-9.]+)/' => 'Internet Explorer',
        ];

        foreach ($browsers as $regex => $name) {
            if (preg_match($regex, $userAgent, $matches)) {
                $version = isset($matches[1]) ? $matches[1] : '';
                // Truncate version to major.minor
                $version = preg_replace('/^(\d+\.\d+).*/', '$1', $version);

                return $name.($version ? ' '.$version : '');
            }
        }

        return 'Unknown Browser';
    }

    /**
     * Extract device/OS information from user agent
     */
    private static function getDevice(string $userAgent): string
    {
        // Mobile devices
        if (preg_match('/iPhone/', $userAgent)) {
            if (preg_match('/OS ([0-9_]+)/', $userAgent, $matches)) {
                $version = str_replace('_', '.', $matches[1]);

                return 'iPhone (iOS '.$version.')';
            }

            return 'iPhone';
        }

        if (preg_match('/iPad/', $userAgent)) {
            if (preg_match('/OS ([0-9_]+)/', $userAgent, $matches)) {
                $version = str_replace('_', '.', $matches[1]);

                return 'iPad (iOS '.$version.')';
            }

            return 'iPad';
        }

        if (preg_match('/Android ([0-9.]+)/', $userAgent, $matches)) {
            $version = $matches[1];
            if (preg_match('/Mobile/', $userAgent)) {
                return 'Android Phone ('.$version.')';
            } else {
                return 'Android Tablet ('.$version.')';
            }
        }

        // Desktop operating systems
        if (preg_match('/Windows NT ([0-9.]+)/', $userAgent, $matches)) {
            $versions = [
                '10.0' => 'Windows 10/11',
                '6.3' => 'Windows 8.1',
                '6.2' => 'Windows 8',
                '6.1' => 'Windows 7',
                '6.0' => 'Windows Vista',
                '5.1' => 'Windows XP',
                '5.0' => 'Windows 2000',
            ];
            $version = $matches[1];

            return $versions[$version] ?? 'Windows NT '.$version;
        }

        if (preg_match('/Mac OS X ([0-9_]+)/', $userAgent, $matches)) {
            $version = str_replace('_', '.', $matches[1]);

            return 'macOS '.$version;
        }

        if (preg_match('/Linux/', $userAgent)) {
            if (preg_match('/Ubuntu/', $userAgent)) {
                return 'Ubuntu Linux';
            }

            return 'Linux';
        }

        return 'Unknown Device';
    }
}
