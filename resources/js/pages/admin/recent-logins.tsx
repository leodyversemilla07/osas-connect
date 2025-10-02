import { Badge } from '@/components/ui/badge';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Activity } from 'lucide-react';

interface ProfileInfo {
    student_id?: string;
    course?: string;
    year_level?: string;
    staff_id?: string;
    department?: string;
}

interface RecentLogin {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
    last_activity: string;
    is_active: boolean;
    profile_info: ProfileInfo | null;
    ip_address?: string;
    device?: string;
    browser?: string;
}

interface PaginatedRecentLogins {
    data: RecentLogin[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface PageProps {
    recentLogins: PaginatedRecentLogins;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Recent Activity',
        href: '/admin/recent-logins',
    },
];

const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
        case 'osas staff':
            return 'bg-primary/10 text-primary dark:bg-primary/20 border-primary/20 dark:border-primary/30';
        case 'student':
            return 'bg-chart-1/10 text-chart-1 dark:bg-chart-1/20 border-chart-1/20 dark:border-chart-1/30';
        default:
            return 'bg-muted text-muted-foreground border-border';
    }
};

export default function RecentLogins({ recentLogins }: PageProps) {
    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    };

    const handlePerPageChange = (perPage: string) => {
        router.visit('/admin/recent-logins', {
            data: { per_page: perPage },
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Recent Activity - Admin</title>
                <meta name="description" content="View recent user login activity across the system" />
            </Head>

            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <span className="text-3xl font-bold">Recent Activity</span>
                        <div className="text-muted-foreground mt-2 text-base">Monitor recent user login activity and system access</div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="border-border bg-card mt-2 rounded-lg border">
                    {recentLogins.data.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Activity</TableHead>
                                    <TableHead>Date/Time</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Browser</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentLogins.data.map((login) => (
                                    <TableRow
                                        key={login.id}
                                        className="border-border hover:bg-muted/50 dark:hover:bg-muted/30 border-b transition-colors"
                                    >
                                        <TableCell className="py-4">
                                            <span className="text-foreground font-semibold">{login.name}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-muted-foreground text-sm">{login.email}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={`px-2.5 py-0.5 ${getRoleColor(login.role)}`}>{login.role}</Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge
                                                variant={login.is_active ? 'default' : 'secondary'}
                                                className={`border px-2.5 py-0.5 ${
                                                    login.is_active
                                                        ? 'bg-chart-1/10 text-chart-1 border-chart-1/20 dark:bg-chart-1/20 dark:border-chart-1/30'
                                                        : 'bg-muted text-muted-foreground border-border'
                                                }`}
                                            >
                                                {login.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-foreground text-sm font-medium">
                                                {formatDistanceToNow(new Date(login.last_activity), { addSuffix: true })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-muted-foreground text-xs">
                                                {new Date(login.last_activity).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {login.ip_address ? (
                                                <span className="bg-muted text-foreground border-border rounded border px-1.5 py-0.5 font-mono text-xs">
                                                    {login.ip_address}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {login.device ? (
                                                <span className="text-muted-foreground">{login.device}</span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {login.browser ? (
                                                <span className="text-muted-foreground">{login.browser}</span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-8 text-center">
                            <Activity className="text-muted-foreground mx-auto h-12 w-12" />
                            <h3 className="text-foreground mt-2 text-sm font-medium">No recent activity</h3>
                            <p className="text-muted-foreground mt-1 text-sm">No user activity has been recorded yet.</p>
                        </div>
                    )}
                </div>

                {/* Pagination and Per Page Controls */}
                <div className="border-border bg-card mt-2 rounded-lg border">
                    <div className="flex items-center px-6 py-4">
                        {/* Per Page Control - Left */}
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm">Show:</span>
                            <Select value={recentLogins.per_page.toString()} onValueChange={handlePerPageChange}>
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-muted-foreground text-sm">per page</span>
                        </div>
                        {/* Spacer */}
                        <div className="flex-1" />
                        {/* Pagination - Right */}
                        {recentLogins.last_page > 1 && (
                            <div className="flex items-center">
                                <Pagination>
                                    <PaginationContent>
                                        {recentLogins.links.map((link, i) => {
                                            if (i === 0) {
                                                return (
                                                    <PaginationItem key="previous">
                                                        <PaginationPrevious
                                                            onClick={() => handlePageChange(link.url)}
                                                            className={
                                                                link.url
                                                                    ? 'hover:bg-muted dark:hover:bg-muted/50 cursor-pointer transition-colors'
                                                                    : 'cursor-not-allowed opacity-50'
                                                            }
                                                        />
                                                    </PaginationItem>
                                                );
                                            } else if (i === recentLogins.links.length - 1) {
                                                return (
                                                    <PaginationItem key="next">
                                                        <PaginationNext
                                                            onClick={() => handlePageChange(link.url)}
                                                            className={
                                                                link.url
                                                                    ? 'hover:bg-muted dark:hover:bg-muted/50 cursor-pointer transition-colors'
                                                                    : 'cursor-not-allowed opacity-50'
                                                            }
                                                        />
                                                    </PaginationItem>
                                                );
                                            } else if (link.label === '...') {
                                                return (
                                                    <PaginationItem key={`ellipsis-${i}`}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            } else {
                                                return (
                                                    <PaginationItem key={link.label}>
                                                        <PaginationLink
                                                            onClick={() => handlePageChange(link.url)}
                                                            isActive={link.active}
                                                            className="hover:bg-muted dark:hover:bg-muted/50 cursor-pointer transition-colors"
                                                        >
                                                            {link.label}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            }
                                        })}
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
