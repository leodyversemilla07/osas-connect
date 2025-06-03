import { useEffect } from 'react';
import { useCMSAppearance } from './use-cms-appearance';

export interface ColorScheme {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    enabled: boolean;
}

interface UseCMSColorsProps {
    cmsTheme?: string | null;
    cmsColorScheme?: ColorScheme | null;
}

export function useCMSColors({ cmsTheme, cmsColorScheme }: UseCMSColorsProps) {
    // Use existing CMS appearance hook for theme handling
    const { activeTheme, userPreference, isCMSTheme } = useCMSAppearance({ cmsTheme });

    useEffect(() => {
        const root = document.documentElement;
        
        // Apply custom color scheme if enabled
        if (cmsColorScheme?.enabled) {
            // Store original CSS custom properties
            const originalColors = {
                primary: getComputedStyle(root).getPropertyValue('--primary'),
                secondary: getComputedStyle(root).getPropertyValue('--secondary'),
                accent: getComputedStyle(root).getPropertyValue('--accent'),
                background: getComputedStyle(root).getPropertyValue('--background'),
                foreground: getComputedStyle(root).getPropertyValue('--foreground'),
            };

            // Convert hex colors to OKLCH for better color management
            const hexToOklch = (hex: string) => {
                // Simple hex to RGB conversion for basic implementation
                // In production, you might want to use a proper color conversion library
                const r = parseInt(hex.slice(1, 3), 16) / 255;
                const g = parseInt(hex.slice(3, 5), 16) / 255;
                const b = parseInt(hex.slice(5, 7), 16) / 255;
                
                // Basic RGB to linear RGB conversion
                const linearR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
                const linearG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
                const linearB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
                
                // Convert to relative luminance
                const luminance = 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
                
                // Simple approximation for OKLCH lightness
                const lightness = Math.sqrt(luminance);
                
                // Return OKLCH-like format (simplified)
                return `${lightness.toFixed(3)} 0.1 ${(Math.atan2(g - r, b - r) * 180 / Math.PI + 360) % 360}`;
            };

            // Apply color scheme
            if (cmsColorScheme.primary) {
                root.style.setProperty('--primary', hexToOklch(cmsColorScheme.primary));
                root.style.setProperty('--primary-foreground', 'oklch(0.985 0 0)');
            }
            
            if (cmsColorScheme.secondary) {
                root.style.setProperty('--secondary', hexToOklch(cmsColorScheme.secondary));
                root.style.setProperty('--secondary-foreground', 'oklch(0.145 0 0)');
            }
            
            if (cmsColorScheme.accent) {
                root.style.setProperty('--accent', hexToOklch(cmsColorScheme.accent));
                root.style.setProperty('--accent-foreground', 'oklch(0.145 0 0)');
            }
            
            if (cmsColorScheme.background) {
                root.style.setProperty('--background', hexToOklch(cmsColorScheme.background));
            }
            
            if (cmsColorScheme.text) {
                root.style.setProperty('--foreground', hexToOklch(cmsColorScheme.text));
            }

            // Store cleanup function
            return () => {
                // Restore original colors
                Object.entries(originalColors).forEach(([key, value]) => {
                    if (value) {
                        root.style.setProperty(`--${key === 'foreground' ? 'foreground' : key}`, value);
                    }
                });
            };
        }
    }, [cmsColorScheme]);

    return {
        activeTheme,
        userPreference,
        isCMSTheme,
        hasCustomColors: cmsColorScheme?.enabled || false,
        colorScheme: cmsColorScheme,
    };
}
