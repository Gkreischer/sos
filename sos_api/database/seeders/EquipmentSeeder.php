<?php

namespace Database\Seeders;

use App\Models\Equipment;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criar um equipamento
        $equipment = Equipment::create([
            'name' => 'Notebook',
            'category_id' => 1,
            'user_id' => 1,
            'description' => 'Notebook',
        ]);

    }
}
