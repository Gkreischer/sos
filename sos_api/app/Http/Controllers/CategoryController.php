<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        try
        {
            $categories = Category::all();

            return response(['message' => 'teste'])
        }
        catch(\Exception $e)
        {
            return response(
                [
                    'message' => 'Categories not found',
                    'error' => $e->getMessage()
                ], 404);
        }
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
        ]);

        if ($validator->fails()) {
            return response($validator->errors(), 400);
        }

        $category = Category::create($data);

        return response($category, 201);
        } 
        catch (\Exception $e)
        {
            return response(
                [
                    'message' => 'Category not created',
                    'error' => $e->getMessage()
                ], 404);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category, int $id)
    {
        //
        try
        {
            $category = Category::findOrFail($id);

            return response($category);
        }
        catch(\Exception $e)
        {
            return response(
                [
                    'message' => 'Category not found',
                    'error' => $e->getMessage()
                ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
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
            'status' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response($validator->errors(), 400);
        }

        $category = Category::findOrFail($id);

        $category->update($data);

        return response($category, 200);
        } 
        catch(\Exception $e)
        {
            return response(
                [
                    'message' => 'Category not updated',
                    'error' => $e->getMessage()
                ], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
        try
        {
            $category = Category::findOrFail($id);

            $category->delete();

            return response($category, 200);

        }
        catch(Exception $e)
        {
            return response(
                [
                    'message' => 'Category not deleted',
                    'error' => $e->getMessage()
                ], 
            404);
        }   
    }
}
