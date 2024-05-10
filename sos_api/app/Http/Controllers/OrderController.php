<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Exception;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function getAll($props)
    {
        try {

            if ($props) {
                $orders = Order::where($props)->get();
            }

            if (!isset($props)) {
                $orders = Order::all();
            }

            return response($orders);
        } catch (Exception $e) {
            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function getOpenedOrders()
    {

        try {
            $orders = Order::where('status', 0)->get();

            return response($orders);
        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getInProgressOrders()
    {

        try {
            $orders = Order::where('status', 1)->get();

            return response($orders);
        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getFinishedOrders()
    {

        try {
            $orders = Order::where('status', 2)->get();

            return response($orders);
        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getDeveliredOrders()
    {

        try {
            $orders = Order::where('status', 3)->get();

            return response($orders);
        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getById(int $id)
{
    try {
        // Buscar a ordem de serviço com as partes relacionadas
        $order = Order::with('parts')->findOrFail($id);

        // Adicionar quantidade e preço para cada parte
        foreach ($order->parts as $part) {
            $pivotData = $part->pivot;
            $part->quantity = $pivotData->quantity;
            $part->price = $pivotData->price;
            $part->updated_at = $pivotData->updated_at;
            unset($part->pivot); // Remover o objeto pivot da parte
        }

        return response()->json($order);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'Não foi possível carregar a ordem de serviço',
            'error' => $e->getMessage()
        ], 404);
    }
}
}
