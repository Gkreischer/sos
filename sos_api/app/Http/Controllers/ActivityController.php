<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityController extends Controller
{
    public function index()
    {
        try {
            $lastActivity = Activity::latest('id')->paginate(20);
            return response($lastActivity);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível obter a última atividade',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
