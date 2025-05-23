import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';

interface Props {
    students: {
        data: User[];
        links: { url: string | null; label: string }[];
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        course: string;
        year_level: string;
    };
    courses: string[];
    yearLevels: string[];
}

export default function StudentRecords({ students, filters, courses, yearLevels }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('osas.dashboard') },
        { title: 'Student Records', href: route('osas.students') },
    ];

    const { data, setData, get } = useForm({
        search: filters.search || '',
        course: filters.course || '',
        year_level: filters.year_level || '',
    });

    const search = () => {
        get(route('osas.students'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Student Records | OSAS Connect</title>
                <meta name="description" content="View and manage student information" />
            </Head>

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header Section */}

                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Student Records</h2>
                        <p className="text-muted-foreground">View and manage student information</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or student ID..."
                            value={data.search}
                            className="pl-9"
                            onChange={(e) => {
                                setData('search', e.target.value);
                                search();
                            }}
                        />
                    </div>
                    <Select
                        value={data.course}
                        onValueChange={(value) => {
                            setData('course', value);
                            search();
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map((course) => (
                                <SelectItem key={course} value={course}>
                                    {course}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={data.year_level}
                        onValueChange={(value) => {
                            setData('year_level', value);
                            search();
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by year level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Year Levels</SelectItem>
                            {yearLevels.map((yearLevel) => (
                                <SelectItem key={yearLevel} value={yearLevel}>
                                    {yearLevel}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table Section */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Year Level</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No students found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.data.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.student_profile?.student_id}</TableCell>
                                        <TableCell className="font-medium">
                                            {student.first_name} {student.middle_name && `${student.middle_name} `}
                                            {student.last_name}
                                        </TableCell>
                                        <TableCell>{student.student_profile?.course}</TableCell>
                                        <TableCell>{student.student_profile?.year_level}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={route('osas.students.details', { id: student.id })}>
                                                    View Details
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination info */}
                <div className="text-sm text-muted-foreground">
                    {students.total > 0 ? (
                        `Showing ${students.from} to ${students.to} of ${students.total} students`
                    ) : (
                        'No students found'
                    )}
                </div>
            </div>
        </AppLayout>
    );
}