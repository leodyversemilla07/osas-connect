import { useCallback, useEffect, useState } from 'react';
import { Appearance, useAppearance } from './use-appearance';

interface UseCMSAppearanceProps {
    cmsTheme?: string | null;
}

const prefersDark = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyTheme = (appearance: Appearance) => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
};

const mediaQuery = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const handleSystemThemeChange = (forcedTheme?: string | null) => {
    const currentAppearance = forcedTheme || (localStorage.getItem('appearance') as Appearance);
    applyTheme(currentAppearance || 'system');
};

export function useCMSAppearance({ cmsTheme }: UseCMSAppearanceProps) {
    const { appearance: userAppearance, updateAppearance } = useAppearance();
    const [isUsingCMSTheme, setIsUsingCMSTheme] = useState(false);

    // Determine the active theme (CMS theme takes precedence over user preference)
    const activeTheme = cmsTheme || userAppearance;

    useEffect(() => {
        if (cmsTheme && ['light', 'dark', 'system'].includes(cmsTheme)) {
            // Apply CMS theme if valid
            setIsUsingCMSTheme(true);
            applyTheme(cmsTheme as Appearance);

            // Listen for system theme changes if CMS theme is 'system'
            if (cmsTheme === 'system') {
                const handleChange = () => handleSystemThemeChange(cmsTheme);
                mediaQuery()?.addEventListener('change', handleChange);

                return () => mediaQuery()?.removeEventListener('change', handleChange);
            }
        } else {
            // Fall back to user preference
            setIsUsingCMSTheme(false);
            applyTheme(userAppearance);

            // Listen for system theme changes if user preference is 'system'
            if (userAppearance === 'system') {
                const handleChange = () => handleSystemThemeChange();
                mediaQuery()?.addEventListener('change', handleChange);

                return () => mediaQuery()?.removeEventListener('change', handleChange);
            }
        }
    }, [cmsTheme, userAppearance]);

    const updateUserAppearance = useCallback(
        (mode: Appearance) => {
            if (!isUsingCMSTheme) {
                updateAppearance(mode);
            }
        },
        [isUsingCMSTheme, updateAppearance],
    );

    return {
        appearance: activeTheme as Appearance,
        updateAppearance: updateUserAppearance,
        isUsingCMSTheme,
        cmsTheme: cmsTheme as Appearance | null,
        userAppearance,
    } as const;
}
