import { Head } from '@inertiajs/react';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { useCMSColors, ColorScheme } from '@/hooks/use-cms-colors';
import { ContentRenderer } from '@/components/cms/content-renderer';

interface Page {
    id: number;
    slug: string;
    title: string;
    content: unknown; // Changed to unknown for better type safety
    created_at: string;
    updated_at: string;
}

interface Props {
    page: Page;
    cmsTheme?: string | null;
    cmsColorScheme?: ColorScheme | null;    headerContent?: {
        logo_text?: string;
        tagline?: string;
        navigation?: Array<{
            label: string;
            url: string;
            active: boolean;
            children?: Array<{ label: string; url: string }>;
        }>;
    };
    footerContent?: {
        cta?: {
            title?: string;
            description?: string;
            button_text?: string;
            button_url?: string;
        };
        about?: {
            title?: string;
            description?: string;
        };
        contact?: {
            address?: string;
            email?: string;
            viber?: string;
            hours?: string;
        };
        social_links?: Array<{
            platform: string;
            url: string;
        }>;
    };
}

export default function PublicPage({ page, cmsTheme, cmsColorScheme, headerContent, footerContent }: Props) {
    // Initialize CMS-aware theme and color management
    useCMSColors({ cmsTheme, cmsColorScheme });

    return (
        <>
            <Head title={page.title} />            <div className="flex min-h-screen flex-col items-center bg-[#f3f2f2] text-[#010002] dark:bg-[#121212] dark:text-[#f3f2f2]">
                {/* Header Component */}
                <SiteHeader content={headerContent} />
                
                {/* Main content with padding for the fixed header */}
                <main className="mt-16 w-full flex-1 p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <ContentRenderer content={page.content} pageTitle={page.title} />
                    </div>
                </main>

                {/* Footer Component */}
                <SiteFooter content={footerContent} />
            </div>
        </>
    );
}
