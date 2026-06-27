<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'created_by' => $this->faker->numberBetween(1, 100),
            'private' => $this->faker->boolean(50),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
