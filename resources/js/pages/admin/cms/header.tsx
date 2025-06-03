import { Head, Link, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import ErrorBoundary from '@/components/error-boundary';

interface NavigationItem {
    label: string;
    url: string;
    active: boolean;
}

interface HeaderContent {
    logo_text: string;
    tagline: string;
    navigation: NavigationItem[];
}

interface HeaderData {
    id: number;
    content: HeaderContent;
    updated_at: string;
}

interface Props {
    header: HeaderData | null;
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
    {
        title: 'Edit Header',
        href: route('admin.cms.header'),
    },
];

export default function HeaderEdit({ header }: Props) {
    const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(
        header?.content.navigation || [
            { label: 'Home', url: '/', active: true },
            { label: 'About', url: '/about', active: true },
            { label: 'Scholarships', url: '/scholarships', active: true },
            { label: 'Announcements', url: '/announcements', active: true },
            { label: 'Contact', url: '/contact', active: true },
        ]
    );

    const [logoText, setLogoText] = useState(header?.content.logo_text || 'OSAS Connect');
    const [tagline, setTagline] = useState(header?.content.tagline || 'Scholarship Management');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const content = {
            logo_text: logoText,
            tagline: tagline,
            navigation: navigationItems,
        };        router.put(route('admin.cms.header.update'), {
            content: JSON.stringify(content)
        }, {
            onSuccess: () => {
                setProcessing(false);
                // Success message will be shown via flash message
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
            }
        });
    };    const addNavigationItem = () => {
        const newItem: NavigationItem = { label: '', url: '', active: true };
        const updatedItems = [...navigationItems, newItem];
        setNavigationItems(updatedItems);
    };

    const removeNavigationItem = (index: number) => {
        const updatedItems = navigationItems.filter((_, i) => i !== index);
        setNavigationItems(updatedItems);
    };const updateNavigationItem = (index: number, field: keyof NavigationItem, value: string | boolean) => {
        const updatedItems = navigationItems.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        );
        setNavigationItems(updatedItems);
    };    return (
        <ErrorBoundary>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head>
                    <title>Edit Site Header</title>
                    <meta name="description" content="Edit header content and navigation for OSAS Connect" />
                </Head>
                <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                    {/* Header Section */}
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Edit Site Header</h1>
                                <p className="text-base text-gray-500 dark:text-gray-400">
                                    Customize the header content and navigation for your site.
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                asChild
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 border-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <Link href={route('admin.cms.index')}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to CMS
                                </Link>
                            </Button>
                        </div>
                    </div>                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Logo and Tagline */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Logo & Branding</CardTitle>
                                <CardDescription>
                                    Configure the main logo text and tagline displayed in the header.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="logo_text">Logo Text</Label>
                                    <Input
                                        id="logo_text"
                                        type="text"
                                        value={logoText}
                                        onChange={(e) => setLogoText(e.target.value)}
                                        className="mt-1"
                                        required
                                    />
                                    {errors['content.logo_text'] && (
                                        <p className="mt-2 text-sm text-red-600">{errors['content.logo_text']}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="tagline">Tagline (optional)</Label>
                                    <Input
                                        id="tagline"
                                        type="text"
                                        value={tagline}
                                        onChange={(e) => setTagline(e.target.value)}
                                        className="mt-1"
                                        placeholder="e.g., Scholarship Management"
                                    />
                                    {errors['content.tagline'] && (
                                        <p className="mt-2 text-sm text-red-600">{errors['content.tagline']}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                                {/* Navigation */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Navigation Menu</CardTitle>
                                        <CardDescription>
                                            Configure the main navigation links displayed in the header.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {navigationItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                                    <div className="flex-1">
                                                        <Label htmlFor={`nav_label_${index}`}>Label</Label>
                                                        <Input
                                                            id={`nav_label_${index}`}
                                                            type="text"
                                                            value={item.label}
                                                            onChange={(e) => updateNavigationItem(index, 'label', e.target.value)}
                                                            className="mt-1"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label htmlFor={`nav_url_${index}`}>URL</Label>
                                                        <Input
                                                            id={`nav_url_${index}`}
                                                            type="text"
                                                            value={item.url}
                                                            onChange={(e) => updateNavigationItem(index, 'url', e.target.value)}
                                                            className="mt-1"
                                                            placeholder="/page or https://example.com"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Label htmlFor={`nav_active_${index}`}>Active</Label>
                                                        <Switch
                                                            id={`nav_active_${index}`}
                                                            checked={item.active}
                                                            onCheckedChange={(checked) => updateNavigationItem(index, 'active', checked)}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeNavigationItem(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addNavigationItem}
                                                className="w-full"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Navigation Item
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Header'}
                            </Button>
                        </div>
                    </form>
                </div>
            </AppLayout>
        </ErrorBoundary>
    );
}
