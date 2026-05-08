<?php

namespace Database\Seeders;

use App\Models\OrderStatus;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        OrderStatus::insert([
            ['name' => 'Pendente', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Em andamento', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Finalizado', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Entregue', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],      
            ['name' => 'Cancelado', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
        ]);
    }
}
