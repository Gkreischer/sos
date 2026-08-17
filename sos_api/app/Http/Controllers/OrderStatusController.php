<?php

namespace App\Http\Controllers;

use App\Models\OrderStatus;

class OrderStatusController extends Controller
{
    public function index()
    {
        try {
            $orderStatuses = OrderStatus::all();

            return response($orderStatuses, 200);
        } catch (\Exception $e) {
            return response(['error' => $e->getMessage()], 500);
        }
    }
}
