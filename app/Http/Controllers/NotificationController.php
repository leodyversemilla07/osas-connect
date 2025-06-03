<?php

namespace App\Http\Controllers;

use App\Models\ScholarshipNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of the user's notifications.
     */
    public function index(Request $request)
    {
        $query = ScholarshipNotification::where('user_id', Auth::id())
            ->latest();        // Filter by read status
        if ($request->has('unread_only') && $request->unread_only) {
            $query->whereNull('read_at');
        }

        // Alternative filter parameter
        if ($request->has('filter') && $request->filter === 'unread') {
            $query->whereNull('read_at');
        }

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        $notifications = $query->paginate(20);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => ScholarshipNotification::where('user_id', Auth::id())
                ->whereNull('read_at')
                ->count(),
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(ScholarshipNotification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            abort(403);
        }

        $notification->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        ScholarshipNotification::where('user_id', Auth::id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Delete a notification.
     */
    public function destroy(ScholarshipNotification $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            abort(403);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }

    /**
     * Bulk delete notifications.
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'notification_ids' => 'required|array',
            'notification_ids.*' => 'exists:scholarship_notifications,id',
        ]);

        ScholarshipNotification::whereIn('id', $validated['notification_ids'])
            ->where('user_id', Auth::id())
            ->delete();

        return response()->json(['message' => 'Notifications deleted']);
    }

    /**
     * Get unread notification count.
     */
    public function getUnreadCount()
    {
        $count = ScholarshipNotification::where('user_id', Auth::id())
            ->whereNull('read_at')
            ->count();

        return response()->json(['unread_count' => $count]);
    }
}
