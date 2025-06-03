import { Head, Link, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/cms-management/data-table';
import { getColumns, type Page } from '@/components/cms-management/columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Layout } from 'lucide-react';
import ErrorBoundary from '@/components/error-boundary';
import { useState } from 'react';

interface CMSIndexProps {
    pages: Page[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
    },
    {
        title: 'CMS Pages',
        href: route('admin.cms.index'),
    },
];

export default function CMSIndex({ pages }: CMSIndexProps) {
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleDeleteClick = (page: Page) => {
        setSelectedPage(page);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedPage) {
            router.delete(route('admin.cms.destroy', selectedPage.id));
        }
        setIsDeleteOpen(false);
        setSelectedPage(null);
    };

    const handleDeleteCancel = () => {
        setIsDeleteOpen(false);
        setSelectedPage(null);
    };

    return (
        <ErrorBoundary>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head>
                    <title>CMS Pages</title>
                    <meta name="description" content="Manage CMS pages for OSAS Connect" />
                </Head>
                <div className="flex h-full flex-1 flex-col space-y-6 p-6">                    {/* Header Section */}
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">CMS Pages</h1>
                                <p className="text-base text-gray-500 dark:text-gray-400">Manage content pages</p>
                            </div>
                            <Button
                                variant="ghost"
                                asChild
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <Link href={route('admin.cms.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Page
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Site Components Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Layout className="mr-2 h-5 w-5" />
                                Site Components
                            </CardTitle>
                            <CardDescription>
                                Manage global site components like header and footer
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Header</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Edit navigation, logo, and header content
                                    </p>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={route('admin.cms.header')}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Header
                                        </Link>
                                    </Button>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Footer</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Edit footer links, contact info, and social media
                                    </p>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={route('admin.cms.footer')}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Footer
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <DataTable columns={getColumns(handleDeleteClick)} data={pages} />

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Page</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete "{selectedPage?.title}"? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={handleDeleteCancel}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteConfirm}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </AppLayout>
        </ErrorBoundary>
    );
}
