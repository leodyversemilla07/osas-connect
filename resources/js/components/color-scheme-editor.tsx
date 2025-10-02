import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Palette, RotateCcw } from 'lucide-react';
import ColorPicker from './color-picker';

export interface ColorScheme {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    enabled: boolean;
}

interface ColorSchemeEditorProps {
    value?: ColorScheme;
    onChange: (value: ColorScheme) => void;
    disabled?: boolean;
}

const defaultColorScheme: ColorScheme = {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#16a34a',
    background: '#ffffff',
    text: '#0f172a',
    enabled: false,
};

// Predefined color schemes
const colorSchemePresets = [
    {
        name: 'Ocean Blue',
        scheme: {
            primary: '#0ea5e9',
            secondary: '#38bdf8',
            accent: '#06b6d4',
            background: '#f0f9ff',
            text: '#0c4a6e',
            enabled: true,
        },
    },
    {
        name: 'Forest Green',
        scheme: {
            primary: '#16a34a',
            secondary: '#4ade80',
            accent: '#22c55e',
            background: '#f0fdf4',
            text: '#14532d',
            enabled: true,
        },
    },
    {
        name: 'Purple Dreams',
        scheme: {
            primary: '#8b5cf6',
            secondary: '#a78bfa',
            accent: '#c084fc',
            background: '#faf5ff',
            text: '#581c87',
            enabled: true,
        },
    },
    {
        name: 'Sunset Orange',
        scheme: {
            primary: '#f97316',
            secondary: '#fb923c',
            accent: '#fdba74',
            background: '#fff7ed',
            text: '#9a3412',
            enabled: true,
        },
    },
    {
        name: 'Rose Gold',
        scheme: {
            primary: '#e11d48',
            secondary: '#f43f5e',
            accent: '#fb7185',
            background: '#fff1f2',
            text: '#9f1239',
            enabled: true,
        },
    },
];

export default function ColorSchemeEditor({ value, onChange, disabled = false }: ColorSchemeEditorProps) {
    const currentScheme = value || defaultColorScheme;

    const handleSchemeChange = (updates: Partial<ColorScheme>) => {
        onChange({ ...currentScheme, ...updates });
    };

    const handlePresetSelect = (preset: ColorScheme) => {
        onChange(preset);
    };

    const resetToDefault = () => {
        onChange(defaultColorScheme);
    };

    return (
        <Card className="w-full">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Color Scheme
                        </CardTitle>
                        <CardDescription>
                            Customize the colors for this page. When enabled, these colors will override the default theme.
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetToDefault} disabled={disabled}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="color-scheme-enabled">Enable Custom Colors</Label>
                        <p className="text-muted-foreground text-sm">Use custom colors for this page instead of the default theme</p>
                    </div>
                    <Switch
                        id="color-scheme-enabled"
                        checked={currentScheme.enabled}
                        onCheckedChange={(enabled) => handleSchemeChange({ enabled })}
                        disabled={disabled}
                    />
                </div>

                {currentScheme.enabled && (
                    <>
                        {/* Preset Color Schemes */}
                        <div className="space-y-3">
                            <Label>Quick Presets</Label>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {colorSchemePresets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        className="hover:border-primary/50 rounded-lg border-2 p-3 text-left transition-colors"
                                        onClick={() => handlePresetSelect(preset.scheme)}
                                        disabled={disabled}
                                    >
                                        <div className="mb-2 flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.scheme.primary }} />
                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.scheme.secondary }} />
                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.scheme.accent }} />
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium">{preset.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Individual Color Controls */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <ColorPicker
                                label="Primary Color"
                                value={currentScheme.primary}
                                onChange={(primary) => handleSchemeChange({ primary })}
                                disabled={disabled}
                            />

                            <ColorPicker
                                label="Secondary Color"
                                value={currentScheme.secondary}
                                onChange={(secondary) => handleSchemeChange({ secondary })}
                                disabled={disabled}
                            />

                            <ColorPicker
                                label="Accent Color"
                                value={currentScheme.accent}
                                onChange={(accent) => handleSchemeChange({ accent })}
                                disabled={disabled}
                            />

                            <ColorPicker
                                label="Background Color"
                                value={currentScheme.background}
                                onChange={(background) => handleSchemeChange({ background })}
                                disabled={disabled}
                            />

                            <ColorPicker
                                label="Text Color"
                                value={currentScheme.text}
                                onChange={(text) => handleSchemeChange({ text })}
                                disabled={disabled}
                            />
                        </div>

                        {/* Color Preview */}
                        <div className="space-y-3">
                            <Label>Preview</Label>
                            <div
                                className="rounded-lg border p-4"
                                style={{
                                    backgroundColor: currentScheme.background,
                                    color: currentScheme.text,
                                }}
                            >
                                <h3 className="mb-2 text-lg font-semibold" style={{ color: currentScheme.primary }}>
                                    Sample Page Title
                                </h3>
                                <p className="mb-3">This is how your page content will look with the selected colors.</p>
                                <div className="flex gap-2">
                                    <button
                                        className="rounded px-3 py-1 text-sm font-medium text-white"
                                        style={{ backgroundColor: currentScheme.primary }}
                                    >
                                        Primary Button
                                    </button>
                                    <button
                                        className="rounded px-3 py-1 text-sm font-medium text-white"
                                        style={{ backgroundColor: currentScheme.secondary }}
                                    >
                                        Secondary Button
                                    </button>
                                    <span
                                        className="rounded px-3 py-1 text-sm font-medium"
                                        style={{
                                            backgroundColor: currentScheme.accent,
                                            color: currentScheme.background,
                                        }}
                                    >
                                        Accent Element
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
