<?php

namespace App\Http\Controllers;

use App\Models\BusinessInfo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
                'phone' => 'string',
            ]);

            if ($validators->fails()) {
                return response($validators->errors(), 400);
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

    public function updateBusinessLogo(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            ]);

            $business = BusinessInfo::where('id', 1)->first();

            // Remove a imagem antiga, caso exista
            if ($business->image) {
                Storage::disk('public')->delete($business->image);
            }

            // Salva a nova imagem
            $path = $request->file('image')->store('business', 'public');

            // Atualiza o usuário
            $business->update([
                'image' => Storage::url($path),
            ]);


            return response($business);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Não foi possível atualizar a imagem',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
