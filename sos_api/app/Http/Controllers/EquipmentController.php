<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use App\Models\Order;

class EquipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Captura a página atual da requisição (padrão é 1)
            $page = request()->input('page', 1);

            // Cria uma chave única por página (ex: equipments_page_1, equipments_page_2)
            $cacheKey = 'equipments_page_' . $page;

            $equipmentsCache = Cache::tags('equipments-list')->remember($cacheKey, now()->addMinutes(5), function () {
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

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'category_id' => 'required|exists:categories,id',
                'user_id' => 'nullable|exists:users,id',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $validated = $validator->validated();

            $validated['user_id'] ??= auth('sanctum')->user()->id;

            $equipment = Equipment::create($validated);

            Cache::tags('equipments-list')->flush();
            Cache::tags('customer-equipments-list')->flush();

            $equipment->load(['category', 'user']);

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
            $description = trim($request->input('description', ''));
            $page = $request->input('page', 1);

            $searchKey = !empty($description)
                ? md5($description)
                : 'all';

            $cacheKey = "equipments:filter:{$searchKey}:page:{$page}";

            $equipments = Cache::tags('equipments-list')->remember(
                $cacheKey,
                now()->addMinutes(5),
                function () use ($description) {
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
                        ->when(
                            !empty($description),
                            function ($query) use ($description) {
                                $query->where(function ($q) use ($description) {

                                    // Busca pelo nome do equipamento
                                    $q->whereRaw(
                                        'unaccent(equipments.name) ILIKE unaccent(?)',
                                        ["%{$description}%"]
                                    )

                                        // Busca pela categoria
                                        ->orWhereHas('category', function ($q2) use ($description) {
                                            $q2->whereRaw(
                                                'unaccent(name) ILIKE unaccent(?)',
                                                ["%{$description}%"]
                                            );
                                        })

                                        // Busca pelo usuário
                                        ->orWhereHas('user', function ($q2) use ($description) {
                                            $q2->whereRaw(
                                                'unaccent(name) ILIKE unaccent(?)',
                                                ["%{$description}%"]
                                            );
                                        });
                                });
                            }
                        )
                        ->orderByDesc('equipments.created_at')
                        ->orderByDesc('equipments.id')
                        ->paginate(20)
                        ->toArray();
                }
            );

            return response()->json($equipments, 200);
        } catch (\Exception $e) {
            return response()->json([
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
                'description' => 'string|nullable',
                'category_id' => 'required|exists:categories,id',
                'user_id' => 'required|exists:users,id',
                'obs' => 'string|nullable',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $validated = $validator->validated();

            $equipment = Equipment::findOrFail($id);

            $equipment->update($validated);

            Cache::tags('equipments-list')->flush();
            Cache::tags('customer-equipments-list')->flush();


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
            Cache::tags('customer-equipments-list')->flush();

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

    public function getEquipmentsByUserId(int $id)
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

    public function getCustomerEquipments()
    {
        try {
            /** @var User $user */
            $user = auth('sanctum')->user();

            $cacheKey = 'equipments:customer:' . $user->id;

            $equipmentsCache = Cache::tags('customer-equipments-list')->remember($cacheKey, now()->addMinutes(5), function () use ($user) {
                return $user->equipments()->orderBy('created_at', 'desc')->paginate(20);
            });

            return response($equipmentsCache, 200);
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

    public function getCustomerEquipmentById(int $id)
    {
        try {
            /** @var User $user */
            $user = auth('sanctum')->user();

            if (!isset($user)) {
                return response([
                    'message' => 'Sem permissão de acesso',
                    'error' => 'Usuário sem permissão'
                ], 404);
            }
            $equipment = $user->equipments()->findOrFail($id);

            return response($equipment, 200);
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

    public function updateCustomerEquipment(int $id, Request $request)
    {
        try {
            /** @var User $user */
            $user = auth('sanctum')->user();

            if (!isset($user)) {
                return response([
                    'message' => 'Sem permissão de acesso',
                    'error' => 'Usuário sem permissão'
                ], 404);
            }

            $equipment = $user->equipments()->findOrFail($id);
            $data = $request->all();
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

            Cache::tags('customer-equipments-list')->flush();
            $equipment->update($data);

            return response($equipment, 200);
        } catch (Exception $e) {
            return response(
                [
                    'message' => 'Erro ao atualizar o equipamento do usuario',
                    'error' => $e->getMessage()
                ],
                500
            );
        }
    }

    public function getCustomerEquipmentsByFilter(Request $request)
    {
        try {
            /** @var User $user */
            $user = auth('sanctum')->user();

            if (!isset($user)) {
                return response([
                    'message' => 'Sem permissão de acesso',
                    'error' => 'Usuário sem permissão'
                ], 404);
            }

            $description = trim($request->input('description', ''));

            $cacheKey = 'equipments:customer:filter:' . $user->id . ':' . $description;

            $equipmentsCache = Cache::tags('customer-equipments-list')->remember(
                $cacheKey,
                now()->addMinutes(5),
                function () use ($user, $description) {

                    return $user->equipments()
                        ->select(
                            'equipments.id',
                            'equipments.name',
                            'equipments.description',
                            'equipments.category_id',
                            'equipments.obs',
                            'equipments.created_at'
                        )
                        ->with([
                            'category:id,name',
                        ])
                        ->when(
                            !empty($description),
                            function ($query) use ($description) {
                                $query->where(function ($q) use ($description) {

                                    // Busca pelo nome do equipamento
                                    $q->whereRaw(
                                        'unaccent(equipments.name) ILIKE unaccent(?)',
                                        ["%{$description}%"]
                                    )

                                        // Busca pelo nome da categoria
                                        ->orWhereHas('category', function ($category) use ($description) {
                                            $category->whereRaw(
                                                'unaccent(name) ILIKE unaccent(?)',
                                                ["%{$description}%"]
                                            );
                                        });
                                });
                            }
                        )
                        ->orderByDesc('equipments.created_at')
                        ->paginate(20);
                }
            );

            return response()->json($equipmentsCache, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Não foi possível obter os equipamentos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteCustomerEquipment(int $id)
    {
        try {
            /** @var User $user */
            $user = auth('sanctum')->user();
            $equipment = $user->equipments()->findOrFail($id);
            $equipment->delete();
            Cache::tags('customer-equipments-list')->flush();
            return response($equipment, 204);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível excluir o equipamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getEquipmentOrderHistory(int $id)
    {
        try {

            $orders = Order::with(['user', 'equipment', 'status', 'parts', 'technician', 'pictures'])
                ->where('equipment_id', $id)
                ->orderBy('created_at')
                ->paginate(20);
            return response($orders);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível obter o histórico do equipamento',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
