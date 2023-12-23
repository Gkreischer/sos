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
            'description' => 'Notebook',
            'image' => 'https://photos.enjoei.com.br/venda-macbook-air-77657590/800x800/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8yNzk1OTQxMy83ZWRlZDM3YWUyMWVkNmZkZWY3YjgyZjI5NTZjNWM1Yi5qcGc',
        ]);

        // Obter algumas partes aleatórias
        $parts = Part::inRandomOrder()->limit(rand(1, 5))->get();

        // Associar as partes ao equipamento
        $equipment->parts()->attach($parts);
    }
}
