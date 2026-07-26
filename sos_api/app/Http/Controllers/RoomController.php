<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;

use App\Events\NewRoom;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $rooms = Room::with('creator:id,name,image,created_at')->orderBy('created_at', 'desc')
                ->paginate(20);
            return response($rooms);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível encontrar as salas',
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
            $user = auth('sanctum')->user();

            // Correção na validação (o 'if' original tinha parênteses desalinhados que quebravam a lógica)
            if (!$request->has('name') || !$request->has('private')) {
                return response([
                    'message' => 'Não foi possível criar a sala',
                    'error' => 'Verifique o nome da sala e a privacidade da sala'
                ], 400);
            }

            $room = Room::create([
                'name' => $request->input('name'),
                'private' => $request->input('private'),
                'created_by' => $user->id
            ]);

            // 1. Vincula o criador da sala
            $room->users()->attach($user->id);

            // 2. Vincula os convidados vindos do Angular sem desvincular o criador
            if ($request->has('users')) {
                // Se vier array de objetos, use 'users.*.id'. Se vier array de IDs simples, use apenas 'users'
                $userIds = $request->input('users.*.id') ?? $request->input('users');

                if (!empty($userIds)) {
                    $room->users()->syncWithoutDetaching($userIds);
                }
            }

            $room->load('creator:id,name,image');
            broadcast(new NewRoom($room));

            return response(['success' => true, 'room' => $room]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível criar a sala',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            // No 'users:', você define as colunas. 
            // OBRIGATÓRIO: 'id' deve estar incluso para o Laravel conseguir fazer o vínculo da tabela pivô!
            $room = Room::with(['users:id,name,image', 'messages', 'creator:id,name,image'])->findOrFail($id);

            // Validação de privacidade (continua funcionando igual)
            if ($room->private && !$room->users->contains(auth('sanctum')->user())) {
                return response([
                    'message' => 'Não foi possível obter informações da sala',
                    'error' => 'Você não pode ver informações da sala'
                ], 403);
            }

            // Remove o criador da lista de usuários (agora com os campos filtrados)
            $room->setRelation('users', $room->users->reject(function ($user) use ($room) {
                return $user->id === $room->created_by;
            })->values());

            return response($room);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível encontrar a sala',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    // 1. Removida a tipagem estrita 'int' para evitar o erro do Laravel/PHP
    public function update(Request $request, int $id)
    {
        try {
            if (!$request->has('name') || !$request->has('private')) {
                return response([
                    'message' => 'Não foi possível atualizar a sala',
                    'error' => 'Verifique o nome e a privacidade da sala'
                ], 400);
            }

            $room = Room::findOrFail($id);
            $user = auth('sanctum')->user();

            // Verificação de permissão
            if ($room->created_by != $user->id) {
                return response([
                    'message' => 'Não foi possível atualizar a sala',
                    'error' => 'Você não tem permissão para atualizar esta sala.'
                ], 403); // HTTP 403 Forbidden é o correto aqui
            }

            // 3. Sincronização corrigida aceitando tanto array de IDs quanto de Objetos
            if ($request->has('users')) {
                $userIds = $request->input('users.*.id') ?? $request->input('users');

                if (!empty($userIds)) {
                    $room->users()->syncWithoutDetaching($userIds);
                }
            }

            // Atualiza os dados da sala
            $room->update($request->only('name', 'private'));
            $room->load(['users:id,name,image', 'messages', 'creator:id,name,image']);
            return response($room);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível atualizar a sala',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {
            $user = auth('sanctum')->user();
            $room = Room::findOrFail($id);

            if ($room->created_by != $user->id) {
                return response([
                    'message' => 'Não foi possível excluir a sala',
                    'error' => 'Você não pode excluir a sala que você não criou'
                ]);
            }
            $roomCopy = $room;
            $room->delete();
            return response($roomCopy);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível excluir a sala',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRoomMessages(Request $request)
    {
        try {
            if (empty($request->input('room_id'))) {
                return response([
                    'message' => 'Não foi possível encontrar as mensagens',
                    'error' => 'A sala não foi informada'
                ], 400);
            }
            $room = Room::findOrFail($request->input('room_id'));
            if ($room->private && !$room->users->contains(auth('sanctum')->user())) {
                return response([
                    'message' => 'Você não foi convidado para esta sala',
                    'error' => 'Você não pode ver as mensagens da sala'
                ], 403);
            }
            $messages = $room->messages;
            $messages->load('user:id,name,image');
            return response($messages);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível encontrar as mensagens',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRoomUsers(Request $request)
    {
        try {
            if (empty($request->input('room_id'))) {
                return response([
                    'message' => 'Não foi possível encontrar os usuários',
                    'error' => 'A sala não foi informada'
                ], 400);
            }
            $room = Room::findOrFail($request->input('room_id'));
            if ($room->private && !$room->users->contains(auth('sanctum')->user())) {
                return response([
                    'message' => 'Não foi possível encontrar os usuários',
                    'error' => 'Você não pode ver os usuários da sala'
                ], 403);
            }
            $users = $room->users;
            return response($users);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível encontrar os usuários',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function blockRoomUsers(Request $request)
    {
        try {
            if (empty($request->input('room_id') || empty($request->input('users_id')))) {
                return response([
                    'message' => 'Não foi possível bloquear os usuários',
                    'error' => 'A sala ou o usuário não foram informados'
                ], 400);
            }
            $room = Room::findOrFail($request->input('room_id'));

            if ($room->created_by != auth('sanctum')->user()->id) {
                return response([
                    'message' => 'Não foi possível bloquear os usuários',
                    'error' => 'Somente o administrador da sala pode bloquear usuários'
                ], 403);
            }

            $users = User::whereIn('id', $request->input('users_id'));
            foreach ($users as $user) {
                $room->blockedUsers()->attach($user);
            }

            return response([
                'message' => 'Usuários bloqueados com sucesso'
            ]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível bloquear os usuários',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function unblockRoomUsers(Request $request)
    {
        try {
            if (empty($request->input('room_id')) || empty($request->input('users_id'))) {
                return response([
                    'message' => 'Não foi possível desbloquear os usuários',
                    'error' => 'A sala não foi informada'
                ], 400);
            }
            $room = Room::findOrFail($request->input('room_id'));

            if ($room->created_by != auth('sanctum')->user()->id) {
                return response([
                    'message' => 'Não foi possível bloquear os usuários',
                    'error' => 'Somente o administrador da sala pode bloquear usuários'
                ], 403);
            }

            $users = User::whereIn('id', $request->input('users_id'));

            foreach ($users as $user) {
                $room->blockedUsers()->detach($user);
            }

            return response([
                'message' => 'Usuários desbloqueados com sucesso'
            ]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível desbloquear os usuários',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
