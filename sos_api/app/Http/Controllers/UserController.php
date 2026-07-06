<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\UserType;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        try {
            $users = User::with('type')->select('id', 'name', 'phone', 'type_id', 'cpf', 'cnpj', 'cep')->paginate(20);

            return response($users, 200);
        } catch (Exception $e) {
            return response(
                [
                    'message' => 'Não foi possível obter os usuários',
                    'error' => $e->getMessage()
                ],
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        //
        try {
            $user = User::findOrFail($id);

            return response($user, 200);
        } catch (Exception $e) {
            return response(
                [
                    'message' => 'Não foi possível obter o usuário',
                    'error' => $e->getMessage()
                ],
                500
            );
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

            $types = UserType::pluck('id', 'name');

            if (
                !empty($data['type_id']) &&
                is_numeric($data['type_id']) &&
                request()->user()->type_id !== $types['Administrador']
            ) {
                return response([
                    'message' => 'Não é possível alterar o tipo de usuário',
                    'error' => 'Não é possível alterar o tipo de usuário'
                ], 403);
            }

            if (!empty($data['password']) && !empty($data['password_confirmation']) && $data['password'] != $data['password_confirmation'] && strlen($data['password']) >= 8 && strlen($data['password_confirmation']) >= 8) {
                return response([
                    'message' => 'A confirmação da senha não confere',
                    'error' => 'A confirmação da senha não confere'
                ], 400);
            }

            // Make validation with Validator
            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'cpf' => 'nullable|string|max:14|unique:users,cpf,' . $id,
                'fantasy_name' => 'nullable|string|max:255',
                'corporate_name' => 'nullable|string|max:255',
                'cnpj' => 'nullable|string|max:18|unique:users,cnpj,' . $id,
                'cep' => 'required|string|max:9',
                'address' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'state' => 'required|string|max:2',
                'country' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $user = User::findOrFail($id);

            DB::transaction(function () use ($user, $data) {

                $user->update($data);
            });
            $user->load('type');

            Cache::tags('users-list')->flush();

            return response($user, 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível atualizar o usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, int $id)
    {
        //
        try {
            $user = User::findOrFail($id);

            $user->delete();

            Cache::tags('users-list')->flush();

            return response($user, 200);
        }
        // Make an exception for QueryException
        catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                return response(
                    [
                        'message' => 'Não foi possível deletar o usuário pois ele já está sendo utilizado ',
                        'error' => $e->getMessage()
                    ],
                    422
                );
            }
        } catch (Exception $e) {
            return response(
                [
                    'message' => 'Não foi possível deletar o usuário',
                    'error' => $e->getMessage()
                ],
                422
            );
        }
    }

    public function store(Request $request)
    {

        try {

            $data = $request->all();

            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $request->id,
                'cpf' => 'nullable|string|max:14',
                'fantasy_name' => 'nullable|string|max:255',
                'corporate_name' => 'nullable|string|max:255',
                'cnpj' => 'nullable|string|max:18',
                'cep' => 'required|string|max:9',
                'address' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'state' => 'required|string|max:2',
                'country' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $user = User::create($data);
            $user->load('type');

            Cache::tags('users-list')->flush();

            return response($user);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível criar o usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUsersWithFilter(Request $request)
    {
        try {
            // Correção: Chamada correta do objeto $request
            $page = $request->get('page', 1);

            $data = $request->all();

            $validator = Validator::make(
                $data,
                [
                    'description' => 'max:255|string|nullable',
                    'type_id' => 'nullable|integer' // Correção: 'integer' em vez de 'int' no Laravel
                ]
            );

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }
            /** @var \Illuminate\Database\Eloquent\Builder $query */
            $query = User::query();

            if (!empty($data['description'])) {
                $query->where(function ($q) use ($data) {
                    $q->where('name', 'LIKE', '%' . $data['description'] . '%')
                        ->orWhere('phone', 'LIKE', '%' . $data['description'] . '%')
                        ->orWhere('email', 'LIKE', '%' . $data['description'] . '%')
                        ->orWhereHas('type', function ($q) use ($data) {
                            $q->where('name', 'LIKE', '%' . $data['description'] . '%');
                        });
                });
            }

            if (!empty($data['type_id'])) {
                $query->whereHas('type', function ($q) use ($data) {
                    $q->where('id', $data['type_id']);
                });
            }


            $descriptionFilter = $data['description'] ?? 'none';
            $typeFilter = $data['type_id'] ?? 'none';
            $cacheKey = "users:filter:{$descriptionFilter}:type:{$typeFilter}:page:{$page}";

            $users = Cache::tags('users-list')->remember($cacheKey, now()->addMinutes(5), function () use ($query, $descriptionFilter, $typeFilter) {

                return $query->with('type')->paginate(20)->toArray();
            });

            return response($users, 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível obter o usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateUserAvatarImage(Request $request)
    {
        try {


            if (!isset($request->imagePath)) {
                return response([
                    'message' => 'Não foi recebida informação da imagem',
                    'error' => throw new Exception('Não foi possível receber informações da imagem')
                ]);
            }

            $user = $request->user();
            $user->update([
                'image' => $request->imagePath
            ]);

            return $user->load('type');
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível atualizar a imagem',
                'error' => $e->getMessage()
            ]);
        }
    }
}
