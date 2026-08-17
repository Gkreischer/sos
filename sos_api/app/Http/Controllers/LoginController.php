<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials)) {
            return response([
                'message' => 'Credenciais inválidas',
            ], 401);
        }

        $request->session()->regenerate();

        return response([
            'user' => $request->user()->load('type'),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function verifyUser(Request $request)
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

    public function changePassword(Request $request)
    {
        try {

            if (! $request->user_id) {
                $user = $request->user();
            } else {
                $user = User::findOrFail($request->user_id);
            }

            $validator = Validator::make($request->all(), [
                'password' => 'required|string|min:8|max:255|confirmed',
                'password_confirmation' => 'required|string|min:8|max:255',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $user->update([
                'password' => Hash::make($request->password),
            ]);

            // Encerra todas as outras sessões do usuário,
            // mantendo a sessão atual ativa.
            $user->tokens()->delete();

            return response([
                'message' => 'Senha alterada com sucesso.',
            ], 200);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível alterar a senha.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
