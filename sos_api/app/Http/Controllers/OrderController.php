<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderParts;
use Exception;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function getAll()
    {
        try {

            $orders = Order::orderBy('created_at', 'desc')->limit(30)->get();
            return response($orders);
        } catch (Exception $e) {
            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function getById(int $id)
    {
        try {
            // Buscar a ordem de serviço com as partes relacionadas
            $order = Order::findOrFail($id);

            return response($order);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar a ordem de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(int $id, Request $request) {
        try {
            $order = Order::findOrFail($id);

            if(!empty($request->parts)) {
                $parts = $request->parts;

                foreach ($parts as $part) {
                    OrderParts::updateOrCreate(
                        [
                            'order_id' => $order->id,
                        ],
                        [
                            'name' => $part['name'],
                            'quantity' => $part['quantity'],
                            'price' => $part['price'],
                        ]
                    );
                }
            }
            $order->update($request->all());
            $order->load('user', 'equipment', 'orderParts', 'images', 'status');

            return response($order);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível atualizar a ordem de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function getOrderByStatus(int $status_id)
    {
        try {
            $orders = Order::where('status_id', $status_id)->get();

            return response($orders);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function searchByFilter(Request $request)
    {
        try {

            $status_id = $request->status_id;
            $search_term = trim($request->search);

            $orders = Order::query()
                ->when(isset($status_id) && $status_id !== '', function ($query) use ($status_id) {
                    $query->where('orders.status_id', $status_id);
                })
                ->when(!empty($search_term), function ($query) use ($search_term) {
                    $query->where(function ($q) use ($search_term) {

                        // 🔍 Busca por ID (se for numérico)
                        if (is_numeric($search_term)) {
                            $q->orWhere('orders.id', (int) $search_term);
                        }

                        // 🔍 Busca por título
                        $q->orWhere('orders.title', 'LIKE', '%' . $search_term . '%')

                        // 🔍 Busca por nome do usuário
                        ->orWhereHas('user', function ($q2) use ($search_term) {
                            $q2->where('name', 'LIKE', '%' . $search_term . '%');
                        });
                    });
                })
                ->get();

            return response($orders);

        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();

            $order = Order::create($data);

            $order->load(['status', 'technician', 'user', 'equipment']);

            return response($order);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível criar a ordem de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
