<?php

namespace App\Http\Controllers;

use App\Events\NewMessageRoom;
use App\Models\Message;
use App\Models\Room;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            if (
                empty($request->input('room_id')) ||
                empty($request->input('content'))
            ) {
                return response([
                    'message' => 'Não foi possível enviar a mensagem',
                    'error' => 'Verifique a sala e o conteúdo',
                ], 400);
            }

            $user = auth('sanctum')->user();
            $room = Room::findOrFail($request->input('room_id'));
            $room->users()->syncWithoutDetaching([$user->id]);
            $message = Message::create([
                'room_id' => $request->input('room_id'),
                'user_id' => $user->id,
                'content' => $request->input('content'),
            ]);
            $message->load('user:id,name,image');
            broadcast(new NewMessageRoom($message));

            return response(true);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível enviar a mensagem',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        try {
            $room = Room::findOrFail($request->input('room_id'));
            $message = $room->messages()->update($request->input('id'), $request->input('content'));

            return response($message);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível atualizar a mensagem',
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {
            $user = auth('sanctum')->user();
            $message = Message::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            if ($message->user_id != $user->id) {
                return response([
                    'message' => 'Não foi possível excluir a mensagem',
                    'error' => 'Você não pode excluir',
                ]);
            }

            $message->delete();

            return response([
                'message' => 'Mensagem excluída com sucesso',
            ]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível excluir a mensagem',
                'error' => $e->getMessage(),
            ], $e->getCode());
        }
    }
}
