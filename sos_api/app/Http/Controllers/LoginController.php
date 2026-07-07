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
