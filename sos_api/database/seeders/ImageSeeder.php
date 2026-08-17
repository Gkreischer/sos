<?php

namespace Database\Seeders;

use Carbon\Carbon;
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
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

    }
}
