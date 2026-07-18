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
use App\Models\Ticket;

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

        User::factory()->count(100)->create();
        Category::factory()->count(20)->create();
        Equipment::factory()->count(100)->create();

        Part::factory()->count(50)->create();

        $this->call([
            OrderStatusSeeder::class,
        ]);


        Order::factory()->count(100)->create();

        $this->call([
            BusinessInfoSeeder::class,
            UserSeeder::class,
        ]);

        Post::factory()->count(50)->create();
        Room::factory()->count(20)->create();
        Ticket::factory()->count(40)->create();
    }
}
