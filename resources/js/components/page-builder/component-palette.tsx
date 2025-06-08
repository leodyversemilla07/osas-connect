import { useDraggable } from '@dnd-kit/core';
import { ComponentPaletteItem } from './types';
import { Card, CardContent } from '@/components/ui/card';
import {
    Layout,
    Type,
    Image,
    Star,
    Zap,
    Phone,
    ScrollText,
    Megaphone
} from 'lucide-react';

const paletteItems: ComponentPaletteItem[] = [
    {
        type: 'hero',
        name: 'Hero Section',
        description: 'Eye-catching header with title and call-to-action',
        icon: 'Layout',
        category: 'Layout'
    },
    {
        type: 'text',
        name: 'Text Block',
        description: 'Rich text content with formatting options',
        icon: 'Type',
        category: 'Content'
    },
    {
        type: 'image',
        name: 'Image',
        description: 'Single image with caption and alignment',
        icon: 'Image',
        category: 'Media'
    },
    {
        type: 'features',
        name: 'Features Grid',
        description: 'Showcase features with icons and descriptions',
        icon: 'Star',
        category: 'Content'
    },
    {
        type: 'cta',
        name: 'Call to Action',
        description: 'Prominent section to encourage user action',
        icon: 'Zap',
        category: 'Layout'
    },
    {
        type: 'contact',
        name: 'Contact Info',
        description: 'Display contact information and details',
        icon: 'Phone',
        category: 'Content'
    }
];

const iconMap = {
    Layout,
    Type,
    Image,
    Star,
    Zap,
    Phone,
    ScrollText,
    Megaphone
};

interface DraggableComponentProps {
    item: ComponentPaletteItem;
}

function DraggableComponent({ item }: DraggableComponentProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `palette-${item.type}`,
        data: {
            type: item.type,
            fromPalette: true
        }
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
    } : undefined;    const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Layout;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`cursor-grab active:cursor-grabbing select-none touch-none ${isDragging ? 'opacity-50 z-50' : 'hover:scale-102'
                }`}
            {...listeners}
            {...attributes}
        ><Card className="h-full border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-foreground truncate">
                                {item.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {item.description}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

interface ComponentPaletteProps {
    onTemplateSelect?: (templateType: 'announcement' | 'scholarship') => void;
}

export function ComponentPalette({ onTemplateSelect }: ComponentPaletteProps = {}) {
    const categories = Array.from(new Set(paletteItems.map(item => item.category)));

    const handleTemplateClick = (templateType: 'announcement' | 'scholarship') => {
        onTemplateSelect?.(templateType);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border">
                <h2 className="font-semibold text-foreground">Components</h2>
                <p className="text-sm text-muted-foreground">Drag to add to page</p>
            </div>

            <div className="flex-1 p-4 space-y-6">{categories.map(category => (
                <div key={category}>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        {category}
                    </h3>
                    <div className="space-y-2">
                        {paletteItems
                            .filter(item => item.category === category)
                            .map(item => (
                                <DraggableComponent key={item.type} item={item} />
                            ))
                        }
                    </div>
                </div>
            ))}
            </div>            
            {/* Quick Templates */}
            <div className="p-4 border-t border">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Quick Start
                </h3>
                <div className="space-y-2">
                    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleTemplateClick('announcement')}>
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2">
                                <ScrollText className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Announcement Template</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleTemplateClick('scholarship')}>
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2">
                                <Megaphone className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">Scholarship Template</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
