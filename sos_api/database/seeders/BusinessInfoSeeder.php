<?php

namespace Database\Seeders;

use App\Models\BusinessInfo;
use Illuminate\Database\Seeder;

class BusinessInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BusinessInfo::create([
            'name' => 'Sos',
            'email' => 'sos@sos.com.br',
            'phone' => '+551199999999',
            'address' => 'Rua teste de figueireido lopes da silva - Aquarius',
            'address_number' => '123',
            'cnpj' => '12345678901234',
            'city' => 'São Paulo',
            'state' => 'SP',
            'cep' => '01234567',
            'country' => 'Brasil',
            'website' => 'https://sos.com.br',
            'image' => 'https://picsum.photos/200/300',
        ]);
    }
}
