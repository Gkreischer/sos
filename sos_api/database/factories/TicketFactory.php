<?php

namespace Database\Factories;

use App\Models\OrderStatus;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

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

        $user = User::has('equipments')
            ->inRandomOrder()
            ->first();
        $user->load('equipments');

        return [
            'status_id' => OrderStatus::all()->random()->id,
            'user_id' => $user->id,
            'equipment_id' => $user->equipments()->inRandomOrder()->first()->id,
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->text(50),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
