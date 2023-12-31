<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EquipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $equipments = Equipment::all();
    
        return response($equipments, 200);
    }   

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try
        {
            //
        $data = $request->all();

        // Make validation with Validator
        $validator = Validator::make($data, [
            'name' => 'required|string|max:255',
            'description' => 'string|max:255',
            'image' => 'url|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response($validator->errors(), 400);
        }

        $equipment = Equipment::create($data);

        $equipment->load(['category',  'user', 'images']);

        return response($equipment, 201);
        } 
        catch (\Exception $e)
        {
            return response(
                [
                    'message' => 'Equipment not created',
                    'error' => $e->getMessage()
                ], 404);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipment $equipment, int $id)
    {
        //
        try
        {
            $equipment = Equipment::findOrFail($id);
        
            return response($equipment, 200);
        } 
        catch (\Exception $e) 
        {
            return response(
                [
                    'message' => 'Equipment not found',
                    'error' => $e->getMessage()
                ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        //
        try
        {

            $data = $request->all();

            // Make validation with Validator
            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
                'description' => 'string|max:255|nullable',
                'category_id' => 'required|exists:categories,id',
                'user_id' => 'required|exists:users,id',
                'obs' => 'string|max:255|nullable',
            ]);
    
            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $equipment = Equipment::findOrFail($id);

            $equipment->update($data);

            // Recarrega as relações após a atualização
            $equipment->load(['category', 'parts', 'user']);

            return response($equipment, 200);
        }
        catch(\Exception $e)
        {
            return response(
                [
                    'message' => 'Equipment not updated',
                    'error' => $e->getMessage()
                ], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipment $equipment)
    {
        //
        try
        {
            $equipment = Equipment::findOrFail($id);

            $equipment->delete();

            return response($equipment, 200);
        }
        catch(\Exception $e)
        {
            return response(
                [
                    'message' => 'Equipment not deleted',
                    'error' => $e->getMessage()
                ], 
            404);
        }
    }
}
