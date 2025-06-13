import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { DataTable } from '@/components/osas-student-management/data-table';
import { columns } from '@/components/osas-student-management/columns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard', href: route('osas.dashboard')
    },
    {
        title: 'Student Records', href: route('osas.students')
    },
];

interface Props {
    students: {
        data: User[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    filters?: {
        search?: string;
        year_level?: string;
        course?: string;
    };
}

export default function StudentRecords({ students }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Student Records | OSAS Connect</title>
                <meta name="description" content="View and manage student information" />
            </Head>
            <div className="flex h-full flex-1 flex-col space-y-6 p-6">
                {/* Header Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-3xl">Student Records</CardTitle>
                                <CardDescription className="text-base mt-2">
                                    View and manage student information and academic records
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Student Management */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    All Students
                                </CardTitle>
                                <CardDescription>
                                    Complete list of registered students • {students.data.length} of {students.total} total
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={students.data}
                            searchPlaceholder="Search by student name, ID, or email..."
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}