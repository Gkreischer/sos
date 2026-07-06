<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\UserType;

class LoginController extends Controller
{

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string|min:8'
            ]);

            $user = User::where('email', $request->email)
                ->with('type')
                ->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response([
                    'message' => 'Informações de login incorretas'
                ], 401);
            }

            $userToken = $user->createToken($request->email)->plainTextToken;

            return response([
                'token' => $userToken,
                'user' => $user,

            ]);
        } catch (ValidationException $e) {
            return response([
                'message' => 'Dados inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Throwable $e) {
            return response([
                'message' => 'Não foi possível realizar login',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function registerTechnician(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $request->id,
                'password' => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required|string|min:8',
                'phone' => 'string|max:20',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'type_id' => UserType::where('name', 'Técnico')->first()->id,
                'phone' => $request->phone,
            ]);

            return response([
                'message' => 'Técnico criado com sucesso',
                'token' => $user->createToken($request->name . $request->email)->plainTextToken
            ]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível criar o usuário',
                'error' => 'Não foi possível criar o usuário',
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $user->tokens()->delete();

        return response([
            'message' => 'Sessão encerrada com sucesso',
            'error' => null
        ]);
    }

    public function verifyToken(Request $request)
    {
        try {
            $user = auth('sanctum')->user();
            $user->type = UserType::select('name')->where('id', $user->type_id)->first();
            unset($user->type_id);

            return response($user);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível encontrar o usuário',
                'error' => 'Não foi possível encontrar o usuário',
            ], 500);
        }
    }
}
