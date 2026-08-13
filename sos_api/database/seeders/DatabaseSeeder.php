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
use App\Models\UserType;
use App\Enums\UserTypeEnum;

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

        $customers = User::factory()
            ->count(60)
            ->create([
                'type_id' => UserTypeEnum::CLIENT->value
            ]);

        $attendants = User::factory()
            ->count(5)
            ->create([
                'type_id' => UserTypeEnum::ATTENDANT->value
            ]);

        $technicians = User::factory()
            ->count(5)
            ->create([
                'type_id' => UserTypeEnum::TECHNICIAN->value
            ]);
        Category::factory()->count(20)->create();

        $customers->each(function ($customer) {
            Equipment::factory()
                ->count(rand(1, 5))
                ->create([
                    'user_id' => $customer->id,
                ]);
        });

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
