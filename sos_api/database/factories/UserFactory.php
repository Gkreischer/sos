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
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
            'cpf' => $this->faker->numerify('###########'),
            'cnpj' => $this->faker->numerify('##############'),
            'fantasy_name' => $this->faker->name(),
            'corporate_name' => $this->faker->name(),
            'cep' => $this->faker->numerify('########'),
            'address' => $this->faker->address(),
            'phone' => $this->faker->numerify('#############'),
            'city' => $this->faker->city(),
            'district' => $this->faker->city(),
            'state' => strtoupper($this->faker->lexify('??')),
            'country' => $this->faker->country(),
            'image' => 'https://picsum.photos/200/300',
            'type_id' => $this->faker->randomElement(UserType::pluck('id')->toArray()),

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
