<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\NewNotification;

class NotificationController extends Controller
{
    public function sendMessage(Request $request)
    {

        try {
            $message = $request->input('message');

            broadcast(new NewNotification($message));

            return response(true);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível enviar a mensagem',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
