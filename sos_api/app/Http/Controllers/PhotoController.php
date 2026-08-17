<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function store(Request $request)
    {
        try {
            $photo = $request->file('image');
            $path = $photo->store('public/images');
            $publicPath = Storage::url($path);

            return response([
                'imagePath' => url($publicPath),
                'message' => 'Foto salva com sucesso',
            ], 200);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível salvar a foto',
                'error' => $e->getMessage(),
                500,
            ]);
        }
    }
}
