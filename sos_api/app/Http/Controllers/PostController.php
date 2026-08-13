<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $description = trim($request->input('description', ''));
            $page = $request->get('page', 1);

            $cacheKey = 'posts_description_' . $description . '_page_' . $page;

            $posts = Cache::tags('posts-list')->remember(
                $cacheKey,
                now()->addMinutes(5),
                function () use ($description) {
                    return Post::query()
                        ->when(!empty($description), function ($query) use ($description) {
                            $query->where(function ($q) use ($description) {
                                $q->whereRaw(
                                    'unaccent(title) ILIKE unaccent(?)',
                                    ["%{$description}%"]
                                )
                                    ->orWhereRaw(
                                        'unaccent(content) ILIKE unaccent(?)',
                                        ["%{$description}%"]
                                    );
                            });
                        })
                        ->with('user:id,name,image')
                        ->orderByDesc('created_at')
                        ->paginate(20)
                        ->toArray();
                }
            );

            return response()->json($posts);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao obter os avisos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {

            $data = $request->all();

            $validator = Validator::make($data, [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 422);
            }

            $data['user_id'] = auth('sanctum')->user()->id;
            $post = Post::create($data);
            $post->load('user');
            Cache::tags('last-posts')->flush();
            Cache::tags('posts-list')->flush();

            return response($post);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao criar o comentário',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id)
    {
        try {
            $post = Post::findOrFail($id);
            return response($post);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao obter o comentário',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        try {

            $data = $request->all();

            $validator = Validator::make($data, [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response($validator->errors(), 422);
            }

            $post = Post::findOrFail($id);

            $user = auth('sanctum')->user();

            if ($user->id != $post->user_id) {
                return response([
                    'message' => 'Você não tem permissão para atualizar esse aviso',
                ], 403);
            }

            $post->update($request->all());
            $post->load('user');
            Cache::tags('posts-list')->flush();
            Cache::tags('last-posts')->flush();
            return response($post);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao atualizar o aviso',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        try {

            $post = Post::findOrFail($id);
            $user = auth('sanctum')->user();

            if ($user->id != $post->user_id) {
                return response([
                    'message' => 'Você não tem permissão para excluir esse aviso',
                ], 403);
            }
            $postCopy = $post->toArray();
            $post->delete();
            Cache::tags('posts-list')->flush();
            Cache::tags('last-posts')->flush();
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
            $cacheKey = 'posts:last';
            $postsCache = Cache::tags('last-posts')->remember(
                $cacheKey,
                now()->addMinutes(5),
                function () {
                    return Post::with('user')
                        ->orderBy('created_at', 'desc')
                        ->limit(5)
                        ->get()
                        ->toArray();
                }
            );
            return response($postsCache);
        } catch (\Exception $e) {
            return response([
                'message' => 'Erro ao obter os avisos',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
