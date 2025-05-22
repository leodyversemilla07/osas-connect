import { router, Link } from '@inertiajs/react';
import {
    TrashIcon, UserCircle, Building2, GraduationCap, Shield,
    Mail, Phone, MapPin, User2,
    BookOpen, School, Award,
    LucideIcon, Pencil as PencilIcon
} from 'lucide-react';
import { type User, type StudentProfile } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';

interface UserWithProfile extends User {
    studentProfile?: StudentProfile;
    street?: string;
    barangay?: string;
    city?: string;
    civil_status?: string;
    sex?: string;
    major?: string;
    mobile_number?: string;
    year_level?: string;
    course?: string;
    scholarships?: string;
    student_id?: string;
    is_active?: boolean;
    avatar: string | null | undefined;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    email: string;
}

interface UserProfileProps {
    user: UserWithProfile;
}

function ProfileHeader({ user }: { user: UserWithProfile }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const deleteRoute = user.role === 'student' ? 'admin.students.destroy' : 'admin.staff.destroy';
            router.delete(route(deleteRoute, user.id));
        }
    };

    // Determine the edit route based on user role
    const getEditRoute = () => {
        // Admin users cannot be edited
        if (user.role === 'admin') {
            return null;
        }

        // Use different routes for student and staff
        return user.role === 'student' ? 'admin.students.edit' : 'admin.staff.edit';
    };

    const editRoute = getEditRoute();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-primary">User Profile</h2>
                    <p className="text-lg text-muted-foreground mt-2">View and manage user information</p>
                </div>
                <div className="flex gap-3">
                    {editRoute && (
                        <Button variant="outline" asChild className="hover:bg-primary/5">
                            <Link 
                                href={route(editRoute, user.id)} 
                                className="flex items-center gap-2"
                            >
                                <PencilIcon className="h-4 w-4" />
                                Edit Profile
                            </Link>
                        </Button>
                    )}
                    {user.role !== 'admin' && (
                        <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                            <TrashIcon className="h-4 w-4" />
                            Delete User
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function UserAvatar({ user }: { user: User }) {
    const getRoleIcon = () => {
        switch (user.role) {
            case 'student':
                return <GraduationCap className="h-4 w-4" />;
            case 'osas_staff':
                return <Building2 className="h-4 w-4" />;
            case 'admin':
                return <Shield className="h-4 w-4" />;
            default:
                return <UserCircle className="h-4 w-4" />;
        }
    };

    const getRoleBadgeVariant = () => {
        switch (user.role) {
            case 'student':
                return 'secondary' as const;
            case 'osas_staff':
                return 'default' as const;
            case 'admin':
                return 'default' as const;
            default:
                return 'outline' as const;
        }
    };

    return (
        <div className="relative flex items-center gap-6 mb-6">
            <div className="relative">
                <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-offset-background transition-all hover:ring-4">
                    <AvatarImage src={user.avatar?.toString() || ''} alt={`${user.first_name} ${user.last_name}`} />
                    <AvatarFallback className="text-xl">
                        {user.first_name[0]}
                        {user.last_name[0]}
                    </AvatarFallback>
                </Avatar>
                <span className={cn(
                    "absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background",
                    user.is_active ? "bg-green-500" : "bg-gray-500"
                )} />
            </div>
            <div>
                <h3 className="text-2xl font-semibold">
                    {user.first_name} {user.middle_name} {user.last_name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                    {getRoleIcon()}
                    <Badge variant={getRoleBadgeVariant()}>
                        {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={cn(
                        user.is_active ? "text-green-500" : "text-gray-500"
                    )}>
                        {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: React.ReactNode }) {
    return (
        <div className="grid grid-cols-3 items-center group py-3 hover:bg-muted/50 rounded-lg px-3 transition-colors">
            <span className="font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
            </span>
            <div className="col-span-2 text-primary">{value}</div>
        </div>
    );
}

function PersonalInfoCard({ user }: { user: UserWithProfile }) {
    return (
        <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="space-y-1.5">
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <User2 className="h-6 w-6 text-primary" />
                    Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <UserAvatar user={user} />
                <div className="space-y-1">
                    <InfoItem icon={Mail} label="Email" value={user.email} />
                    <Separator className="my-3" />
                    <InfoItem
                        icon={Phone}
                        label="Contact"
                        value={user.mobile_number || 'Not provided'}
                    />
                    <Separator className="my-3" />
                    <InfoItem
                        icon={MapPin}
                        label="Address"
                        value={[user.street, user.barangay, user.city].filter(Boolean).join(', ') || 'Not provided'}
                    />
                    <Separator className="my-3" />
                    <InfoItem
                        icon={User2}
                        label="Details"
                        value={
                            <div className="space-y-1">
                                <p>Sex: {user.sex || 'Not provided'}</p>
                                <p>Civil Status: {user.civil_status || 'Not provided'}</p>
                            </div>
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function AcademicInfoCard({ user }: { user: UserWithProfile }) {
    if (!user.studentProfile) return null;

    return (
        <Card className="border-2 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="space-y-1.5">
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Academic Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    <InfoItem
                        icon={School}
                        label="Student ID"
                        value={<span className="font-medium">{user.student_id}</span>}
                    />
                    <Separator className="my-3" />
                    <InfoItem
                        icon={BookOpen}
                        label="Course"
                        value={
                            <div className="space-y-1">
                                <p className="font-medium">{user.course}</p>
                                {user.major && (
                                    <p className="text-sm text-muted-foreground">
                                        Major in {user.major}
                                    </p>
                                )}
                            </div>
                        }
                    />
                    <Separator className="my-3" />
                    <InfoItem
                        icon={GraduationCap}
                        label="Year Level"
                        value={<span className="font-medium">{user.year_level}</span>}
                    />
                    {user.scholarships && (
                        <>
                            <Separator className="my-3" />
                            <InfoItem
                                icon={Award}
                                label="Scholarships"
                                value={<span className="font-medium">{user.scholarships}</span>}
                            />
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function UserProfile({ user }: UserProfileProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: user.role === 'student' ? 'Students' : 'Staff',
            href: user.role === 'student' ? '/admin/students' : '/admin/staff',
        },
        {
            title: 'User Profile',
            href: `${user.role === 'student' ? '/admin/students' : '/admin/staff'}/${user.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="container mx-auto py-12 max-w-6xl px-4">
                <ProfileHeader user={user} />
                <div className="grid gap-8 lg:grid-cols-2 mt-8">
                    <PersonalInfoCard user={user} />
                    <AcademicInfoCard user={user} />
                </div>
            </div>
        </AppLayout>
    );
}