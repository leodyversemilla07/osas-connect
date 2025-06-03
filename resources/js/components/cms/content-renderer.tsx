import { Badge } from '@/components/ui/badge';

// Type definitions for structured content
interface HeroSection {
    type: 'hero';
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaLink?: string;
}

interface ContentSection {
    type: 'content';
    title?: string;
    content: string;
    layout?: 'single' | 'two-column';
}

interface FeatureSection {
    type: 'features';
    title?: string;
    features: Array<{
        title: string;
        description: string;
        icon?: string;
    }>;
}

interface ContactSection {
    type: 'contact';
    title?: string;
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
}

interface StructuredContent {
    sections: Array<HeroSection | ContentSection | FeatureSection | ContactSection>;
}

// Legacy content interface for backward compatibility
interface LegacyContent {
    heading?: string;
    subheading?: string;
    body?: string;
    mission?: string;
    vision?: string;
    features?: string[];
    values?: string[];
    contact_info?: {
        email?: string;
        phone?: string;
        address?: string;
        hours?: string;
    };
    departments?: Record<string, string>;
}

// Generic content interface for enhanced layouts
interface GenericContent {
    heading?: string;
    title?: string;
    subheading?: string;
    subtitle?: string;
    badge?: string;
    body?: string;
    mission?: string;
    vision?: string;
    features?: Array<string | { title?: string; name?: string; description?: string }>;
    values?: Array<string | { title?: string; name?: string; description?: string }>;
    contact_info?: {
        email?: string;
        phone?: string;
        address?: string;
        hours?: string;
    };
    email?: string;
    phone?: string;
    address?: string;
    departments?: Record<string, string>;
}

type ContentType = StructuredContent | LegacyContent | GenericContent | string | unknown;

interface ContentRendererProps {
    content: ContentType;
    pageTitle?: string;
    isPreview?: boolean;
}

