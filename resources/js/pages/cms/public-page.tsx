import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ContentRenderer } from '@/components/cms/content-renderer';

interface Page {
    title: string;
    slug: string;
    content: string | unknown; // Match ContentType from ContentRenderer
}

interface Props {
    page: Page;
}

export default function PublicPage({ page }: Props) {
    return (
        <AppLayout>
            <Head title={page.title} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {page.title}
                        </h2>
                        <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Preview Mode
                            </span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <ContentRenderer content={page.content} isPreview={true} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
