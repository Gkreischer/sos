<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('images')->insert([
            [
                'name' => 'test',
                'path' => 'https://w0.peakpx.com/wallpaper/106/535/HD-wallpaper-pc-gamer.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'test',
                'path' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyX7-jVcQX29dow6EIxZeZupwBcc36ZLUSwg&usqp=CAU',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        DB::table('image_part')->insert([
            [
                'image_id' => 1,
                'part_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('equipment_image')->insert([
            [
                'image_id' => 2,
                'equipment_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

    }
}
