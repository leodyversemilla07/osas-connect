import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus, Filter } from "lucide-react";

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
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                            Events Management
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage scholarship-related events and activities
                        </p>
                    </div>
                    <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
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
                            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
                            <p className="text-gray-500 text-center mb-6">
                                Get started by creating your first event for scholarship activities.
                            </p>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Event
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <Card key={event.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{event.title}</CardTitle>
                                            <CardDescription className="mt-2">
                                                {event.description}
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-col space-y-1 ml-2">
                                            <Badge className={getStatusColor(event.status)}>
                                                {event.status}
                                            </Badge>
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
