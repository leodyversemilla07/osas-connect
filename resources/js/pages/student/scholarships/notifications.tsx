import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Bell,
    CheckCircle2,
    Calendar,
    DollarSign,
    FileText,
    AlertCircle,
    Clock,
    Trash2,
    Eye,
    RefreshCw
} from 'lucide-react';

interface NotificationData {
    application_id?: number;
    scholarship_name?: string;
    [key: string]: string | number | undefined;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
    updated_at: string;
    notifiable_type: string;
    notifiable_id: number;
}

interface NotificationsProps {
    notifications: Notification[];
    unreadCount: number;
}

interface BreadcrumbItem {
    title: string;
    href: string;
}

const getNotificationIcon = (type: string) => {
    const icons = {
        'application_status': <FileText className="h-5 w-5" />,
        'document_request': <FileText className="h-5 w-5" />,
        'interview_schedule': <Calendar className="h-5 w-5" />,
        'stipend_release': <DollarSign className="h-5 w-5" />,
        'renewal_reminder': <Clock className="h-5 w-5" />
    };
    return icons[type as keyof typeof icons] || <Bell className="h-5 w-5" />;
};

const getNotificationColor = (type: string) => {
    const colors = {
        'application_status': 'text-blue-600 bg-blue-100',
        'document_request': 'text-orange-600 bg-orange-100',
        'interview_schedule': 'text-purple-600 bg-purple-100',
        'stipend_release': 'text-green-600 bg-green-100',
        'renewal_reminder': 'text-yellow-600 bg-yellow-100'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-100';
};

const getNotificationTypeLabel = (type: string) => {
    const labels = {
        'application_status': 'Application Status',
        'document_request': 'Document Request',
        'interview_schedule': 'Interview Schedule',
        'stipend_release': 'Stipend Release',
        'renewal_reminder': 'Renewal Reminder'
    };
    return labels[type as keyof typeof labels] || 'Notification';
};

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
};

export default function Notifications({ notifications, unreadCount }: NotificationsProps) {
    const [selectedTab, setSelectedTab] = useState('all');
    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Notifications', href: '#' },
    ];

    const unreadNotifications = notifications.filter(n => !n.read_at);
    const readNotifications = notifications.filter(n => n.read_at);

    const getFilteredNotifications = () => {
        switch (selectedTab) {
            case 'unread':
                return unreadNotifications;
            case 'read':
                return readNotifications;
            default:
                return notifications;
        }
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await router.post(`/student/notifications/${notificationId}/mark-read`);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await router.post('/student/notifications/mark-all-read');
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const handleDeleteNotification = async (notificationId: number) => {
        try {
            await router.delete(`/student/notifications/${notificationId}`);
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await router.post('/student/notifications/delete-selected', {
                notifications: selectedNotifications
            });
            setSelectedNotifications([]);
        } catch (error) {
            console.error('Failed to delete selected notifications:', error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        // Mark as read if unread
        if (!notification.read_at) {
            handleMarkAsRead(notification.id);
        }

        // Navigate to related item if applicable
        if (notification.data?.application_id) {
            router.visit(`/student/applications/${notification.data.application_id}/status`);
        }
    };

    const toggleNotificationSelection = (notificationId: number) => {
        setSelectedNotifications(prev =>
            prev.includes(notificationId)
                ? prev.filter(id => id !== notificationId)
                : [...prev, notificationId]
        );
    };

    const filteredNotifications = getFilteredNotifications();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Notifications - MinSU OSAS Connect</title>
                <meta name="description" content="View and manage your scholarship notifications" />
            </Head>

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                            <Bell className="h-8 w-8" />
                            Notifications
                            {unreadCount > 0 && (
                                <Badge className="bg-red-600 text-white">
                                    {unreadCount}
                                </Badge>
                            )}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Stay updated with your scholarship applications and important announcements
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleMarkAllAsRead}
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Mark All Read
                            </Button>
                        )}

                        {selectedNotifications.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleDeleteSelected}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedNotifications.length})
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Notifications</p>
                                    <p className="text-2xl font-bold">{notifications.length}</p>
                                </div>
                                <Bell className="h-8 w-8 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Unread</p>
                                    <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Read</p>
                                    <p className="text-2xl font-bold text-green-600">{readNotifications.length}</p>
                                </div>
                                <CheckCircle2 className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notifications List */}
                <Card>
                    <CardHeader>
                        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                                <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        {filteredNotifications.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {selectedTab === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
                                </h3>
                                <p className="text-gray-600">
                                    {selectedTab === 'unread'
                                        ? "You're all caught up! No new notifications to read."
                                        : "You'll receive notifications here when there are updates about your scholarship applications."
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${!notification.read_at
                                            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                                            : 'bg-white hover:bg-gray-50'
                                            } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Checkbox */}
                                            <input
                                                type="checkbox"
                                                checked={selectedNotifications.includes(notification.id)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    toggleNotificationSelection(notification.id);
                                                }}
                                                className="mt-1"
                                            />

                                            {/* Icon */}
                                            <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-medium text-gray-900">
                                                                {notification.title}
                                                            </h4>
                                                            <Badge variant="outline" className="text-xs">
                                                                {getNotificationTypeLabel(notification.type)}
                                                            </Badge>
                                                            {!notification.read_at && (
                                                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatRelativeTime(notification.created_at)}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-1 ml-4">
                                                        {!notification.read_at && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMarkAsRead(notification.id);
                                                                }}
                                                                title="Mark as read"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteNotification(notification.id);
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                            title="Delete notification"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Additional data */}
                                                {notification.data?.scholarship_name && (
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        Related to: <span className="font-medium">{notification.data.scholarship_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Empty State for New Users */}
                {notifications.length === 0 && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            You don't have any notifications yet. Once you start applying for scholarships,
                            you'll receive updates about your applications here.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </AppLayout>
    );
}
