<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        DB::table('orders')->insert([
            'user_id' => 1,
            'title' => 'computador nao liga',
            'description' => 'test',
            'equipment_id' => 1,
            'obs' => 'observation',
            'total_price' => 100.00,
            'parts_price' => 100.00,
            'service_price' => 100.00,
            'technician_id' => 1,
            'status_id' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
    }
}
