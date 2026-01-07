import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Clock, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/student/dashboard' },
    { title: 'Student Assistantship', href: '/student/assistantship' },
    { title: 'Log Hours', href: '#' },
];

interface Assignment {
    id: number;
    office: {
        name: string;
    };
    hourly_rate: number;
}

interface Props {
    assignment: Assignment;
}

export default function LogHours({ assignment }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        work_date: new Date().toISOString().split('T')[0],
        time_in: '',
        time_out: '',
        tasks_performed: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('student.assistantship.log-hours.store'));
    };

    // Calculate estimated hours
    const calculateHours = () => {
        if (!data.time_in || !data.time_out) return 0;
        const [inH, inM] = data.time_in.split(':').map(Number);
        const [outH, outM] = data.time_out.split(':').map(Number);
        const inMinutes = inH * 60 + inM;
        const outMinutes = outH * 60 + outM;
        const diff = outMinutes - inMinutes;
        return diff > 0 ? (diff / 60).toFixed(2) : 0;
    };

    const estimatedHours = calculateHours();
    const estimatedEarnings = Number(estimatedHours) * assignment.hourly_rate;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Log Work Hours" />

            <div className="flex h-full flex-1 flex-col space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="border-b pb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('student.assistantship.dashboard')}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl dark:text-gray-100">
                                Log Work Hours
                            </h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">
                                Record your work hours at {assignment.office.name}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Form */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Time Entry
                            </CardTitle>
                            <CardDescription>
                                Enter the date and times you worked. All entries require supervisor approval.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="work_date">Work Date</Label>
                                        <Input
                                            id="work_date"
                                            type="date"
                                            value={data.work_date}
                                            onChange={(e) => setData('work_date', e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            className="mt-1"
                                        />
                                        {errors.work_date && (
                                            <p className="mt-1 text-sm text-red-500">{errors.work_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="time_in">Time In</Label>
                                        <Input
                                            id="time_in"
                                            type="time"
                                            value={data.time_in}
                                            onChange={(e) => setData('time_in', e.target.value)}
                                            className="mt-1"
                                        />
                                        {errors.time_in && (
                                            <p className="mt-1 text-sm text-red-500">{errors.time_in}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="time_out">Time Out</Label>
                                        <Input
                                            id="time_out"
                                            type="time"
                                            value={data.time_out}
                                            onChange={(e) => setData('time_out', e.target.value)}
                                            className="mt-1"
                                        />
                                        {errors.time_out && (
                                            <p className="mt-1 text-sm text-red-500">{errors.time_out}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="tasks_performed">Tasks Performed</Label>
                                    <Textarea
                                        id="tasks_performed"
                                        value={data.tasks_performed}
                                        onChange={(e) => setData('tasks_performed', e.target.value)}
                                        placeholder="Describe the tasks you completed during this work period..."
                                        rows={4}
                                        className="mt-1"
                                    />
                                    {errors.tasks_performed && (
                                        <p className="mt-1 text-sm text-red-500">{errors.tasks_performed}</p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Submit Hours
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('student.assistantship.dashboard')}>Cancel</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Summary Card */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Entry Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                    <p className="text-sm text-gray-500">Estimated Hours</p>
                                    <p className="mt-1 text-2xl font-bold">
                                        {estimatedHours}h
                                    </p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                                    <p className="text-sm text-gray-500">Estimated Earnings</p>
                                    <p className="mt-1 text-2xl font-bold text-green-600">
                                        ₱{estimatedEarnings.toFixed(2)}
                                    </p>
                                </div>
                                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                    <p className="text-sm text-blue-600 dark:text-blue-400">
                                        Rate: ₱{assignment.hourly_rate}/hour
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li>• Log hours on the same day you work</li>
                                    <li>• Be accurate with your time entries</li>
                                    <li>• Describe your tasks clearly</li>
                                    <li>• Hours require supervisor approval</li>
                                    <li>• You can only log one entry per day</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
