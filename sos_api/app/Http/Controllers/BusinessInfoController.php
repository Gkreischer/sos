<?php

namespace App\Http\Controllers;

use App\Models\BusinessInfo;
use Exception;
use Illuminate\Http\Request;

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
