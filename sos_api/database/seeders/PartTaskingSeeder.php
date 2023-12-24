<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartTaskingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('part_tasking')->insert([
            'tasking_id' => 1,
            'part_id' => 1,
            'quantity' => 1,
            'price' => 100.00
        ]);
    }
}
