import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Calendar, Filter, MapPin, Plus, Users } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    type: string;
    attendees_count: number;
    status: string;
}

interface EventsPageProps {
    events: Event[];
}

export default function Events({ events = [] }: EventsPageProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'ongoing':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'scholarship':
                return 'bg-purple-100 text-purple-800';
            case 'orientation':
                return 'bg-yellow-100 text-yellow-800';
            case 'workshop':
                return 'bg-indigo-100 text-indigo-800';
            case 'seminar':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <Head title="Events Management" />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 md:flex md:items-center md:justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl leading-7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Events Management</h2>
                        <p className="mt-1 text-sm text-gray-500">Manage scholarship-related events and activities</p>
                    </div>
                    <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                        <Button size="sm">
                            <Plus className="mr-2 h-4 w-4" />
                            New Event
                        </Button>
                    </div>
                </div>

                {/* Events Grid */}
                {events.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Calendar className="mb-4 h-12 w-12 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No events scheduled</h3>
                            <p className="mb-6 text-center text-gray-500">Get started by creating your first event for scholarship activities.</p>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Event
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Card key={event.id} className="transition-shadow hover:shadow-lg">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{event.title}</CardTitle>
                                            <CardDescription className="mt-2">{event.description}</CardDescription>
                                        </div>
                                        <div className="ml-2 flex flex-col space-y-1">
                                            <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                                            <Badge variant="outline" className={getTypeColor(event.type)}>
                                                {event.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {event.date} at {event.time}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            {event.location}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="mr-2 h-4 w-4" />
                                            {event.attendees_count} attendees
                                        </div>
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            View Details
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1">
                                            Edit
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
