<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\UserType;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'cpf' => fake()->numerify('###########'),
            'cnpj' => fake()->numerify('##############'),
            'fantasy_name' => fake()->name(),
            'corporate_name' => fake()->name(),
            'cep' => fake()->numerify('########'),
            'address' => fake()->address(),
            'phone' => fake()->numerify('###########'),
            'city' => fake()->city(),
            'district' => fake()->city(),
            'state' => strtoupper(fake()->lexify('??')),
            'country' => fake()->country(),
            'image' => fake()->imageUrl(),
            'type_id' => fake()->numberBetween(1, 4),

        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
