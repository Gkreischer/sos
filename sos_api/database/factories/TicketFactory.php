<?php

namespace Database\Factories;

use App\Models\OrderStatus;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::all()->random()->id,
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->text(50),
            'status_id' => OrderStatus::all()->random()->id,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
