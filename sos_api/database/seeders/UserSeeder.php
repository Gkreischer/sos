<?php

namespace Database\Seeders;

use App\Models\UserType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!User::where('email', 'admin@localhost')->exists()) {
            $user = User::create([
                'name' => 'admin',
                'email' => 'admin@localhost',
                'password' => Hash::make('teste123'),
                'cpf' => '12312312355',
                'fantasy_name' => 'SOS Informática',
                'corporate_name' => 'SOS Informática',
                'cnpj' => '12345678901234',
                'type_id' => UserType::where('name', 'Administrador')->first()->id,
                'address' => 'Endereço',
                'cep' => '12345678',
                'phone' => '2212345678957',
                'district' => 'Bairro',
                'city' => 'Cidade',
                'state' => 'RJ',
                'country' => 'Brasil',
                'image' => 'images/sos_logo.png',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            $user->assignRole('admin');
        }
    }
}
