<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderPartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('orders_parts')->insert([
            'order_id' => 1,
            'part_id' => 1,
            'quantity' => 1.00,
            'price' => 100.00,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
