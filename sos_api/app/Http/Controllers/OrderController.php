<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Exception;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function getAll($props) 
    {
        try
        {

            if($props) 
            {
                $orders = Order::where($props)->get();
            }

            if(!isset($props))
            {
                $orders = Order::all();
            }

            return response($orders);

        }catch(Exception $e)
        {
            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function getOpenedOrders() {

        try
        {
            $orders = Order::where('status', 0)->get();

            return response($orders);
        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getInProgressOrders() {

        try
        {
            $orders = Order::where('status', 1)->get();

            return response($orders);

        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getFinishedOrders() {
        
        try
        {
            $orders = Order::where('status', 2)->get();

            return response($orders);

        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getDeveliredOrders() {
        
        try
        {
            $orders = Order::where('status', 3)->get();

            return response($orders);

        } catch (Exception $e) {

            return response([
                'message' => 'Nao foi possivel carregar as ordens de serviço',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
