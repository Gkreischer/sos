<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Part;
use App\Models\Equipment;

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
