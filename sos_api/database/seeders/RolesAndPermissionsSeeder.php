<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache
        app()[PermissionRegistrar::class]
            ->forgetCachedPermissions();

        // Permissions
        Permission::create(['name' => 'create orders']);
        Permission::create(['name' => 'edit orders']);
        Permission::create(['name' => 'delete orders']);
        Permission::create(['name' => 'view orders']);
        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);
        Permission::create(['name' => 'view equipments']);
        Permission::create(['name' => 'edit equipments']);
        Permission::create(['name' => 'delete equipments']);
        Permission::create(['name' => 'view parts']);
        Permission::create(['name' => 'edit parts']);
        Permission::create(['name' => 'delete parts']);
        Permission::create(['name' => 'view categories']);
        Permission::create(['name' => 'edit categories']);
        Permission::create(['name' => 'delete categories']);
        Permission::create(['name' => 'view settings']);
        Permission::create(['name' => 'edit settings']);
        Permission::create(['name' => 'delete settings']);
        Permission::create(['name' => 'view reports']);
        Permission::create(['name' => 'edit reports']);
        Permission::create(['name' => 'delete reports']);
        Permission::create(['name' => 'view posts']);
        Permission::create(['name' => 'edit posts']);
        Permission::create(['name' => 'delete posts']);

        // Roles
        $admin = Role::create(['name' => 'admin']);
        $technician = Role::create(['name' => 'technician']);
        $customer = Role::create(['name' => 'customer']);
        $attendant = Role::create(['name' => 'attendant']);

        // Vincular permissões
        $admin->givePermissionTo(Permission::all());

        $technician->givePermissionTo([
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

        ]);

        $customer->givePermissionTo([
            'view orders',
        ]);

        $attendant->givePermissionTo([
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
            'delete posts',
        ]);
    }
}
