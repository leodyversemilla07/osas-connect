import React from 'react';
import { ContentBlock, FeatureItem } from './types';
import { 
    Star, 
    Heart, 
    Shield, 
    Award, 
    Users, 
    Target,
    MapPin,
    Mail,
    Phone,
    Clock
} from 'lucide-react';

interface BlockRendererProps {
    block: ContentBlock;
    isPreview?: boolean;
}

const iconMap = {
    star: Star,
    heart: Heart,
    shield: Shield,
    award: Award,
    users: Users,
    target: Target,
};

// Type-safe helper functions for accessing unknown properties
const getString = (obj: Record<string, unknown>, key: string, defaultValue = ''): string => {
    const value = obj[key];
    return typeof value === 'string' ? value : defaultValue;
};

const getArray = (obj: Record<string, unknown>, key: string): unknown[] => {
    const value = obj[key];
    return Array.isArray(value) ? value : [];
};

const getObject = (obj: Record<string, unknown>, key: string): Record<string, unknown> => {
    const value = obj[key];
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
};

export function BlockRenderer({ block, isPreview = false }: BlockRendererProps) {
    const baseClasses = isPreview ? 'pointer-events-none' : '';

    switch (block.type) {        
        case 'hero':
            return (
                <div className={`relative overflow-hidden ${baseClasses}`}>
                    {getString(block.content, 'backgroundImage') && (
                        <div className="absolute inset-0">
                            <img 
                                src={getString(block.content, 'backgroundImage')}
                                alt="Hero background"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80"></div>
                        </div>
                    )}
                    
                    <div className={`relative ${!getString(block.content, 'backgroundImage') ? 'bg-gradient-to-r from-primary to-primary/80' : ''} text-primary-foreground py-16 px-6`}>
                        <div className="max-w-4xl mx-auto text-center">
                            {getString(block.content, 'badge') && (
                                <div className="inline-block px-4 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
                                    {getString(block.content, 'badge')}
                                </div>
                            )}
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                {getString(block.content, 'title')}
                            </h1>
                            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                                {getString(block.content, 'subtitle')}
                            </p>
                            {getString(block.content, 'buttonText') && (
                                <a
                                    href={getString(block.content, 'buttonLink')}
                                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                                >
                                    {getString(block.content, 'buttonText')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            );        case 'text':
            return (
                <div className={`py-12 px-6 ${baseClasses}`}>
                    <div className="max-w-4xl mx-auto">
                        {getString(block.content, 'title') && (
                            <h2 className={`text-3xl font-bold text-foreground mb-6 ${
                                getString(block.content, 'alignment') === 'center' ? 'text-center' :
                                getString(block.content, 'alignment') === 'right' ? 'text-right' :
                                'text-left'
                            }`}>
                                {getString(block.content, 'title')}
                            </h2>
                        )}
                        <div className={`prose prose-lg max-w-none ${
                            getString(block.content, 'alignment') === 'center' ? 'text-center' :
                            getString(block.content, 'alignment') === 'right' ? 'text-right' :
                            'text-left'
                        }`}>
                            <p className="text-muted-foreground leading-relaxed">
                                {getString(block.content, 'content')}
                            </p>
                        </div>
                    </div>
                </div>
            );        case 'image':
            return (
                <div className={`py-8 px-6 ${baseClasses}`}>
                    <div className={`max-w-4xl mx-auto ${
                        getString(block.content, 'alignment') === 'center' ? 'text-center' :
                        getString(block.content, 'alignment') === 'right' ? 'text-right' :
                        'text-left'
                    }`}>
                        <div className={`${
                            getString(block.content, 'alignment') === 'center' ? 'mx-auto' :
                            getString(block.content, 'alignment') === 'right' ? 'ml-auto' :
                            'mr-auto'
                        } max-w-2xl`}>
                            <img
                                src={getString(block.content, 'src')}
                                alt={getString(block.content, 'alt')}
                                className="w-full rounded-lg shadow-lg"
                            />
                            {getString(block.content, 'caption') && (
                                <p className="mt-3 text-sm text-muted-foreground italic">
                                    {getString(block.content, 'caption')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            );
            case 'features':
            return (
                <div className={`py-16 px-6 bg-muted ${baseClasses}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            {getString(block.content, 'badge') && (
                                <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                                    {getString(block.content, 'badge')}
                                </div>
                            )}
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                {getString(block.content, 'title')}
                            </h2>
                            {getString(block.content, 'subtitle') && (
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    {getString(block.content, 'subtitle')}
                                </p>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {getArray(block.content, 'items').map((item: unknown, index: number) => {
                                const featureItem = item as FeatureItem;
                                const IconComponent = iconMap[featureItem.icon as keyof typeof iconMap] || Star;
                                return (
                                    <div key={index} className="bg-card p-8 rounded-xl shadow-md border">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                            <IconComponent className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-card-foreground mb-3">
                                            {featureItem.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {featureItem.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );        
            
            case 'cta':
            return (
                <div className={`relative overflow-hidden ${baseClasses}`}>
                    {getString(block.content, 'backgroundImage') && (
                        <div className="absolute inset-0">
                            <img 
                                src={getString(block.content, 'backgroundImage')}
                                alt="CTA background"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/80"></div>
                        </div>
                    )}
                    
                    <div className={`relative ${!getString(block.content, 'backgroundImage') ? 'bg-gradient-to-r from-primary to-primary/80' : ''} text-primary-foreground py-16 px-6`}>
                        <div className="max-w-4xl mx-auto text-center">
                            {getString(block.content, 'badge') && (
                                <div className="inline-block px-4 py-1 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
                                    {getString(block.content, 'badge')}
                                </div>
                            )}
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                {getString(block.content, 'title')}
                            </h2>
                            {getString(block.content, 'subtitle') && (
                                <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                                    {getString(block.content, 'subtitle')}
                                </p>
                            )}
                            {getString(block.content, 'buttonText') && (
                                <a
                                    href={getString(block.content, 'buttonLink')}
                                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                                >
                                    {getString(block.content, 'buttonText')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>            
            );        
                
            case 'contact': {
            const contactInfo = getObject(block.content, 'contactInfo');
            return (
                <div className={`py-16 px-6 bg-background ${baseClasses}`}>
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                {getString(block.content, 'title')}
                            </h2>
                            {getString(block.content, 'subtitle') && (
                                <p className="text-lg text-muted-foreground">
                                    {getString(block.content, 'subtitle')}
                                </p>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {getString(contactInfo, 'address') && (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">Address</h3>
                                    <p className="text-muted-foreground">
                                        {getString(contactInfo, 'address')}
                                    </p>
                                </div>
                            )}
                            {getString(contactInfo, 'email') && (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">Email</h3>
                                    <p className="text-muted-foreground">
                                        {getString(contactInfo, 'email')}
                                    </p>
                                </div>
                            )}
                            {getString(contactInfo, 'phone') && (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Phone className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                                    <p className="text-muted-foreground">
                                        {getString(contactInfo, 'phone')}
                                    </p>
                                </div>
                            )}
                            {getString(contactInfo, 'hours') && (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Clock className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">Hours</h3>
                                    <p className="text-muted-foreground">
                                        {getString(contactInfo, 'hours')}
                                    </p>
                                </div>
                            )}                        
                            </div>
                    </div>
                </div>
            );
        }        default:
            return (
                <div className={`py-8 px-6 bg-destructive/10 border border-destructive/20 ${baseClasses}`}>
                    <div className="text-center">
                        <p className="text-destructive">
                            Unknown block type: {block.type}
                        </p>
                    </div>
                </div>
            );
    }
}
