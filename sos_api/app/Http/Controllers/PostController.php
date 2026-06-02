<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $posts = Post::paginate(20);
            return response($posts);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao obter os comentários',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 422);
            }

            $post = Post::create($request->all());
            return response($post);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao criar o comentário',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 422);
            }

            $post->update($request->all());
            return response($post);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao atualizar o comentário',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post, Request $request)
    {
        try {
            $post = $request->all();

            $post = Post::findOrFail($post['id']);
            $postCopy = $post->toArray();
            $post->delete();
            return response($postCopy);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao excluir o comentário',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getLastPosts()
    {
        try {
            $posts = Post::with('user')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
            return response($posts);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao obter os comentários',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getUserPosts(Request $request)
    {
        try {
            $user = $request->user();
            $userPosts = $user->posts()->get();
            return response($userPosts);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao obter os comentários',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
