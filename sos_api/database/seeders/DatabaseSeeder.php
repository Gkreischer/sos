<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\Order;
use Illuminate\Database\Seeder;
use App\Models\Part;
use App\Models\User;
use App\Models\Post;
use App\Models\Room;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
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
            BusinessInfoSeeder::class,
            UserSeeder::class,
        ]);

        Post::factory()->count(100)->create();
        Room::factory()->count(20)->create();
    }
}
