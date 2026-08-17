<?php

namespace Database\Seeders;

use App\Models\UserType;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            'admin' => 'Administrador',
            'customer' => 'Cliente',
            'technician' => 'Técnico',
            'attendant' => 'Atendente',
            'contract' => 'Contrato',
        ];

        foreach ($types as $roleName => $typeName) {

            $role = Role::firstOrCreate([
                'name' => $roleName,
                'guard_name' => 'web',
            ]);

            UserType::updateOrCreate(
                [
                    'name' => $typeName,
                ],
                [
                    'role_id' => $role->id,
                ]
            );
        }
    }
}
