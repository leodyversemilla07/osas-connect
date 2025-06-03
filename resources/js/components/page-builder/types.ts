export type ContentBlockType = 
    | 'hero'
    | 'text'
    | 'image'
    | 'features'
    | 'cta'
    | 'contact';

export interface ContentBlock {
    id: string;
    type: ContentBlockType;
    content: Record<string, unknown>;
}

export interface HeroContent {
    badge?: string;
    title: string;
    subtitle: string;
    backgroundImage?: string;
    buttonText?: string;
    buttonLink?: string;
}

export interface TextContent {
    title?: string;
    content: string;
    alignment?: 'left' | 'center' | 'right';
}

export interface ImageContent {
    src: string;
    alt: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
}

export interface FeatureItem {
    icon: string;
    title: string;
    description: string;
}

export interface FeaturesContent {
    badge?: string;
    title: string;
    subtitle?: string;
    items: FeatureItem[];
}

export interface CTAContent {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    backgroundImage?: string;
}

export interface ContactContent {
    badge?: string;
    title: string;
    subtitle?: string;
    info: {
        address?: string;
        email?: string;
        phone?: string;
        hours?: string;
    };
}

export interface PageTemplate {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    blocks: ContentBlock[];
    category: 'page' | 'announcement' | 'scholarship';
}

export interface ComponentPaletteItem {
    type: ContentBlockType;
    name: string;
    description: string;
    icon: string;
    category: string;
}
