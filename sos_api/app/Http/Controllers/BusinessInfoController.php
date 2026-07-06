<?php

namespace App\Http\Controllers;

use App\Models\BusinessInfo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BusinessInfoController extends Controller
{
    public function getBusinessInfo()
    {
        try {
            $settings = BusinessInfo::all()->first();

            return response($settings);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as configurações',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function storeBusinessInfo(Request $request)
    {
        try {
            $data = $request->all();

            $validators = Validator::make($data, [
                'name' => 'string',
                'email' => 'string|email',
                'cnpj' => 'string',
                'cep' => 'string',
                'address' => 'string',
                'address_number' => 'string',
                'city' => 'string',
                'state' => 'string',
                'country' => 'string',
                'website' => 'string|nullable|url',
                'image' => 'string',
                'phone' => 'string',
            ]);

            if ($validators->fails()) {
                return response($validators->errors(), 400);
            }
            /** @var \App\Models\User $user */
            $user = auth('sanctum')->user();

            if (!$user->hasRole('admin')) {
                return response([
                    'message' => 'Você não tem permissão para realizar esta ação',
                    'error' => 'Você não tem permissão para realizar esta ação'
                ], 403);
            }

            $setting = BusinessInfo::where('id', 1)->updateOrCreate(
                ['id' => 1],
                $data
            );

            return response($setting);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível criar a configuração',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
