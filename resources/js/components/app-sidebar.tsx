import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, Home, Users, GraduationCap, UserCog, ClipboardList, Award, Search, MessageCircle } from 'lucide-react';
import AppLogo from './app-logo';


const allNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: Home,
        roles: ['admin'],
    },
    {
        title: 'Manage Students',
        href: route('admin.students'),
        icon: GraduationCap, // Changed to graduation cap for students
        roles: ['admin'],
    },
    {
        title: 'Manage Staff',
        href: route('admin.staff'),
        icon: UserCog, // Changed to user with settings for staff management
        roles: ['admin'],
    }
];

// OSAS Staff navigation items
const osasNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
        icon: Home,
        roles: ['osas_staff']
    },
    {
        title: 'Student Records',
        href: route('osas.students'),
        icon: Users,
        roles: ['osas_staff']
    },
    {
        title: 'Applications',
        href: route('osas.applications'),
        icon: ClipboardList,
        roles: ['osas_staff']
    },
    {
        title: 'Scholarships',
        href: route('osas.manage.scholarships'),
        icon: Award, // Using Award icon for scholarships
        roles: ['osas_staff']
    }
];

// Student navigation items
const studentNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('student.dashboard'),
        icon: Home,
        roles: ['student']
    },
    {
        title: 'Browse Scholarships',
        href: route('scholarships.index'),
        icon: Search, // Using Search icon for browsing scholarships
        roles: ['student']
    },
    {
        title: 'My Applications',
        href: route('student.applications'),
        icon: Folder, // Using Folder icon to distinguish from Scholarships
        roles: ['student']
    },
    {
        title: 'Interviews',
        href: route('interviews.index'),
        icon: MessageCircle, // Using MessageCircle icon for interviews
        roles: ['student']
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;

    // Determine which navigation items to show based on the user's role
    let mainNavItems: NavItem[] = [];

    if (userRole === 'osas_staff') {
        mainNavItems = osasNavItems;
    } else if (userRole === 'student') {
        mainNavItems = studentNavItems;
    } else {
        // Filter regular navigation items for admin, staff, and user roles
        mainNavItems = allNavItems.filter(item =>
            item.roles?.includes(userRole)
        );
    }

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
