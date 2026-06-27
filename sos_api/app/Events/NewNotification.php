<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

class NewNotification implements ShouldBroadcast, ShouldDispatchAfterCommit
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public string $message
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('notifications')
        ];
    }

    public function broadcastAs(): string
    {
        return 'new.notification';
    }
}
