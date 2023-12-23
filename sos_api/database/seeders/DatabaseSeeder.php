<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Part;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
        ]);

        // Chame o seeder de Part após CategorySeeder
        Part::factory()->count(50)->create();

        $this->call([
            EquipmentSeeder::class,
            TaskingSeeder::class,
            ImageSeeder::class,
            
        ]);
    }
}
