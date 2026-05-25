<?php

namespace App\Http\Controllers;

use App\Models\Part;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PartController extends Controller
{
    public function search(Request $request)
    {
        try {

            $data = $request->all();

            $parts = Part::where('name', 'like', '%' . $data['search'] . '%')->get();

            return response($parts);
        } catch (Exception $e) {
            return response([
                'message' => 'Nao foi possível encontrar as pecas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getById(int $id)
    {

        try {
            $part = Part::findOrFail($id);

            return response($part);
        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possível encontrar a peca',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAll()
    {

        try {
            $parts = Part::orderBy('created_at', 'desc')->paginate(20);

            return response($parts);
        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possível encontrar as pecas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, int $id)
    {

        try {
            $part = Part::findOrFail($id);

            $part->update($request->all());

            return response($part);
        } catch (ModelNotFoundException $e) {
            return response([
                'message' => 'Peça não encontrada',
                'error' => $e->getMessage(),
            ], 404);
        } catch (Exception $e) {
            return response([
                'message' => 'Erro ao atualizar a peça',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getPartByDescFilter(Request $request)
    {

        try {

            $data = $request->all();

            $part = Part::query()
                ->when(!empty($data['description']), function ($query) use ($data) {
                    $query->where('name', 'LIKE', '%' . $data['description'] . '%')
                        ->orWhere('description', 'LIKE', '%' . $data['description'] . '%');
                })
                ->paginate(20);

            return response($part, 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível obter a peça',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
