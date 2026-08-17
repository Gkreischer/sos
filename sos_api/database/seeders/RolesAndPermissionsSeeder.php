<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]
            ->forgetCachedPermissions();

        $permissions = [
            'create orders',
            'edit orders',
            'delete orders',
            'view orders',
            'view users',
            'edit users',
            'delete users',
            'view equipments',
            'edit equipments',
            'delete equipments',
            'view parts',
            'edit parts',
            'delete parts',
            'view categories',
            'edit categories',
            'delete categories',
            'view settings',
            'edit settings',
            'delete settings',
            'view metrics',
            'edit metrics',
            'delete metrics',
            'view posts',
            'edit posts',
            'delete posts',
            'view rooms',
            'edit rooms',
            'delete rooms',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $technician = Role::firstOrCreate([
            'name' => 'technician',
            'guard_name' => 'web',
        ]);

        $customer = Role::firstOrCreate([
            'name' => 'customer',
            'guard_name' => 'web',
        ]);

        $attendant = Role::firstOrCreate([
            'name' => 'attendant',
            'guard_name' => 'web',
        ]);

        $admin->syncPermissions(Permission::all());

        $technician->syncPermissions([
            'view orders',
            'edit orders',
            'delete orders',
            'create orders',
            'view users',
            'edit users',
            'view equipments',
            'edit equipments',
            'view parts',
            'edit parts',
            'view categories',
            'edit categories',
            'view settings',
            'edit settings',
            'view metrics',
            'edit metrics',
            'view posts',
            'edit posts',
            'view rooms',
            'edit rooms',
        ]);

        $customer->syncPermissions([
            'view orders',
            'view parts',
        ]);

        $attendant->syncPermissions([
            'view orders',
            'view users',
            'view equipments',
            'view parts',
            'view categories',
            'edit users',
            'edit equipments',
            'edit parts',
            'edit categories',
            'edit settings',
            'delete users',
            'delete equipments',
            'delete parts',
            'delete categories',
            'view posts',
            'edit posts',
        ]);

        app()[PermissionRegistrar::class]
            ->forgetCachedPermissions();
    }
}
