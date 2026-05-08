<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\Order;
use Illuminate\Database\Seeder;
use App\Models\Part;
use App\Models\User;

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
        
        Category::factory()->count(10)->create();
        User::factory()->count(20)->create();

        Equipment::factory()->count(50)->create();

        // Chame o seeder de Part após CategorySeeder
        Part::factory()->count(50)->create();

        $this->call([
            EquipmentSeeder::class,
            ImageSeeder::class,
            OrderStatusSeeder::class,
            OrderSeeder::class,
            OrderPartSeeder::class,
        ]);

        
        Order::factory()->count(20)->create();

        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);
    }
}
