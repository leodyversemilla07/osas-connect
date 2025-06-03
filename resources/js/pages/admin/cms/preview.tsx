import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ContentBlock } from '@/components/page-builder/types';
import { BlockRenderer } from '@/components/page-builder/block-renderer';
import { Button } from '@/components/ui/button';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';

interface PreviewData {
    title: string;
    content: ContentBlock[];
}

export default function CMSPreview() {
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    useEffect(() => {
        // Get preview data from sessionStorage
        const storedData = sessionStorage.getItem('cms_preview_data');
        if (storedData) {
            try {
                const data = JSON.parse(storedData);
                setPreviewData(data);
            } catch (error) {
                console.error('Failed to parse preview data:', error);
            }
        }
    }, []);

    const handleClose = () => {
        window.close();
    };

    if (!previewData) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        No Preview Data
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Preview data was not found. Please try again from the page builder.
                    </p>
                    <Button onClick={handleClose}>
                        Close Window
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={`Preview: ${previewData.title}`} />
            
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {/* Preview Header */}
                <div className="bg-white dark:bg-gray-800 border-b shadow-sm sticky top-0 z-50">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Preview: {previewData.title}
                                </h1>
                                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                    <Button
                                        variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setPreviewMode('desktop')}
                                        className="h-8 px-3"
                                    >
                                        <Monitor className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setPreviewMode('tablet')}
                                        className="h-8 px-3"
                                    >
                                        <Tablet className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setPreviewMode('mobile')}
                                        className="h-8 px-3"
                                    >
                                        <Smartphone className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            
                            <Button variant="outline" size="sm" onClick={handleClose}>
                                <X className="w-4 h-4 mr-2" />
                                Close
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="p-4">
                    <div
                        className={`mx-auto transition-all duration-300 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden ${
                            previewMode === 'mobile' ? 'max-w-sm' :
                            previewMode === 'tablet' ? 'max-w-2xl' :
                            'max-w-6xl'
                        }`}
                    >
                        {previewData.content.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <p className="text-lg font-medium mb-2">No Content</p>
                                <p>Add some content blocks to see the preview.</p>
                            </div>
                        ) : (
                            <div className="space-y-0">
                                {previewData.content.map((block) => (
                                    <BlockRenderer 
                                        key={block.id} 
                                        block={block} 
                                        isPreview={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
