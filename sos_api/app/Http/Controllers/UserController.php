<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        try
        {
            $users = User::all();

            return response($users, 200);
        }catch(Exception $e)
        {
            return response([
                'message' => 'Não foi possível obter os usuários',
                'error' => $e->getMessage()
            ],
        500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, int $id)
    {
        //
        try
        {
            $user = User::findOrFail($id);

            return response($user, 200);
        }catch(Exception $e)
        {
            return response([
                'message' => 'Não foi possível obter o usuário',
                'error' => $e->getMessage()
            ],
        500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }

    public function getUserByName(Request $request)
    {
        try
        {

            $data = $request->all();

            $validator = Validator::make($data, 
                [
                    'name' => 'required|max:255'
                ]
            );

            if($validator->fails())
            {
                return response($validator->errors(), 400);
            }

            $user = User::where('name', $data['name'])->first();

            return response($user, 200);
        }catch(Exception $e)
        {
            return response([
                'message' => 'Não foi possível obter o usuário',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
