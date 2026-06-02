<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Equipment;
use App\Models\OrderStatus;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'user_id' => User::all()->where('type_id', 2)->random()->id,
            'status_id' => OrderStatus::all()->random()->id,
            'description' => $this->faker->sentence(),
            'obs' => $this->faker->sentence(),
            'technician_id' => User::all()->where('type_id', 3)->random()->id,
            'equipment_id' => Equipment::all()->random()->id,
            'diagnostic' => $this->faker->sentence(),
            'service_description' => $this->faker->sentence(),
            'service_price' => $this->faker->numberBetween(1, 1000),
            'parts_price' => $this->faker->numberBetween(1, 1000),
            'total_price' => $this->faker->numberBetween(1, 1000),
            'discount' => $this->faker->numberBetween(1, 1000),
            'created_at' => fake()->dateTimeBetween('-3 year', 'now'),
            'updated_at' => Carbon::now()
        ];
    }
}
