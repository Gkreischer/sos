<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Part;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Part>
 */
class PartFactory extends Factory
{
    protected $model = Part::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'name' => $this->faker->name(),
            'description' => $this->faker->sentence(),
            'image' => 'https://picsum.photos/200/300',
            'category_id' => Category::all()->random()->id,
            'price' => $this->faker->numberBetween(1, 1000),
        ];
    }
}
