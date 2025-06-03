import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ContentBlock } from './types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BlockRenderer } from './block-renderer';
import {
    GripVertical,
    Copy,
    Trash2,
    Edit3
} from 'lucide-react';

interface SortableItemProps {
    id: string;
    block: ContentBlock;
    isSelected: boolean;
    onSelect: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

export function SortableItem({
    id,
    block,
    isSelected,
    onSelect,
    onDuplicate,
    onDelete
}: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative ${isDragging ? 'opacity-50' : ''}`}
        >
            <Card
                className={`relative transition-all ${isSelected
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                    }`}
            >                {/* Drag Handle & Controls */}
                <div className={`absolute -left-10 top-4 flex flex-col gap-1 transition-opacity z-10 ${isSelected || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 bg-white dark:bg-gray-800 shadow-sm cursor-grab active:cursor-grabbing hover:bg-gray-50"
                        {...attributes}
                        {...listeners}
                        title="Drag to reorder"
                    >
                        <GripVertical className="w-3 h-3 text-gray-600" />
                    </Button>
                </div><div className={`absolute -right-10 top-4 flex flex-col gap-1 transition-opacity z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 bg-white dark:bg-gray-800 shadow-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate();
                        }}
                    >
                        <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 bg-white dark:bg-gray-800 shadow-sm text-red-600 hover:text-red-700"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>

                {/* Content */}
                <CardContent 
                    className="p-0 overflow-hidden cursor-pointer" 
                    onClick={onSelect}
                >
                    <div className="relative">
                        {/* Block Type Label */}
                        <div className={`absolute top-2 left-2 z-10 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}>
                            <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                                {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                            </div>
                        </div>

                        {/* Edit Overlay */}
                        <div className={`absolute inset-0 bg-blue-600/10 backdrop-blur-[1px] flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'
                            }`}>
                            <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border flex items-center gap-2">
                                <Edit3 className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Click to edit
                                </span>
                            </div>
                        </div>

                        {/* Block Preview */}
                        <div className="pointer-events-none">
                            <BlockRenderer block={block} isPreview />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
