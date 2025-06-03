import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    BookOpen,
    Users,
    GraduationCap,
    UserCog,
    ClipboardList,
    Award,
    Search,
    LayoutDashboard,
    FileText,
    Github,
    Activity,
    MessageSquare
} from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutDashboard,
        roles: ['admin'],
    },
    {
        title: 'Application Overview',
        href: route('admin.scholarship.applications'),
        icon: ClipboardList,
        roles: ['admin'],
    },
    {
        title: 'Scholarships Overview',
        href: route('admin.scholarships'),
        icon: Award,
        roles: ['admin'],
    },
    {
        title: 'Manage Students',
        href: route('admin.students'),
        icon: GraduationCap,
        roles: ['admin'],
    },
    {
        title: 'Manage Staff',
        href: route('admin.staff'),
        icon: UserCog,
        roles: ['admin'],
    },
    {
        title: 'Recent Activity',
        href: route('admin.recent-logins'),
        icon: Activity,
        roles: ['admin'],
    },
    {
        title: 'CMS Pages',
        href: route('admin.cms.index'),
        icon: FileText,
        roles: ['admin'],
    }
];

const osasNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('osas.dashboard'),
        icon: LayoutDashboard,
        roles: ['osas_staff']
    },
    {
        title: 'Applications',
        href: route('osas.applications'),
        icon: ClipboardList,
        roles: ['osas_staff']
    },
    {
        title: 'Student Records',
        href: route('osas.students'),
        icon: Users,
        roles: ['osas_staff']
    },
    {
        title: 'Scholarships',
        href: route('osas.manage.scholarships'),
        icon: Award,
        roles: ['osas_staff']
    }
];

const studentNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('student.dashboard'),
        icon: LayoutDashboard,
        roles: ['student']
    },
    {
        title: 'Browse Scholarships',
        href: route('student.scholarships.index'),
        icon: Search,
        roles: ['student']
    },
    {
        title: 'My Applications',
        href: route('student.applications'),
        icon: FileText,
        roles: ['student']
    },
    {
        title: 'Interviews',
        href: route('student.interviews.index'),
        icon: MessageSquare,
        roles: ['student']
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Github,
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

    let mainNavItems: NavItem[] = [];

    switch (userRole) {
        case 'admin':
            mainNavItems = adminNavItems;
            break;
        case 'osas_staff':
            mainNavItems = osasNavItems;
            break;
        case 'student':
            mainNavItems = studentNavItems;
            break;
        default:
            mainNavItems = [];
            break;
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
