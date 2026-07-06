<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function created(User $user): void
    {
        $this->syncRole($user);
    }

    public function updated(User $user): void
    {
        if ($user->wasChanged('type_id')) {
            $this->syncRole($user);
        }
    }

    private function syncRole(User $user): void
    {
        $role = $user->type?->role;

        if ($role) {
            $user->syncRoles($role);
        }
    }
}
