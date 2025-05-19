import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Calendar as CalendarIcon, PlusCircle, Edit, Trash, Users, Clock, MapPin, Info } from 'lucide-react';

// Import Shadcn UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/osas-staff/dashboard',
    },
    {
        title: 'Events',
        href: '/osas-staff/events',
    },
];

// Sample event data
const upcomingEvents = [
    {
        id: 1,
        title: 'Student Leadership Workshop',
        date: '2025-04-20',
        time: '1:00 PM - 5:00 PM',
        location: 'Multi-purpose Hall',
        description: 'Workshop focused on developing leadership skills for student organization officers.',
        attendees: 45,
        organizer: 'Student Affairs Office',
        status: 'scheduled'
    },
    {
        id: 2,
        title: 'Career Fair 2025',
        date: '2025-04-25',
        time: '9:00 AM - 4:00 PM',
        location: 'University Gymnasium',
        description: 'Annual career fair featuring over 30 potential employers from various industries.',
        attendees: 200,
        organizer: 'Career Development Center',
        status: 'scheduled'
    },
    {
        id: 3,
        title: 'Scholarship Grant Orientation',
        date: '2025-05-05',
        time: '10:00 AM - 12:00 PM',
        location: 'Auditorium',
        description: 'Orientation for new scholarship recipients covering policies and requirements.',
        attendees: 75,
        organizer: 'Scholarship Office',
        status: 'scheduled'
    }
];

const pastEvents = [
    {
        id: 4,
        title: 'Cultural Awareness Day',
        date: '2025-03-15',
        time: '10:00 AM - 6:00 PM',
        location: 'University Field',
        description: 'A celebration of diverse cultures featuring performances, food, and activities.',
        attendees: 350,
        organizer: 'Cultural Affairs Committee',
        status: 'completed'
    },
    {
        id: 5,
        title: 'Academic Excellence Awards',
        date: '2025-03-28',
        time: '2:00 PM - 4:00 PM',
        location: 'University Theater',
        description: 'Annual ceremony recognizing students who have achieved academic excellence.',
        attendees: 120,
        organizer: 'Academic Affairs Office',
        status: 'completed'
    }
];

const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    ongoing: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
};

export default function EventsPage() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="OSAS Staff - Events Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header with action button */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Events Management</h1>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Create New Event</DialogTitle>
                                <DialogDescription>
                                    Enter the details for the new event. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Event Title</Label>
                                    <Input id="title" placeholder="Enter event title" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" type="date" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="time">Time</Label>
                                        <Input id="time" placeholder="e.g. 1:00 PM - 4:00 PM" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" placeholder="Enter event location" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="organizer">Organizer</Label>
                                    <Input id="organizer" placeholder="Enter organizing office/committee" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                            <SelectItem value="ongoing">Ongoing</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" placeholder="Provide details about the event" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline">Cancel</Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700">Save Event</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Events Management Interface */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Left Column - Event Calendar */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                Event Calendar
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Calendar className="w-full" />
                            <div className="mt-4">
                                <h4 className="font-medium text-sm mb-2">Upcoming Dates:</h4>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto p-1">
                                    {upcomingEvents.map(event => (
                                        <div key={event.id} className="p-2 border rounded-md text-sm hover:bg-muted/50 cursor-pointer">
                                            <p className="font-medium">{event.title}</p>
                                            <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column - Event List Tabs */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Event Management</CardTitle>
                            <CardDescription>
                                Create, manage, and track university events
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="upcoming" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                                    <TabsTrigger value="past">Past Events</TabsTrigger>
                                </TabsList>

                                <TabsContent value="upcoming">
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead>Event</TableHead>
                                                    <TableHead>Date & Time</TableHead>
                                                    <TableHead>Location</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {upcomingEvents.map((event) => (
                                                    <TableRow key={event.id}>
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium">{event.title}</p>
                                                                <p className="text-xs text-muted-foreground">{event.organizer}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                                                                <span className="text-xs text-muted-foreground">{event.time}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{event.location}</TableCell>
                                                        <TableCell>
                                                            <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                                                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end items-center gap-2">
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">View details</span>
                                                                    <Info className="h-4 w-4" />
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Edit</span>
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                                                                    <span className="sr-only">Delete</span>
                                                                    <Trash className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>

                                <TabsContent value="past">
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    <TableHead>Event</TableHead>
                                                    <TableHead>Date & Time</TableHead>
                                                    <TableHead>Location</TableHead>
                                                    <TableHead>Attendees</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pastEvents.map((event) => (
                                                    <TableRow key={event.id}>
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium">{event.title}</p>
                                                                <p className="text-xs text-muted-foreground">{event.organizer}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                                                                <span className="text-xs text-muted-foreground">{event.time}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{event.location}</TableCell>
                                                        <TableCell>{event.attendees}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end items-center gap-2">
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">View details</span>
                                                                    <Info className="h-4 w-4" />
                                                                </Button>
                                                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Edit</span>
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Event Details Section */}
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                Event Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <h2 className="text-xl font-semibold">{upcomingEvents[0].title}</h2>
                                    <Badge className={statusColors[upcomingEvents[0].status as keyof typeof statusColors]}>
                                        {upcomingEvents[0].status.charAt(0).toUpperCase() + upcomingEvents[0].status.slice(1)}
                                    </Badge>
                                </div>

                                <div className="space-y-3 mt-4">
                                    <div className="flex gap-2">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Date & Time</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(upcomingEvents[0].date).toLocaleDateString()} | {upcomingEvents[0].time}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Location</p>
                                            <p className="text-sm text-muted-foreground">{upcomingEvents[0].location}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Expected Attendees</p>
                                            <p className="text-sm text-muted-foreground">{upcomingEvents[0].attendees} people</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-sm font-medium mb-1">Description</h3>
                                    <p className="text-sm text-muted-foreground">{upcomingEvents[0].description}</p>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" size="sm">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Event
                                    </Button>
                                    <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                        <Users className="mr-2 h-4 w-4" />
                                        Manage Attendees
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                Event Organizers
                            </CardTitle>
                            <CardDescription>Staff responsible for organizing this event</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium">
                                            MD
                                        </div>
                                        <div>
                                            <p className="font-medium">Maria Dela Cruz</p>
                                            <p className="text-xs text-muted-foreground">Event Coordinator</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Contact</Button>
                                </div>

                                <div className="flex items-center justify-between border-b pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                                            JS
                                        </div>
                                        <div>
                                            <p className="font-medium">Juan Santos</p>
                                            <p className="text-xs text-muted-foreground">Logistics Officer</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Contact</Button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                                            AR
                                        </div>
                                        <div>
                                            <p className="font-medium">Ana Reyes</p>
                                            <p className="text-xs text-muted-foreground">Faculty Advisor</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Contact</Button>
                                </div>

                                <Button variant="outline" className="w-full mt-4">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Organizer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}