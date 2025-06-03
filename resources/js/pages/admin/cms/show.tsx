import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Edit, Tag, Calendar, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Page {
    id: number;
    slug: string;
    title: string;
    content: {
        hero?: {
            title?: string;
            subtitle?: string;
            image?: string;
        };
        sections?: Array<{
            type: string;
            title?: string;
            content?: string;
            items?: string[];
        }>;
    };
    created_at: string;
    updated_at: string;
}

interface Props {
    page: Page;
}

export default function Show({ page }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }; const renderContentPreview = (content: Page['content']) => {
        if (!content) return <p className="text-gray-500 dark:text-gray-400">No content available</p>;

        return (
            <div className="space-y-6">
                {content.hero && (
                    <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Hero Section</h4>
                        {content.hero.title && (
                            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Title:</span> {content.hero.title}</p>
                        )}
                        {content.hero.subtitle && (
                            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Subtitle:</span> {content.hero.subtitle}</p>
                        )}
                        {content.hero.image && (
                            <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Image:</span> {content.hero.image}</p>
                        )}
                    </div>
                )}

                {content.sections && content.sections.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">Content Sections</h4>
                        {content.sections.map((section, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">{section.type}</Badge>
                                    {section.title && (
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{section.title}</span>
                                    )}
                                </div>
                                {section.content && (
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{section.content}</p>
                                )}
                                {section.items && section.items.length > 0 && (
                                    <div className="space-y-1">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Items:</span>
                                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 ml-4">
                                            {section.items.map((item, itemIndex) => (
                                                <li key={itemIndex}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }; return (
        <AppLayout breadcrumbs={[
            { title: 'Admin', href: route('admin.dashboard') },
            { title: 'CMS Pages', href: route('admin.cms.index') },
            { title: 'View Page', href: route('admin.cms.show', page.id) }
        ]}>
            <Head title={`View Page: ${page.title}`} />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">View Page</h1>
                                <p className="text-base text-gray-500 dark:text-gray-400">Page details and content preview</p>
                            </div>
                        </div>
                        <Link href={`/admin/cms/${page.id}/edit`}>
                            <Button className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Page
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Page Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Tag className="h-5 w-5" />
                                Page Information
                            </CardTitle>
                        </CardHeader>                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{page.title}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Slug</label>
                                    <p className="text-gray-900 dark:text-gray-100 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                                        /{page.slug}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>Created: {formatDate(page.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>Updated: {formatDate(page.updated_at)}</span>
                                </div>
                            </div>
                        </CardContent>                    </Card>

                    {/* Page Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Page Content Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderContentPreview(page.content)}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Link href={`/${page.slug}`} target="_blank">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        View Live Page
                                    </Button>
                                </Link>
                                <Link href={`/admin/cms/${page.id}/edit`}>
                                    <Button className="flex items-center gap-2">
                                        <Edit className="h-4 w-4" />
                                        Edit Content
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${page.slug}`)}
                                    className="flex items-center gap-2"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Copy URL
                                </Button>
                            </div>
                        </CardContent>
                    </Card></div>
            </div>
        </AppLayout>
    );
}
