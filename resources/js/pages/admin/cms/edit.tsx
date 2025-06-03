import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageBuilder } from '@/components/page-builder/page-builder';
import { ContentBlock } from '@/components/page-builder/types';
import { SharedData, BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

interface PageData {
    id: number;
    title: string;
    slug: string;
    content: ContentBlock[];
    created_at: string;
    updated_at: string;
}

interface CMSEditProps extends SharedData {
    page: PageData;
}

type PageFormData = {
    title: string;
    slug: string;
    content: string; // Store content as JSON string
    [key: string]: string | undefined;
};

export default function CMSEdit({ page }: CMSEditProps) {
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
            title: 'Edit Page',
            href: `/admin/cms/${page.id}/edit`,
        },
    ]; const { data, setData, put, errors } = useForm<PageFormData>({
        title: page.title,
        slug: page.slug,
        content: JSON.stringify(Array.isArray(page.content) ? page.content : [])
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


        // For page builder content, serialize the content array to JSON
        setData('content', JSON.stringify(content));
        put(route('admin.cms.update', page.id), {
            onSuccess: () => {
                toast.success('Page updated successfully');
            },
            onError: (err) => {
                const errorMessage = err?.message || 'Please try again.';
                toast.error(`Failed to update page: ${errorMessage}`);
            },
        });
    };

    const handlePreview = (content: ContentBlock[]) => {
        // Open preview in new tab/window
        console.log('Preview content:', content);
        // You can implement a preview route later window.open(`/page/${data.slug}`, '_blank');
    }; return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${page.title}`} />

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header */}
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Edit Page: {page.title}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Edit your page using the visual page builder
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
                                value={data.title as string}
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
                                value={data.slug as string}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="page-url-slug"
                                className={errors.slug ? 'border-red-500' : ''}
                            />
                            {errors.slug && (
                                <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Page Builder */}
                <div className="flex-1">
                    <PageBuilder
                        initialContent={Array.isArray(page.content) ? page.content : []}
                        onSave={handleSave}
                        onPreview={handlePreview}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
