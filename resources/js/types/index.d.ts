import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    last_name: string;
    first_name: string;
    middle_name: string;
    email: string;
    student_id: string;
    password?: string;
    password_confirmation?: string;
    course: string;
    major: string;
    year_level: string;
    civil_status: string;
    sex: string;
    date_of_birth: string;
    place_of_birth: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    residence_type: string;
    guardian_name: string;
    scholarships?: string;
    mobile_number: string;
    telephone_number: string;
    is_pwd: string;
    disability_type: string;
    religion: string;
    avatar?: string;
    email_verified_at?: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
