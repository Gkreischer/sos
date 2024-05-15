<?php

namespace App\Http\Controllers;

use App\Models\Part;
use Exception;
use Illuminate\Http\Request;

class PartController extends Controller
{
    public function search(Request $request) {
        try
        {   

            $data = $request->all();

            $parts = Part::where('name', 'like', '%'.$data['search'].'%')->get();
            
            return response($parts);

        } catch(Exception $e) {
            return response([
                'message' => 'Nao foi possível encontrar as pecas',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
