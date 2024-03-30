<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Exception;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function getAll() 
    {
        try
        {

            $order = Order::all();

            return response($order);

        }catch(Exception $e)
        {
            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
