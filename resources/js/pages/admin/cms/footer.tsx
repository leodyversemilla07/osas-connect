import { Head, Link, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import ErrorBoundary from '@/components/error-boundary';

interface SocialLink {
    platform: string;
    url: string;
    active: boolean;
}

interface QuickLink {
    label: string;
    url: string;
    active: boolean;
}

interface SupportLink {
    label: string;
    url: string;
    active: boolean;
}

interface ContactInfo {
    address: string;
    email: string;
    viber: string;
    hours: string;
}

interface FooterContent {
    cta_title: string;
    cta_description: string;
    cta_button_text: string;
    cta_button_url: string;
    about_title: string;
    about_text: string;
    social_links: SocialLink[];
    quick_links: QuickLink[];
    support_links: SupportLink[];
    contact_info: ContactInfo;
}

interface FooterData {
    id: number;
    content: FooterContent;
    updated_at: string;
}

interface Props {
    footer: FooterData | null;
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
        title: 'Edit Footer',
        href: route('admin.cms.footer'),
    },
];

export default function FooterEdit({ footer }: Props) {
    // Initialize state from footer content or defaults
    const [ctaTitle, setCtaTitle] = useState(footer?.content.cta_title || 'Ready to Apply?');
    const [ctaDescription, setCtaDescription] = useState(footer?.content.cta_description || 'Start your scholarship journey today.');
    const [ctaButtonText, setCtaButtonText] = useState(footer?.content.cta_button_text || 'Browse Scholarships');
    const [ctaButtonUrl, setCtaButtonUrl] = useState(footer?.content.cta_button_url || '/scholarships');
    const [aboutTitle, setAboutTitle] = useState(footer?.content.about_title || 'About OSAS Connect');
    const [aboutText, setAboutText] = useState(footer?.content.about_text || 'OSAS Connect is your gateway to educational opportunities and scholarship management.');
    
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
        footer?.content.social_links || [
            { platform: 'Facebook', url: '#', active: true },
            { platform: 'Twitter', url: '#', active: true },
            { platform: 'Instagram', url: '#', active: true },
        ]
    );
    
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>(
        footer?.content.quick_links || [
            { label: 'Home', url: '/', active: true },
            { label: 'About', url: '/about', active: true },
            { label: 'Scholarships', url: '/scholarships', active: true },
            { label: 'Contact', url: '/contact', active: true },
        ]
    );
    
    const [supportLinks, setSupportLinks] = useState<SupportLink[]>(
        footer?.content.support_links || [
            { label: 'Help Center', url: '/help', active: true },
            { label: 'Privacy Policy', url: '/privacy', active: true },
            { label: 'Terms of Service', url: '/terms', active: true },
        ]
    );
    
    const [contactInfo, setContactInfo] = useState<ContactInfo>(
        footer?.content.contact_info || {
            address: 'University Campus, Building A, Room 101',
            email: 'osas@university.edu.ph',
            viber: '+63 917 123 4567',
            hours: 'Monday - Friday, 8:00 AM - 5:00 PM'
        }
    );

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const content = {
            cta_title: ctaTitle,
            cta_description: ctaDescription,
            cta_button_text: ctaButtonText,
            cta_button_url: ctaButtonUrl,
            about_title: aboutTitle,
            about_text: aboutText,
            social_links: socialLinks,
            quick_links: quickLinks,
            support_links: supportLinks,
            contact_info: contactInfo,
        };

        router.put(route('admin.cms.footer.update'), {
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
    };

    // Social Links Management
    const addSocialLink = () => {
        const newLink: SocialLink = { platform: '', url: '', active: true };
        setSocialLinks([...socialLinks, newLink]);
    };

    const removeSocialLink = (index: number) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const updateSocialLink = (index: number, field: keyof SocialLink, value: string | boolean) => {
        const updatedLinks = socialLinks.map((link, i) => 
            i === index ? { ...link, [field]: value } : link
        );
        setSocialLinks(updatedLinks);
    };

    // Quick Links Management
    const addQuickLink = () => {
        const newLink: QuickLink = { label: '', url: '', active: true };
        setQuickLinks([...quickLinks, newLink]);
    };

    const removeQuickLink = (index: number) => {
        setQuickLinks(quickLinks.filter((_, i) => i !== index));
    };

    const updateQuickLink = (index: number, field: keyof QuickLink, value: string | boolean) => {
        const updatedLinks = quickLinks.map((link, i) => 
            i === index ? { ...link, [field]: value } : link
        );
        setQuickLinks(updatedLinks);
    };

    // Support Links Management
    const addSupportLink = () => {
        const newLink: SupportLink = { label: '', url: '', active: true };
        setSupportLinks([...supportLinks, newLink]);
    };

    const removeSupportLink = (index: number) => {
        setSupportLinks(supportLinks.filter((_, i) => i !== index));
    };

    const updateSupportLink = (index: number, field: keyof SupportLink, value: string | boolean) => {
        const updatedLinks = supportLinks.map((link, i) => 
            i === index ? { ...link, [field]: value } : link
        );
        setSupportLinks(updatedLinks);
    };

    // Contact Info Management
    const updateContactInfo = (field: keyof ContactInfo, value: string) => {
        setContactInfo({ ...contactInfo, [field]: value });
    };    return (
        <ErrorBoundary>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head>
                    <title>Edit Site Footer</title>
                    <meta name="description" content="Edit footer content, links, and contact information for OSAS Connect" />
                </Head>
                <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                    {/* Header Section */}
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Edit Site Footer</h1>
                                <p className="text-base text-gray-500 dark:text-gray-400">
                                    Customize the footer content, links, and contact information for your site.
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
                    </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* CTA Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Call-to-Action Section</CardTitle>
                                        <CardDescription>
                                            Configure the prominent call-to-action displayed at the top of the footer.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="cta_title">CTA Title</Label>
                                            <Input
                                                id="cta_title"
                                                type="text"
                                                value={ctaTitle}
                                                onChange={(e) => setCtaTitle(e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                            {errors['content.cta_title'] && (
                                                <p className="mt-2 text-sm text-red-600">{errors['content.cta_title']}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="cta_description">CTA Description</Label>
                                            <Textarea
                                                id="cta_description"
                                                value={ctaDescription}
                                                onChange={(e) => setCtaDescription(e.target.value)}
                                                className="mt-1"
                                                rows={3}
                                                required
                                            />
                                            {errors['content.cta_description'] && (
                                                <p className="mt-2 text-sm text-red-600">{errors['content.cta_description']}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="cta_button_text">Button Text</Label>
                                                <Input
                                                    id="cta_button_text"
                                                    type="text"
                                                    value={ctaButtonText}
                                                    onChange={(e) => setCtaButtonText(e.target.value)}
                                                    className="mt-1"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="cta_button_url">Button URL</Label>
                                                <Input
                                                    id="cta_button_url"
                                                    type="text"
                                                    value={ctaButtonUrl}
                                                    onChange={(e) => setCtaButtonUrl(e.target.value)}
                                                    className="mt-1"
                                                    placeholder="/page or https://example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* About Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About Section</CardTitle>
                                        <CardDescription>
                                            Configure the about section content in the footer.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="about_title">About Title</Label>
                                            <Input
                                                id="about_title"
                                                type="text"
                                                value={aboutTitle}
                                                onChange={(e) => setAboutTitle(e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="about_text">About Text</Label>
                                            <Textarea
                                                id="about_text"
                                                value={aboutText}
                                                onChange={(e) => setAboutText(e.target.value)}
                                                className="mt-1"
                                                rows={4}
                                                required
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Social Links */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Social Media Links</CardTitle>
                                        <CardDescription>
                                            Configure social media platform links displayed in the footer.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {socialLinks.map((link, index) => (
                                                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                                    <div className="flex-1">
                                                        <Label htmlFor={`social_platform_${index}`}>Platform</Label>
                                                        <Input
                                                            id={`social_platform_${index}`}
                                                            type="text"
                                                            value={link.platform}
                                                            onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                                            className="mt-1"
                                                            placeholder="e.g., Facebook, Twitter"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label htmlFor={`social_url_${index}`}>URL</Label>
                                                        <Input
                                                            id={`social_url_${index}`}
                                                            type="text"
                                                            value={link.url}
                                                            onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                                            className="mt-1"
                                                            placeholder="https://facebook.com/page"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Label htmlFor={`social_active_${index}`}>Active</Label>
                                                        <Switch
                                                            id={`social_active_${index}`}
                                                            checked={link.active}
                                                            onCheckedChange={(checked) => updateSocialLink(index, 'active', checked)}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeSocialLink(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addSocialLink}
                                                className="w-full"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Social Link
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Links */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Links</CardTitle>
                                        <CardDescription>
                                            Configure quick navigation links in the footer.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {quickLinks.map((link, index) => (
                                                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                                    <div className="flex-1">
                                                        <Label htmlFor={`quick_label_${index}`}>Label</Label>
                                                        <Input
                                                            id={`quick_label_${index}`}
                                                            type="text"
                                                            value={link.label}
                                                            onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                                                            className="mt-1"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label htmlFor={`quick_url_${index}`}>URL</Label>
                                                        <Input
                                                            id={`quick_url_${index}`}
                                                            type="text"
                                                            value={link.url}
                                                            onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                                                            className="mt-1"
                                                            placeholder="/page or https://example.com"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Label htmlFor={`quick_active_${index}`}>Active</Label>
                                                        <Switch
                                                            id={`quick_active_${index}`}
                                                            checked={link.active}
                                                            onCheckedChange={(checked) => updateQuickLink(index, 'active', checked)}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeQuickLink(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addQuickLink}
                                                className="w-full"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Quick Link
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Support Links */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Support Links</CardTitle>
                                        <CardDescription>
                                            Configure support and legal links in the footer.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {supportLinks.map((link, index) => (
                                                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                                    <div className="flex-1">
                                                        <Label htmlFor={`support_label_${index}`}>Label</Label>
                                                        <Input
                                                            id={`support_label_${index}`}
                                                            type="text"
                                                            value={link.label}
                                                            onChange={(e) => updateSupportLink(index, 'label', e.target.value)}
                                                            className="mt-1"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <Label htmlFor={`support_url_${index}`}>URL</Label>
                                                        <Input
                                                            id={`support_url_${index}`}
                                                            type="text"
                                                            value={link.url}
                                                            onChange={(e) => updateSupportLink(index, 'url', e.target.value)}
                                                            className="mt-1"
                                                            placeholder="/page or https://example.com"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Label htmlFor={`support_active_${index}`}>Active</Label>
                                                        <Switch
                                                            id={`support_active_${index}`}
                                                            checked={link.active}
                                                            onCheckedChange={(checked) => updateSupportLink(index, 'active', checked)}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removeSupportLink(index)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addSupportLink}
                                                className="w-full"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Support Link
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Contact Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact Information</CardTitle>
                                        <CardDescription>
                                            Configure contact details displayed in the footer.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="contact_address">Address</Label>
                                            <Textarea
                                                id="contact_address"
                                                value={contactInfo.address}
                                                onChange={(e) => updateContactInfo('address', e.target.value)}
                                                className="mt-1"
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="contact_email">Email</Label>
                                                <Input
                                                    id="contact_email"
                                                    type="email"
                                                    value={contactInfo.email}
                                                    onChange={(e) => updateContactInfo('email', e.target.value)}
                                                    className="mt-1"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="contact_viber">Viber</Label>
                                                <Input
                                                    id="contact_viber"
                                                    type="text"
                                                    value={contactInfo.viber}
                                                    onChange={(e) => updateContactInfo('viber', e.target.value)}
                                                    className="mt-1"
                                                    placeholder="+63 917 123 4567"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="contact_hours">Office Hours</Label>
                                            <Input
                                                id="contact_hours"
                                                type="text"
                                                value={contactInfo.hours}
                                                onChange={(e) => updateContactInfo('hours', e.target.value)}
                                                className="mt-1"
                                                placeholder="Monday - Friday, 8:00 AM - 5:00 PM"
                                                required
                                            />
                                        </div>
                                    </CardContent>
                                </Card>                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Footer'}
                            </Button>
                        </div>
                    </form>
                </div>
            </AppLayout>
        </ErrorBoundary>
    );
}
