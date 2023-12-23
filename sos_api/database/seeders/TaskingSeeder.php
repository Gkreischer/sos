<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('taskings')->insert([
            [
                'user_id' => 1,
                'category_id' => 1,
                'equipment_id' => 1,
                'comment' => 'test',
                'obs' => null,
                'status' => 0,
                'total_price' => 100.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
