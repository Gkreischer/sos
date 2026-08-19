<?php

namespace App\Http\Controllers;

use App\Models\Part;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

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
            $part = DB::transaction(function () use ($request, $id) {

                $validator = Validator::make($request->all(), [
                    'name' => 'required|string|max:255',
                    'description' => 'nullable|string|max:1024',
                    'price' => 'required|string',
                    'category_id' => 'required|numeric',
                    'created_at' => 'nullable|date',
                    'updated_at' => 'nullable|date',
                    'image' => 'string|nullable',
                ]);

                $validatedData = $validator->validate();

                $part = Part::lockForUpdate()->findOrFail($id);

                $part->update($validatedData);

                return $part;
            });

            return response($part, 200);
        } catch (ValidationException $e) {
            return response([
                'message' => 'Os dados fornecidos são inválidos.',
                'errors' => $e->errors(),
            ], 422);
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
            $description = trim($request->input('description', ''));

            $part = Part::query()
                ->when(! empty($description), function ($query) use ($description) {
                    $query->where(function ($q) use ($description) {
                        $q->whereRaw(
                            'unaccent(name) ILIKE unaccent(?)',
                            ["%{$description}%"]
                        )
                            ->orWhereRaw(
                                'unaccent(description) ILIKE unaccent(?)',
                                ["%{$description}%"]
                            );
                    });
                })
                ->paginate(20);

            return response($part, 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível obter a peça',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function create(Request $request)
    {
        try {
            $data = $request->all();

            $validator = Validator::make($data, [
                'name' => 'required|string|max:256',
                'description' => 'nullable|string|max:1024',
                'price' => 'required|string',
                'category_id' => 'required|numeric',
                'image' => 'string|nullable',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $validated = $validator->validated();

            $part = Part::create($validated);
            $part->load('category');

            return response($part);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível criar a peça',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Part $part, int $id)
    {
        try {
            $part = Part::findOrFail($id);

            $copyPart = $part;

            $part->delete();

            return response($copyPart, 204);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível deletar a peça',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
