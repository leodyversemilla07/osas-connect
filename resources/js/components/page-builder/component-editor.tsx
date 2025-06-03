import React, { useState, useEffect } from 'react';
import { ContentBlock } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';

interface ComponentEditorProps {
    block: ContentBlock;
    onUpdate: (updates: Partial<ContentBlock>) => void;
    onClose: () => void;
}

export function ComponentEditor({ block, onUpdate, onClose }: ComponentEditorProps) {
    const [localContent, setLocalContent] = useState(block.content);

    useEffect(() => {
        setLocalContent(block.content);
    }, [block]);

    const updateContent = (updates: Record<string, unknown>) => {
        const newContent = { ...localContent, ...updates };
        setLocalContent(newContent);
        onUpdate({ content: newContent });
    };

    const updateNestedContent = (path: string, value: unknown) => {
        const keys = path.split('.');
        const newContent = { ...localContent };
        let current: Record<string, unknown> = newContent;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]] as Record<string, unknown>;
        }
        
        current[keys[keys.length - 1]] = value;
        setLocalContent(newContent);
        onUpdate({ content: newContent });
    };

    const addFeatureItem = () => {
        const items = Array.isArray(localContent.items) ? localContent.items : [];
        const newItems = [...items, {
            icon: 'star',
            title: 'New Feature',
            description: 'Feature description'
        }];
        updateContent({ items: newItems });
    };

    const updateFeatureItem = (index: number, updates: Record<string, unknown>) => {
        const items = Array.isArray(localContent.items) ? localContent.items : [];
        const newItems = [...items];
        newItems[index] = { ...newItems[index], ...updates };
        updateContent({ items: newItems });
    };

    const removeFeatureItem = (index: number) => {
        const items = Array.isArray(localContent.items) ? localContent.items : [];
        const newItems = items.filter((_: unknown, i: number) => i !== index);
        updateContent({ items: newItems });
    };

    const iconOptions = [
        { value: 'star', label: 'Star' },
        { value: 'heart', label: 'Heart' },
        { value: 'shield', label: 'Shield' },
        { value: 'award', label: 'Award' },
        { value: 'users', label: 'Users' },
        { value: 'target', label: 'Target' },
    ];

    const alignmentOptions = [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
    ];

    const getString = (value: unknown): string => {
        return typeof value === 'string' ? value : '';
    };

    const renderHeroEditor = () => (
        <div className="space-y-4">
            <div>
                <Label htmlFor="badge">Badge Text</Label>
                <Input
                    id="badge"
                    value={getString(localContent.badge)}
                    onChange={(e) => updateContent({ badge: e.target.value })}
                    placeholder="Optional badge text"
                />
            </div>
            
            <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    value={getString(localContent.title)}
                    onChange={(e) => updateContent({ title: e.target.value })}
                    placeholder="Hero title"
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="subtitle">Subtitle *</Label>
                <Textarea
                    id="subtitle"
                    value={getString(localContent.subtitle)}
                    onChange={(e) => updateContent({ subtitle: e.target.value })}
                    placeholder="Hero subtitle"
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="backgroundImage">Background Image URL</Label>
                <Input
                    id="backgroundImage"
                    value={getString(localContent.backgroundImage)}
                    onChange={(e) => updateContent({ backgroundImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                />
            </div>
            
            <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                    id="buttonText"
                    value={getString(localContent.buttonText)}
                    onChange={(e) => updateContent({ buttonText: e.target.value })}
                    placeholder="Call to action text"
                />
            </div>
            
            <div>
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                    id="buttonLink"
                    value={getString(localContent.buttonLink)}
                    onChange={(e) => updateContent({ buttonLink: e.target.value })}
                    placeholder="/link-destination"
                />
            </div>
        </div>
    );

    const renderTextEditor = () => (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={getString(localContent.title)}
                    onChange={(e) => updateContent({ title: e.target.value })}
                    placeholder="Section title (optional)"
                />
            </div>
            
            <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                    id="content"
                    value={getString(localContent.content)}
                    onChange={(e) => updateContent({ content: e.target.value })}
                    placeholder="Enter your text content"
                    rows={6}
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="alignment">Text Alignment</Label>
                <Select
                    value={getString(localContent.alignment) || 'left'}
                    onValueChange={(value) => updateContent({ alignment: value })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {alignmentOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const renderImageEditor = () => (
        <div className="space-y-4">
            <div>
                <Label htmlFor="src">Image URL *</Label>
                <Input
                    id="src"
                    value={getString(localContent.src)}
                    onChange={(e) => updateContent({ src: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="alt">Alt Text *</Label>
                <Input
                    id="alt"
                    value={getString(localContent.alt)}
                    onChange={(e) => updateContent({ alt: e.target.value })}
                    placeholder="Descriptive alt text for accessibility"
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="caption">Caption</Label>
                <Input
                    id="caption"
                    value={getString(localContent.caption)}
                    onChange={(e) => updateContent({ caption: e.target.value })}
                    placeholder="Optional image caption"
                />
            </div>
            
            <div>
                <Label htmlFor="alignment">Image Alignment</Label>
                <Select
                    value={getString(localContent.alignment) || 'center'}
                    onValueChange={(value) => updateContent({ alignment: value })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {alignmentOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    const renderFeaturesEditor = () => (
        <div className="space-y-6">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="badge">Badge Text</Label>
                    <Input
                        id="badge"
                        value={getString(localContent.badge)}
                        onChange={(e) => updateContent({ badge: e.target.value })}
                        placeholder="Optional badge text"
                    />
                </div>
                
                <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        value={getString(localContent.title)}
                        onChange={(e) => updateContent({ title: e.target.value })}
                        placeholder="Features section title"
                        required
                    />
                </div>
                
                <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                        id="subtitle"
                        value={getString(localContent.subtitle)}
                        onChange={(e) => updateContent({ subtitle: e.target.value })}
                        placeholder="Optional subtitle"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <Label>Feature Items</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFeatureItem}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                    </Button>
                </div>
                
                <div className="space-y-4">
                    {(Array.isArray(localContent.items) ? localContent.items : []).map((item: Record<string, unknown>, index: number) => (
                        <Card key={index}>
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary">Feature {index + 1}</Badge>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFeatureItem(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                
                                <div>
                                    <Label>Icon</Label>
                                    <Select
                                        value={getString(item.icon)}
                                        onValueChange={(value) => updateFeatureItem(index, { icon: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {iconOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <Label>Title</Label>
                                    <Input
                                        value={getString(item.title)}
                                        onChange={(e) => updateFeatureItem(index, { title: e.target.value })}
                                        placeholder="Feature title"
                                    />
                                </div>
                                
                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={getString(item.description)}
                                        onChange={(e) => updateFeatureItem(index, { description: e.target.value })}
                                        placeholder="Feature description"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCTAEditor = () => (
        <div className="space-y-4">
            <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    value={getString(localContent.title)}
                    onChange={(e) => updateContent({ title: e.target.value })}
                    placeholder="Call to action title"
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                    id="description"
                    value={getString(localContent.description)}
                    onChange={(e) => updateContent({ description: e.target.value })}
                    placeholder="Compelling description"
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="buttonText">Button Text *</Label>
                <Input
                    id="buttonText"
                    value={getString(localContent.buttonText)}
                    onChange={(e) => updateContent({ buttonText: e.target.value })}
                    placeholder="Action button text"
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="buttonLink">Button Link *</Label>
                <Input
                    id="buttonLink"
                    value={getString(localContent.buttonLink)}
                    onChange={(e) => updateContent({ buttonLink: e.target.value })}
                    placeholder="/destination-url"
                    required
                />
            </div>
            
            <div>
                <Label htmlFor="backgroundImage">Background Image URL</Label>
                <Input
                    id="backgroundImage"
                    value={getString(localContent.backgroundImage)}
                    onChange={(e) => updateContent({ backgroundImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                />
            </div>
        </div>
    );

    const renderContactEditor = () => {
        const info = localContent.info && typeof localContent.info === 'object' ? localContent.info as Record<string, unknown> : {};
        
        return (
            <div className="space-y-4">
                <div>
                    <Label htmlFor="badge">Badge Text</Label>
                    <Input
                        id="badge"
                        value={getString(localContent.badge)}
                        onChange={(e) => updateContent({ badge: e.target.value })}
                        placeholder="Optional badge text"
                    />
                </div>
                
                <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        value={getString(localContent.title)}
                        onChange={(e) => updateContent({ title: e.target.value })}
                        placeholder="Contact section title"
                        required
                    />
                </div>
                
                <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Textarea
                        id="subtitle"
                        value={getString(localContent.subtitle)}
                        onChange={(e) => updateContent({ subtitle: e.target.value })}
                        placeholder="Optional subtitle"
                    />
                </div>
                
                <div className="space-y-4">
                    <Label>Contact Information</Label>
                    
                    <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={getString(info.address)}
                            onChange={(e) => updateNestedContent('info.address', e.target.value)}
                            placeholder="Street address"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={getString(info.email)}
                            onChange={(e) => updateNestedContent('info.email', e.target.value)}
                            placeholder="contact@example.com"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={getString(info.phone)}
                            onChange={(e) => updateNestedContent('info.phone', e.target.value)}
                            placeholder="(555) 123-4567"
                        />
                    </div>
                    
                    <div>
                        <Label htmlFor="hours">Hours</Label>
                        <Input
                            id="hours"
                            value={getString(info.hours)}
                            onChange={(e) => updateNestedContent('info.hours', e.target.value)}
                            placeholder="Mon-Fri: 9:00 AM - 5:00 PM"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const renderEditor = () => {
        switch (block.type) {
            case 'hero':
                return renderHeroEditor();
            case 'text':
                return renderTextEditor();
            case 'image':
                return renderImageEditor();
            case 'features':
                return renderFeaturesEditor();
            case 'cta':
                return renderCTAEditor();
            case 'contact':
                return renderContactEditor();
            default:
                return (
                    <div className="text-center p-8">
                        <p className="text-gray-500">
                            No editor available for block type: {block.type}
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Edit {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>
            
            {renderEditor()}
        </div>
    );
}
