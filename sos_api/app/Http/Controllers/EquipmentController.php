<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Cache;

class EquipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Captura a página atual da requisição (padrão é 1)
            $page = request()->get('page', 1);

            // Cria uma chave única por página (ex: equipments_page_1, equipments_page_2)
            $cacheKey = 'equipments_page_' . $page;

            $equipmentsCache = Cache::remember($cacheKey, now()->addMinutes(5), function () {
                return Equipment::orderBy('created_at', 'desc')->paginate(20)->toArray();
            });

            return response($equipmentsCache);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar os equipamentos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            //
            $data = $request->all();

            // Make validation with Validator
            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
                'description' => 'string|max:255',
                'category_id' => 'required|exists:categories,id',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $equipment = Equipment::create($data);

            Cache::tags('equipments-list')->flush();

            $equipment->load(['category',  'user']);

            return response($equipment, 201);
        } catch (\Exception $e) {
            return response(
                [
                    'message' => 'Equipment not created',
                    'error' => $e->getMessage()
                ],
                404
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipment $equipment, int $id)
    {
        //
        try {
            $equipment = Equipment::findOrFail($id);

            return response($equipment, 200);
        } catch (\Exception $e) {
            return response(
                [
                    'message' => 'Equipment not found',
                    'error' => $e->getMessage()
                ],
                404
            );
        }
    }

    public function getEquipmentByFilter(Request $request)
    {
        try {
            $description = trim($request->description ?? '');
            $page = $request->get('page', 1);

            // Criamos uma chave dinâmica única baseada no termo de busca e na página
            // Exemplo de chave no Redis: equipments:filter:notebook:page:1
            // Se a descrição estiver vazia, fica: equipments:filter:all:page:1
            $searchKey = !empty($description) ? md5($description) : 'all';
            $cacheKey = "equipments:filter:{$searchKey}:page:{$page}";

            $equipments = Cache::tags('equipments-list')->remember($cacheKey, now()->addMinutes(5), function () use ($description) {
                return Equipment::query()
                    ->select(
                        'equipments.id',
                        'equipments.name',
                        'equipments.description',
                        'equipments.category_id',
                        'equipments.user_id',
                        'equipments.obs',
                        'equipments.created_at'
                    )
                    ->with([
                        'category:id,name',
                        'user:id,name'
                    ])
                    ->when(!empty($description), function ($query) use ($description) {
                        $query->where(function ($q) use ($description) {
                            $q->where('equipments.name', 'LIKE', '%' . $description . '%')
                                ->orWhereHas('category', function ($q2) use ($description) {
                                    $q2->where('name', 'LIKE', '%' . $description . '%');
                                })
                                ->orWhereHas('user', function ($q2) use ($description) {
                                    $q2->where('name', 'LIKE', '%' . $description . '%');
                                });
                        });
                    })
                    ->orderBy('equipments.created_at', 'desc')
                    ->paginate(20)
                    ->toArray(); // Converte para array garantindo que salve com sucesso no seu Redis
            });

            return response($equipments, 200);
        } catch (\Exception $e) { // Corrigido para \Exception global por segurança
            return response([
                'message' => 'Não foi possível obter os equipamentos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        //
        try {

            $data = $request->all();

            // Make validation with Validator
            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
                'description' => 'string|max:255|nullable',
                'category_id' => 'required|exists:categories,id',
                'user_id' => 'required|exists:users,id',
                'obs' => 'string|max:255|nullable',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $equipment = Equipment::findOrFail($id);

            $equipment->update($data);

            Cache::tags('equipments-list')->flush();

            // Recarrega as relações após a atualização
            $equipment->load(['category', 'user']);

            return response($equipment, 200);
        } catch (\Exception $e) {
            return response(
                [
                    'message' => 'Equipamento não foi atualizado',
                    'error' => $e->getMessage()
                ],
                404
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipment $equipment, int $id)
    {
        //
        try {
            $equipment = Equipment::findOrFail($id);

            $equipment->delete();

            Cache::tags('equipments-list')->flush();

            return response($equipment, 204);
        } catch (QueryException $e) {
            return response([
                'message' => 'Equipamento já possui ordem de serviço associada',
                'error' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            return response(
                [
                    'message' => 'Erro ao deletar o equipamento',
                    'error' => $e->getMessage()
                ],
                404
            );
        }
    }

    public function getUserEquipments(int $id)
    {
        try {
            $equipments = Equipment::where('user_id', $id)->get();

            return response($equipments, 200);
        } catch (Exception $e) {
            return response(
                [
                    'message' => 'Erro ao obter os equipamentos do usuario',
                    'error' => $e->getMessage()
                ],
                500
            );
        }
    }
}
