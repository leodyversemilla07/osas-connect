<?php

namespace App\Events;

use App\Models\ScholarshipApplication;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ScholarshipApplicationStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public ScholarshipApplication $application;
    public string $previousStatus;

    /**
     * Create a new event instance.
     */
    public function __construct(ScholarshipApplication $application, string $previousStatus)
    {
        $this->application = $application;
        $this->previousStatus = $previousStatus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
