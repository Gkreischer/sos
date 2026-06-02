<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\Order;
use Illuminate\Database\Seeder;
use App\Models\Part;
use App\Models\User;
use App\Models\Post;

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
            UserTypeSeeder::class,
        ]);

        Category::factory()->count(40)->create();
        User::factory()->count(200)->create();

        Equipment::factory()->count(200)->create();

        Part::factory()->count(100)->create();

        $this->call([
            EquipmentSeeder::class,
            ImageSeeder::class,
            OrderStatusSeeder::class,
            OrderSeeder::class,
            OrderPartSeeder::class,

        ]);


        Order::factory()->count(200)->create();

        $this->call([
            RolesAndPermissionsSeeder::class,
            BusinessInfoSeeder::class,
            UserSeeder::class,
        ]);

        Post::factory()->count(100)->create();
    }
}
