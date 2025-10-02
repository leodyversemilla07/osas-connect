import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Pipette } from 'lucide-react';
import { useState } from 'react';

interface ColorPickerProps {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    label?: string;
}

// Predefined color palette
const colorPresets = [
    { name: 'Primary Blue', value: '#2563eb' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Slate', value: '#475569' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Cyan', value: '#0891b2' },
];

export default function ColorPicker({ value = '#2563eb', onChange, disabled = false, label }: ColorPickerProps) {
    const [open, setOpen] = useState(false);
    const [hexValue, setHexValue] = useState(value);

    const handleColorChange = (newColor: string) => {
        setHexValue(newColor);
        onChange(newColor);
    };

    const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setHexValue(newValue);

        // Validate hex color format
        if (/^#[0-9A-F]{6}$/i.test(newValue)) {
            onChange(newValue);
        }
    };

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" disabled={disabled} className="w-full justify-start gap-2">
                        <div className="h-4 w-4 rounded border" style={{ backgroundColor: value }} />
                        {value}
                        <Palette className="ml-auto h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <Tabs defaultValue="presets" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="presets">Presets</TabsTrigger>
                            <TabsTrigger value="custom">Custom</TabsTrigger>
                        </TabsList>

                        <TabsContent value="presets" className="space-y-3">
                            <div className="grid grid-cols-4 gap-2">
                                {colorPresets.map((color) => (
                                    <button
                                        key={color.value}
                                        className="aspect-square w-full rounded border-2 transition-transform hover:scale-105"
                                        style={{
                                            backgroundColor: color.value,
                                            borderColor: value === color.value ? '#000' : 'transparent',
                                        }}
                                        onClick={() => {
                                            handleColorChange(color.value);
                                            setOpen(false);
                                        }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="custom" className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="hex-input">Hex Color</Label>
                                <div className="flex gap-2">
                                    <Input id="hex-input" value={hexValue} onChange={handleHexChange} placeholder="#2563eb" className="font-mono" />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => {
                                            if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
                                                onChange(hexValue);
                                                setOpen(false);
                                            }
                                        }}
                                    >
                                        <Pipette className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Preview</Label>
                                <div className="h-10 w-full rounded border" style={{ backgroundColor: hexValue }} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </PopoverContent>
            </Popover>
        </div>
    );
}
