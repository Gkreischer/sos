<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserType;

class UserTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'admin' => 'Administrador',
            'client' => 'Cliente',
            'technician' => 'Técnico',
            'attendant' => 'Atendente'
        ];

        foreach ($types as $key => $value) {
            UserType::create([
                'name' => $value
            ]);
        }
    }
}
