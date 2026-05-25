<?php

namespace Database\Factories;

use App\Models\Order;
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
            'user_id' => $this->faker->numberBetween(1, 10),
            'status_id' => $this->faker->numberBetween(1, 4),
            'description' => $this->faker->sentence(),
            'obs' => $this->faker->sentence(),
            'technician_id' => $this->faker->numberBetween(1, 30),
            'equipment_id' => $this->faker->numberBetween(1, 50),
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
