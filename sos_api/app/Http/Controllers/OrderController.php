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
            $order = Order::findOrFail($id);

            return response($order);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Não foi possível carregar a ordem de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(int $id, Request $request) {
        try {
            $order = Order::findOrFail($id);

            $order->update($request->all());

            return response($order);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Não foi possível atualizar a ordem de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