// Function to render generic content objects with enhanced layouts
function renderGenericObjectContent(content: GenericContent, pageTitle?: string, isPreview?: boolean) {
    return (
        <>
            {/* Hero Section - inspired by home.tsx and about.tsx */}
            <div className="relative overflow-hidden rounded-xl shadow-lg mb-16">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#005a2d]/95 to-[#008040]/90"></div>

                {/* Background pattern/texture */}
                <div className="absolute inset-0 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <pattern id="pattern-circles" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                            <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#fff" />
                        </pattern>
                        <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
                    </svg>
                </div>
                
                <div className="relative flex min-h-[40vh] flex-col items-center justify-center px-6 py-12 md:px-10 lg:px-16">
                    <div className="text-center">
                        <div className="inline-block rounded-full bg-[#febd12]/20 px-4 py-1 text-sm font-medium text-[#febd12] mb-4">
                            {content.badge || 'CMS Page'}
                        </div>
                        <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                            {content.heading || content.title || pageTitle || 'Welcome'}
                        </h1>
                        {(content.subheading || content.subtitle) && (
                            <p className="mt-6 max-w-2xl mx-auto text-xl text-white/90">
                                {content.subheading || content.subtitle}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            {content.body && (
                <section className="py-16">
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-1 rounded-full bg-[#23b14d]/10 text-sm font-medium text-[#23b14d] mb-3">
                            About This Page
                        </div>
                        <h2 className="text-3xl font-bold text-[#005a2d] mb-6">Learn More</h2>
                    </div>
                    <div className="prose prose-lg max-w-4xl mx-auto dark:prose-invert prose-headings:text-[#005a2d] dark:prose-headings:text-gray-100">
                        <p className="text-lg text-[#010002]/80 dark:text-[#f3f2f2]/80 leading-relaxed">
                            {content.body}
                        </p>
                    </div>
                </section>
            )}

            {/* Features Section */}
            {content.features && Array.isArray(content.features) && content.features.length > 0 && (
                <section className="py-16">
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-1 rounded-full bg-[#febd12]/20 text-sm font-medium text-[#febd12] mb-3">
                            Features
                        </div>
                        <h2 className="text-3xl font-bold text-[#005a2d]">Key Highlights</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                            Discover what makes this page special
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {content.features.map((feature: string | { title?: string; name?: string; description?: string }, index: number) => {
                            const featureTitle = typeof feature === 'string' ? feature : (feature.title || feature.name || `Feature ${index + 1}`);
                            const featureDescription = typeof feature === 'object' && feature.description ? feature.description : `Enhanced ${featureTitle.toLowerCase()} capabilities`;
                            
                            return (
                                <div key={index} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#005a2d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#005a2d]/10 mb-4">
                                            <span className="text-[#005a2d] font-semibold">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#005a2d] dark:text-gray-100 mb-3">
                                            {featureTitle}
                                        </h3>
                                        <p className="text-[#010002]/70 dark:text-[#f3f2f2]/70 leading-relaxed">
                                            {featureDescription}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Mission/Vision Section */}
            {(content.mission || content.vision) && (
                <section className="py-16">
                    <div className="grid gap-12 md:grid-cols-2 items-center">
                        {content.mission && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                                <div className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-sm font-medium text-green-700 dark:text-green-400 mb-4">
                                    Our Mission
                                </div>
                                <h3 className="text-2xl font-bold text-[#005a2d] dark:text-gray-100 mb-4">
                                    What We Do
                                </h3>
                                <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 leading-relaxed">
                                    {content.mission}
                                </p>
                            </div>
                        )}
                        
                        {content.vision && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
                                <div className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-medium text-blue-700 dark:text-blue-400 mb-4">
                                    Our Vision
                                </div>
                                <h3 className="text-2xl font-bold text-[#005a2d] dark:text-gray-100 mb-4">
                                    Where We're Going
                                </h3>
                                <p className="text-[#010002]/80 dark:text-[#f3f2f2]/80 leading-relaxed">
                                    {content.vision}
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Values Section */}
            {content.values && Array.isArray(content.values) && content.values.length > 0 && (
                <section className="py-16">
                    <div className="text-center mb-12">
                        <div className="inline-block px-4 py-1 rounded-full bg-[#005a2d]/10 text-sm font-medium text-[#005a2d] mb-3">
                            Core Values
                        </div>
                        <h2 className="text-3xl font-bold text-[#005a2d]">What We Stand For</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-[#010002]/70 dark:text-[#f3f2f2]/70">
                            The principles that guide everything we do
                        </p>
                    </div>
                    
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {content.values.map((value: string | { title?: string; name?: string; description?: string }, index: number) => {
                            const valueTitle = typeof value === 'string' ? value : (value.title || value.name || `Value ${index + 1}`);
                            const valueDescription = typeof value === 'object' && value.description ? value.description : '';
                            
                            return (
                                <div key={index} className="flex items-start space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#005a2d] to-[#008040] rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">
                                                {valueTitle.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#005a2d] dark:text-gray-100 mb-1">
                                            {valueTitle}
                                        </h3>
                                        {valueDescription && (
                                            <p className="text-sm text-[#010002]/70 dark:text-[#f3f2f2]/70">
                                                {valueDescription}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Contact Information Section */}
            {(content.contact_info || content.email || content.phone || content.address) && (
                <section className="py-16">
                    <div className="bg-gradient-to-r from-[#005a2d] to-[#008040] rounded-2xl p-8 shadow-xl overflow-hidden relative">
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                <pattern id="contact-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <rect x="0" y="0" width="4" height="4" className="text-white/20" fill="currentColor" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#contact-pattern)" />
                            </svg>
                        </div>

                        <div className="relative z-10 text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4">Get In Touch</h2>
                            <p className="text-xl text-white/90">
                                Ready to connect with us? Here's how you can reach out.
                            </p>
                        </div>

                        <div className="relative z-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {(content.email || content.contact_info?.email) && (
                                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm">✉</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Email</h3>
                                        <a href={`mailto:${content.email || content.contact_info?.email}`} className="text-white/90 hover:text-white">
                                            {content.email || content.contact_info?.email}
                                        </a>
                                    </div>
                                </div>
                            )}
                            
                            {(content.phone || content.contact_info?.phone) && (
                                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm">📞</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Phone</h3>
                                        <a href={`tel:${content.phone || content.contact_info?.phone}`} className="text-white/90 hover:text-white">
                                            {content.phone || content.contact_info?.phone}
                                        </a>
                                    </div>
                                </div>
                            )}
                            
                            {(content.address || content.contact_info?.address) && (
                                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <span className="text-white text-sm">📍</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Address</h3>
                                        <p className="text-white/90">{content.address || content.contact_info?.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Debug info for preview mode */}
            {isPreview && (
                <section className="py-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Badge variant="outline" className="border-blue-500 text-blue-700 dark:text-blue-400">
                                Preview Mode
                            </Badge>
                            <Badge variant="secondary">Enhanced Layout</Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Content Structure
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This page is automatically using an enhanced layout based on the content structure. The design adapts to display your content beautifully.
                        </p>
                        <details className="mt-4">
                            <summary className="cursor-pointer text-sm font-medium text-blue-600 dark:text-blue-400">
                                View Raw Content Data
                            </summary>
                            <pre className="mt-2 bg-white dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs border border-gray-200 dark:border-gray-700">
                                <code className="text-gray-800 dark:text-gray-200">
                                    {JSON.stringify(content, null, 2)}
                                </code>
                            </pre>
                        </details>
                    </div>
                </section>
            )}
        </>
    );
}

export function ContentRenderer({ content, pageTitle, isPreview = false }: ContentRendererProps) {    // Handle null or undefined content
    if (!content) {
        return (
            <div className="py-16">
                {pageTitle && (
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-[#005a2d] dark:text-gray-100 mb-4">
                            {pageTitle}
                        </h1>
                    </div>
                )}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-400">
                            No Content
                        </Badge>
                        {isPreview && <Badge variant="outline">Preview Mode</Badge>}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Content Not Available
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        This page doesn't have any content yet. {isPreview ? 'Add some content through the CMS to see it here.' : 'Please check back later.'}
                    </p>
                </div>
            </div>
        );
    }    // If content is a string, treat it as HTML (legacy support)
    if (typeof content === 'string') {
        // Handle empty strings
        if (content.trim() === '') {
            return (
                <div className="py-16">
                    {pageTitle && (
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-[#005a2d] dark:text-gray-100 mb-4">
                                {pageTitle}
                            </h1>
                        </div>
                    )}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Badge variant="outline" className="border-blue-500 text-blue-700 dark:text-blue-400">
                                Empty Content
                            </Badge>
                            {isPreview && <Badge variant="outline">Preview Mode</Badge>}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No Content Added Yet
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            This page has been created but no content has been added yet. {isPreview ? 'Use the CMS editor to add content.' : 'Please check back later.'}
                        </p>
                    </div>
                </div>
            );
        }
        
        return (
            <div className="py-16">
                {pageTitle && (
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-[#005a2d] dark:text-gray-100 mb-4">
                            {pageTitle}
                        </h1>
                    </div>
                )}
                <div 
                    className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-[#005a2d] dark:prose-headings:text-gray-100"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        );
    }

    // Check if it's structured content with sections
    if (content && typeof content === 'object' && 'sections' in content) {
        const structuredContent = content as StructuredContent;
        return (
            <div className="space-y-12">
                {structuredContent.sections.map((section, index) => (
                    <div key={index}>
                        {section.type === 'hero' && (
                            <div className="relative bg-gradient-to-br from-[#005a2d] to-[#007a3d] text-white overflow-hidden rounded-2xl">
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="absolute inset-0">
                                    <svg className="absolute bottom-0 left-0 text-white/5" width="404" height="384" fill="currentColor" viewBox="0 0 404 384">
                                        <defs>
                                            <pattern id="hero-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                                <rect x="0" y="0" width="4" height="4" className="text-white/20" fill="currentColor" />
                                            </pattern>
                                        </defs>
                                        <rect width="404" height="384" fill="url(#hero-pattern)" />
                                    </svg>
                                </div>
                                <div className="relative px-8 py-20 lg:px-16 lg:py-32">
                                    <div className="max-w-4xl">
                                        <h1 className="text-4xl font-bold lg:text-6xl mb-6">
                                            {section.title}
                                        </h1>
                                        {section.subtitle && (
                                            <p className="text-xl lg:text-2xl text-white/90 mb-8">
                                                {section.subtitle}
                                            </p>
                                        )}
                                        {section.ctaText && section.ctaLink && (
                                            <a
                                                href={section.ctaLink}
                                                className="inline-flex items-center px-6 py-3 bg-[#febd12] text-[#010002] font-semibold rounded-lg hover:bg-[#f5b400] transition-colors duration-200"
                                            >
                                                {section.ctaText}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {section.type === 'content' && (
                            <div className="py-8">
                                {section.title && (
                                    <h2 className="text-3xl font-bold text-[#005a2d] dark:text-gray-100 mb-8 text-center">
                                        {section.title}
                                    </h2>
                                )}
                                <div className={`prose prose-lg max-w-none dark:prose-invert prose-headings:text-[#005a2d] dark:prose-headings:text-gray-100 ${
                                    section.layout === 'two-column' ? 'columns-2 gap-8' : ''
                                }`}>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        )}

                        {section.type === 'features' && (
                            <div className="py-8">
                                {section.title && (
                                    <h2 className="text-3xl font-bold text-[#005a2d] dark:text-gray-100 mb-12 text-center">
                                        {section.title}
                                    </h2>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {section.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-[#005a2d] rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {feature.icon || '★'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-[#005a2d] dark:text-gray-100 mb-2">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {section.type === 'contact' && (
                            <div className="py-8">
                                {section.title && (
                                    <h2 className="text-3xl font-bold text-[#005a2d] dark:text-gray-100 mb-8 text-center">
                                        {section.title}
                                    </h2>
                                )}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {section.email && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-[#005a2d] rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm">✉</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-[#005a2d] dark:text-gray-100">Email</h3>
                                                    <a href={`mailto:${section.email}`} className="text-[#005a2d] hover:text-[#007a3d] dark:text-gray-300 dark:hover:text-gray-100">
                                                        {section.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {section.phone && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-[#005a2d] rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm">📞</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-[#005a2d] dark:text-gray-100">Phone</h3>
                                                    <a href={`tel:${section.phone}`} className="text-[#005a2d] hover:text-[#007a3d] dark:text-gray-300 dark:hover:text-gray-100">
                                                        {section.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {section.address && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-[#005a2d] rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm">📍</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-[#005a2d] dark:text-gray-100">Address</h3>
                                                    <p className="text-gray-700 dark:text-gray-300">{section.address}</p>
                                                </div>
                                            </div>
                                        )}
                                        {section.hours && (
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-[#005a2d] rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-sm">🕒</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-[#005a2d] dark:text-gray-100">Hours</h3>
                                                    <p className="text-gray-700 dark:text-gray-300">{section.hours}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }    // Handle generic content objects (new enhanced rendering)
    if (content && typeof content === 'object' && !('sections' in content)) {
        return renderGenericObjectContent(content as GenericContent, pageTitle, isPreview);
    }

    // Fallback for unknown content types - display as JSON with better formatting
    return (
        <div className="py-16">
            {pageTitle && (
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#005a2d] dark:text-gray-100 mb-4">
                        {pageTitle}
                    </h1>
                </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
                <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">Raw Content</Badge>
                    {isPreview && <Badge variant="outline">Preview Mode</Badge>}
                </div>
                <pre className="bg-white dark:bg-gray-900 p-6 rounded-lg overflow-x-auto text-sm border border-gray-200 dark:border-gray-700">
                    <code className="text-gray-800 dark:text-gray-200">
                        {JSON.stringify(content, null, 2)}
                    </code>
                </pre>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    This content will be displayed with proper formatting once the page structure is defined.
                </p>
            </div>
        </div>
    );
}
