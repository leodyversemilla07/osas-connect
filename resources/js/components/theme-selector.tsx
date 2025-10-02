import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Moon, Sun } from 'lucide-react';

interface ThemeSelectorProps {
    value?: string | null;
    onChange: (value: string | null) => void;
    disabled?: boolean;
}

export default function ThemeSelector({ value, onChange, disabled = false }: ThemeSelectorProps) {
    const getIcon = (theme: string) => {
        switch (theme) {
            case 'light':
                return <Sun className="h-4 w-4" />;
            case 'dark':
                return <Moon className="h-4 w-4" />;
            case 'system':
                return <Monitor className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const handleValueChange = (newValue: string) => {
        if (newValue === 'default') {
            onChange(null);
        } else {
            onChange(newValue);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Page Theme Override</label>
            <Select value={value || 'default'} onValueChange={handleValueChange} disabled={disabled}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme override">
                        <div className="flex items-center gap-2">
                            {value && getIcon(value)}
                            <span>
                                {value === 'light' && 'Light Theme'}
                                {value === 'dark' && 'Dark Theme'}
                                {value === 'system' && 'System Theme'}
                                {!value && 'Use User Preference'}
                            </span>
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4" /> {/* Empty space for alignment */}
                            <span>Use User Preference (Default)</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="light">
                        <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4" />
                            <span>Light Theme</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            <span>Dark Theme</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="system">
                        <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4" />
                            <span>System Theme</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Override the theme for this page. If set, this will take precedence over user theme preferences when viewing this page.
            </p>
        </div>
    );
}
