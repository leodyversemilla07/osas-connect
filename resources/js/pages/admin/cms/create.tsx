import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageBuilder } from '@/components/page-builder/page-builder';
import { ContentBlock } from '@/components/page-builder/types';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'CMS Pages',
        href: '/admin/cms',
    },
    {
        title: 'Create Page',
        href: '/admin/cms/create',
    },
];

export default function CMSCreate() {
    const { data, setData, post, errors } = useForm({
        title: '',
        slug: '',
        content: JSON.stringify([])
    });

    const handleTitleChange = (title: string) => {
        setData('title', title);
        // Auto-generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        setData('slug', slug);
    }; const handleSave = (content: ContentBlock[]) => {
        setData('content', JSON.stringify(content));
        post(route('admin.cms.store'));
    };

    const handlePreview = (content: ContentBlock[]) => {
        // Create a temporary preview with the current content
        const previewData = {
            title: data.title || 'Preview Page',
            content: content
        };

        // Store preview data in sessionStorage
        sessionStorage.setItem('cms_preview_data', JSON.stringify(previewData));

        // Open preview in new tab
        const previewUrl = route('admin.cms.preview');
        window.open(previewUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create CMS Page" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Create New Page
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Build your page using the visual page builder
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Page Settings */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="title">Page Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Enter page title"
                                className={errors.title ? 'border-red-500' : ''}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="slug">Page Slug</Label>
                            <Input
                                id="slug"
                                type="text"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="page-url-slug"
                                className={errors.slug ? 'border-red-500' : ''}
                            />
                            {errors.slug && (
                                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                            )}
                        </div>
                    </div>
                </div>                {/* Page Builder */}
                <div className="flex-1">
                    <PageBuilder
                        initialContent={(() => {
                            try {
                                const parsed = JSON.parse(data.content);
                                return Array.isArray(parsed) ? parsed : [];
                            } catch {
                                return [];
                            }
                        })()}
                        onSave={handleSave}
                        onPreview={handlePreview}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
