<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        DB::table('users')->insert([
            [
                'name' => 'admin',
                'email' => 'admin@localhost',
                'password' => Hash::make('teste123'),
                'cpf' => '14065716799',
                'fantasy_name' => 'GK Informática',
                'corporate_name' => 'GkInfo Serviços',
                'cnpj' => '12345678901234',
                'address' => 'Travessa X',
                'cep' => '12345678',
                'phone' => '22123456789',
                'city' => 'São Paulo',
                'state' => 'SP',
                'country' => 'Brasil',
                'image' => 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],

        ]);
    }
}
