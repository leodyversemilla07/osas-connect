import React, { useState, useCallback } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    useDroppable,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    pointerWithin,
    closestCenter,
    CollisionDetection
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { ComponentPalette } from './component-palette';
import { ComponentEditor } from './component-editor';
import { ContentBlock, ContentBlockType } from './types';
import { generateId } from './utils';
import { Button } from '@/components/ui/button';
import { Eye, Save, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Separate Canvas component to ensure droppable is properly registered
function CanvasDroppable({
    children,
    isDragging,
    className,
    style
}: {
    children: React.ReactNode;
    isDragging: boolean;
    className: string;
    style: React.CSSProperties;
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'page-builder-canvas',
        data: {
            type: 'canvas'
        }
    });

    return (
        <div
            ref={setNodeRef}
            data-testid="page-builder-canvas"
            className={`${className} ${isDragging || isOver ? 'border-primary bg-primary/5' : 'border-border'}`}
            style={style}
        >
            {children}
        </div>
    );
}

interface PageBuilderProps {
    initialContent?: ContentBlock[];
    onSave: (content: ContentBlock[]) => void;
    onPreview?: (content: ContentBlock[]) => void;
}

export function PageBuilder({ initialContent = [], onSave, onPreview }: PageBuilderProps) {
    const [blocks, setBlocks] = useState<ContentBlock[]>(initialContent);
    const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [isDragging, setIsDragging] = useState(false);
    const [activeBlock, setActiveBlock] = useState<ContentBlock | null>(null);    // Improved sensors configuration for better drag experience
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8, // Require a small movement to start dragging
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100, // Small delay for touch
                tolerance: 5,
            },
        })
    );    // Clean collision detection function
    const collisionDetection: CollisionDetection = (args) => {
        // Try pointerWithin first for precise detection
        const pointerCollisions = pointerWithin(args);

        if (pointerCollisions.length > 0) {
            return pointerCollisions;
        }

        // Fallback to closestCenter for sortable items
        return closestCenter(args);
    };

    const createNewBlock = useCallback((type: ContentBlockType): ContentBlock => {
        const id = generateId();

        const templates: Record<ContentBlockType, Omit<ContentBlock, 'id'>> = {
            hero: {
                type: 'hero',
                content: {
                    badge: 'New Section',
                    title: 'Hero Title',
                    subtitle: 'Hero subtitle text goes here',
                    backgroundImage: '',
                    buttonText: 'Learn More',
                    buttonLink: '#'
                }
            },
            text: {
                type: 'text',
                content: {
                    title: 'Text Section',
                    content: 'Add your text content here. You can include multiple paragraphs and format the text as needed.',
                    alignment: 'left'
                }
            },
            image: {
                type: 'image',
                content: {
                    src: 'https://via.placeholder.com/800x400/005a2d/ffffff?text=Upload+Image',
                    alt: 'Image description',
                    caption: 'Image caption',
                    alignment: 'center'
                }
            },
            features: {
                type: 'features',
                content: {
                    badge: 'Features',
                    title: 'Feature Section',
                    subtitle: 'Showcase your key features and benefits',
                    items: [
                        {
                            icon: 'star',
                            title: 'Feature 1',
                            description: 'Description of feature 1'
                        },
                        {
                            icon: 'heart',
                            title: 'Feature 2',
                            description: 'Description of feature 2'
                        },
                        {
                            icon: 'shield',
                            title: 'Feature 3',
                            description: 'Description of feature 3'
                        }
                    ]
                }
            },
            cta: {
                type: 'cta',
                content: {
                    title: 'Call to Action',
                    description: 'Encourage users to take action with this compelling message',
                    buttonText: 'Get Started',
                    buttonLink: '#',
                    backgroundImage: ''
                }
            },
            contact: {
                type: 'contact',
                content: {
                    badge: 'Contact',
                    title: 'Get in Touch',
                    subtitle: 'We would love to hear from you',
                    info: {
                        address: '123 University Ave, City, State 12345',
                        email: 'contact@university.edu',
                        phone: '+1 (555) 123-4567',
                        hours: 'Monday - Friday: 9:00 AM - 5:00 PM'
                    }
                }
            }
        };

        return {
            id,
            ...templates[type]
        };
    }, []); const handleDragStart = useCallback((event: DragStartEvent) => {
        setIsDragging(true);

        // Set active block for drag overlay
        if (event.active.id.toString().startsWith('palette-')) {
            const componentType = event.active.id.toString().replace('palette-', '') as ContentBlockType;
            setActiveBlock({
                id: 'temp-overlay',
                type: componentType,
                content: {}
            } as ContentBlock);
        } else {
            const block = blocks.find(b => b.id === event.active.id);
            setActiveBlock(block || null);
        }
    }, [blocks]); const handleDragEnd = useCallback((event: DragEndEvent) => {
        setIsDragging(false);
        setActiveBlock(null);

        const { active, over } = event;

        if (!over) {
            return;
        }

        // Handle adding new component from palette
        if (active.id.toString().startsWith('palette-')) {
            const componentType = active.id.toString().replace('palette-', '') as ContentBlockType;
            const newBlock = createNewBlock(componentType);

            // Check if we're dropping on the canvas or between blocks
            if (over.id === 'page-builder-canvas') {
                // Add to the end if dropping directly on canvas
                setBlocks(prev => [...prev, newBlock]);
                setSelectedBlock(newBlock);
            } else {
                // Insert at specific position if dropping between blocks
                const overIndex = blocks.findIndex(block => block.id === over.id);
                if (overIndex !== -1) {
                    setBlocks(prev => {
                        const newBlocks = [...prev];
                        newBlocks.splice(overIndex, 0, newBlock);
                        return newBlocks;
                    });
                    setSelectedBlock(newBlock);
                } else {
                    // Fallback: add to the end
                    setBlocks(prev => [...prev, newBlock]);
                    setSelectedBlock(newBlock);
                }
            }
            return;
        }

        // Handle reordering existing blocks
        const activeIndex = blocks.findIndex(block => block.id === active.id);
        const overIndex = blocks.findIndex(block => block.id === over.id);

        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
            setBlocks(arrayMove(blocks, activeIndex, overIndex));
        }
    }, [blocks, createNewBlock]);

    const duplicateBlock = (blockId: string) => {
        const blockToDuplicate = blocks.find(block => block.id === blockId);
        if (blockToDuplicate) {
            const duplicatedBlock = {
                ...blockToDuplicate,
                id: generateId()
            };
            const originalIndex = blocks.findIndex(block => block.id === blockId);
            setBlocks(prev => {
                const newBlocks = [...prev];
                newBlocks.splice(originalIndex + 1, 0, duplicatedBlock);
                return newBlocks;
            });
        }
    };

    const deleteBlock = (blockId: string) => {
        setBlocks(prev => prev.filter(block => block.id !== blockId));
        if (selectedBlock?.id === blockId) {
            setSelectedBlock(null);
        }
    };

    const updateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
        setBlocks(prev => prev.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
        ));

        if (selectedBlock?.id === blockId) {
            setSelectedBlock(prev => prev ? { ...prev, ...updates } : null);
        }
    };

    const handleSave = () => {
        onSave(blocks);
    };

    const handlePreview = () => {
        onPreview?.(blocks);
    };

    const handleTemplateSelect = (templateType: 'announcement' | 'scholarship') => {
        // Create template-specific blocks
        if (templateType === 'announcement') {
            const heroBlock = createNewBlock('hero');
            heroBlock.content = {
                badge: 'Announcement',
                title: 'Important University Announcement',
                subtitle: 'Stay informed with the latest updates from our university',
                backgroundImage: '',
                buttonText: 'Read More',
                buttonLink: '#'
            };

            const textBlock = createNewBlock('text');
            textBlock.content = {
                title: 'Announcement Details',
                content: 'Add your announcement content here. This template provides a structured layout for important university announcements.',
                alignment: 'left'
            };

            setBlocks([heroBlock, textBlock]);
            setSelectedBlock(heroBlock);
        } else if (templateType === 'scholarship') {
            const heroBlock = createNewBlock('hero');
            heroBlock.content = {
                badge: 'Scholarship',
                title: 'Scholarship Opportunity',
                subtitle: 'Apply now for financial assistance and educational support',
                backgroundImage: '',
                buttonText: 'Apply Now',
                buttonLink: '#'
            };

            const featuresBlock = createNewBlock('features');
            featuresBlock.content = {
                badge: 'Benefits',
                title: 'Scholarship Benefits',
                subtitle: 'What this scholarship offers',
                items: [
                    {
                        icon: 'star',
                        title: 'Financial Support',
                        description: 'Tuition assistance and educational funding'
                    },
                    {
                        icon: 'heart',
                        title: 'Academic Excellence',
                        description: 'Support for high-achieving students'
                    },
                    {
                        icon: 'shield',
                        title: 'Long-term Benefits',
                        description: 'Career development and networking opportunities'
                    }
                ]
            };

            const ctaBlock = createNewBlock('cta');
            ctaBlock.content = {
                title: 'Ready to Apply?',
                description: 'Don\'t miss this opportunity to advance your education',
                buttonText: 'Submit Application',
                buttonLink: '#',
                backgroundImage: ''
            };

            setBlocks([heroBlock, featuresBlock, ctaBlock]);
            setSelectedBlock(heroBlock);
        }
    };

    return (<DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        autoScroll={{ enabled: true }}
    >
        <div className="flex h-full max-h-screen">
            {/* Component Palette */}
            <div className="w-80 border-r border bg-muted">
                <ComponentPalette onTemplateSelect={handleTemplateSelect} />
            </div>

            {/* Main Canvas */}
            <div className="flex-1 flex flex-col bg-background">
                {/* Toolbar */}
                <div className="border-b border p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPreviewMode('desktop')}
                            >
                                <Monitor className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={previewMode === 'tablet' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPreviewMode('tablet')}
                            >
                                <Tablet className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPreviewMode('mobile')}
                            >
                                <Smartphone className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={handlePreview}>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Page
                            </Button>
                        </div>
                    </div>
                </div>                    {/* Canvas */}
                <div className="flex-1 p-4">
                    <div
                        className={`mx-auto transition-all duration-300 ${previewMode === 'mobile' ? 'max-w-sm' :
                            previewMode === 'tablet' ? 'max-w-2xl' :
                                'max-w-6xl'
                            }`}
                    >
                        <CanvasDroppable
                            isDragging={isDragging}
                            className="min-h-96 w-full rounded-lg border-2 border-dashed transition-colors"
                            style={{
                                minHeight: '500px',
                                width: '100%',
                                position: 'relative'
                            }}
                        >
                            {blocks.length === 0 ? (
                                <div className="flex items-center justify-center h-full w-full text-center text-muted-foreground p-12">
                                    <div>
                                        <p className="text-lg font-medium mb-2">Start building your page</p>
                                        <p>Drag components from the palette to get started</p>
                                    </div>
                                </div>
                            ) : (
                                <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-4 p-4">
                                        {blocks.map((block) => (
                                            <SortableItem
                                                key={block.id}
                                                id={block.id}
                                                block={block}
                                                isSelected={selectedBlock?.id === block.id}
                                                onSelect={() => setSelectedBlock(block)}
                                                onDuplicate={() => duplicateBlock(block.id)}
                                                onDelete={() => deleteBlock(block.id)}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            )}
                        </CanvasDroppable>
                    </div>
                </div>
            </div>

            {/* Property Panel */}
            {selectedBlock && (
                <div className="w-80 border-l border bg-muted">
                    <ComponentEditor
                        block={selectedBlock}
                        onUpdate={(updates) => updateBlock(selectedBlock.id, updates)}
                        onClose={() => setSelectedBlock(null)}
                    />
                </div>
            )}
        </div>

        <DragOverlay
            dropAnimation={{
                duration: 150,
                easing: 'ease-out',
            }}
            style={{ zIndex: 9999 }}
        >
            {activeBlock && (
                <Card className="w-full max-w-md opacity-90 shadow-2xl border-primary border-2 bg-white dark:bg-gray-800 pointer-events-none">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
                                <div className="w-4 h-4 bg-primary rounded-sm"></div>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-primary">
                                    {activeBlock.type.charAt(0).toUpperCase() + activeBlock.type.slice(1)} Section
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Drop to add to page
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </DragOverlay>
    </DndContext>
    );
}
