<?php

namespace App\Http\Controllers;

use App\Events\NewNotification;
use Illuminate\Http\Request;

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
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
