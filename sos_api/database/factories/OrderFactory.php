<?php

namespace Database\Factories;

use App\Enums\UserTypeEnum;
use App\Models\Equipment;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
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
        $customer = User::where('type_id', UserTypeEnum::CLIENT->value)
            ->has('equipments') // ou has('equipments')
            ->inRandomOrder()
            ->first();

        return [
            'title' => $this->faker->sentence(),
            'uid' => $this->faker->uuid(),
            'description' => $this->faker->sentence(),
            'obs' => $this->faker->sentence(),
            'user_id' => $customer->id,
            'equipment_id' => Equipment::where('user_id', $customer->id)
                ->inRandomOrder()
                ->value('id'),
            'technician_id' => User::where('type_id', UserTypeEnum::TECHNICIAN->value)
                ->inRandomOrder()
                ->value('id'),
            'attendant_id' => User::where('type_id', UserTypeEnum::ATTENDANT->value)
                ->inRandomOrder()
                ->value('id'),
            'status_id' => OrderStatus::inRandomOrder()->value('id'),
            'diagnostic' => $this->faker->sentence(),
            'service_description' => $this->faker->sentence(),
            'service_price' => $this->faker->numberBetween(1, 1000),
            'parts_price' => $this->faker->numberBetween(1, 1000),
            'total_price' => $this->faker->numberBetween(1, 1000),
            'discount' => $this->faker->numberBetween(1, 1000),
            'created_at' => fake()->dateTimeBetween('-3 year', 'now'),
            'updated_at' => now(),
        ];
    }
}
