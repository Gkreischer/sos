<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        try {
            // Get all categories sorted by name
            $categories = Cache::tags('categories-list')->remember('categories', now()->addMinutes(5), function () {
                return Category::orderBy('name', 'asc')->get()->toArray();
            });


            return response($categories);
        } catch (\Exception $e) {
            return response(
                [
                    'message' => 'Categories not found',
                    'error' => $e->getMessage()
                ],
                404
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
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
            Cache::tags('categories-list')->flush();

            return response($category, 201);
        } catch (\Exception $e) {
            return response(
                [
                    'message' => 'Category not created',
                    'error' => $e->getMessage()
                ],
                404
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category, int $id)
    {
        //
        try {
            $category = Category::findOrFail($id);

            return response($category);
        } catch (\Exception $e) {
            return response(
                [
                    'message' => 'Category not found',
                    'error' => $e->getMessage()
                ],
                404
            );
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        try {
            //
            $data = $request->all();

            // Make validation with Validator
            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 400);
            }

            $category = Category::findOrFail($id);

            $category->update($data);

            Cache::tags('categories-list')->flush();


            return response($category, 200);
        } catch (\Exception $e) {
            return response(
                [
                    'message' => 'Category not updated',
                    'error' => $e->getMessage()
                ],
                404
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category, int $id)
    {
        //
        try {
            $category = Category::findOrFail($id);

            $category->delete();

            Cache::tags('categories-list')->flush();


            return response($category, 204);
        }
        // Make an exception for QueryException
        catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                return response(
                    [
                        'message' => 'Não foi possível deletar a categoria pois ela já está sendo utilizada',
                        'error' => $e->getMessage()
                    ],
                    422
                );
            }
        } catch (Exception $e) {
            return response(
                [
                    'message' => 'Não foi possível deletar a categoria',
                    'error' => $e->getMessage()
                ],
                422
            );
        }
    }
}
