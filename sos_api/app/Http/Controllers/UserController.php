<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        try {
            $users = User::with('userType')->select('id', 'name', 'phone', 'type_id')->paginate(20);

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

            // Make validation with Validator
            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $id,
                'cpf' => 'required|string|max:14|unique:users,cpf,' . $id,
                'fantasy_name' => 'nullable|string|max:255',
                'corporate_name' => 'nullable|string|max:255',
                'cnpj' => 'nullable|string|max:18|unique:users,cnpj,' . $id,
                'cep' => 'required|string|max:9',
                'address' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'state' => 'required|string|max:2',
                'country' => 'required|string|max:255',
                'type_id' => 'required|int',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $user = User::findOrFail($id);

            $user->update($data);

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

            $user = User::create($data);

            return response($user);
        } catch (Exception $e) {

            return response([
                'message' => 'Não foi possível criar o usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserByDescription(Request $request)
    {
        try {

            $data = $request->all();

            $validator = Validator::make(
                $data,
                [
                    'description' => 'nullable|max:255',
                    'type_id' => 'nullable|int'
                ]
            );

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $query = User::query();

            if (!empty($data['description'])) {
                $query->where(function ($q) use ($data) {
                    $q->where('name', 'LIKE', '%' . $data['description'] . '%')
                        ->orWhere('phone', 'LIKE', '%' . $data['description'] . '%')
                        ->orWhere('email', 'LIKE', '%' . $data['description'] . '%');
                });
            }

            if (!empty($data['type_id'])) {
                $query->whereHas('userType', function ($q) use ($data) {
                    $q->where('id', $data['type_id']);
                });
            }

            $users = $query->get();

            return response($users, 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível obter o usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
