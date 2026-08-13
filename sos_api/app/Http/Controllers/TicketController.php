<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Events\NewTicket;
use App\Models\OrderStatus;
use App\OrderStatusEnum;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $tickets = Ticket::paginate(20);
            return response($tickets);
        } catch (\Exception $e) {
            return response([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getByFilters(Request $request)
    {
        $status_id = $request->status_id;
        $search_term = trim($request->search);

        $start_date = !empty($request->start_date)
            ? Carbon::createFromFormat('d/m/Y', trim($request->start_date))->startOfDay()
            : null;

        $end_date = !empty($request->end_date)
            ? Carbon::createFromFormat('d/m/Y', trim($request->end_date))->endOfDay()
            : null;

        $tickets = Ticket::query()
            ->select(
                'tickets.id',
                'tickets.title',
                'tickets.created_at',
                'tickets.status_id',
                'tickets.user_id',
                'tickets.equipment_id',
                'tickets.description',
            )
            ->with([
                'user:id,name',
                'status:id,name',
                'equipment:id,name',
            ])

            // Filtro por status
            ->when(
                isset($status_id) && $status_id != 0,
                function ($query) use ($status_id) {
                    $query->where('tickets.status_id', $status_id);
                }
            )

            // Filtro por texto
            ->when(
                !empty($search_term),
                function ($query) use ($search_term) {
                    $query->where(function ($q) use ($search_term) {

                        // Busca por ID
                        if (is_numeric($search_term)) {
                            $q->orWhere('tickets.id', (int) $search_term);
                        }

                        // Busca por título ignorando maiúsculas/minúsculas
                        // e acentos
                        $q->orWhereRaw(
                            'unaccent(tickets.title) ILIKE unaccent(?)',
                            ["%{$search_term}%"]
                        )

                            // Busca por usuário ignorando
                            // maiúsculas/minúsculas e acentos
                            ->orWhereHas('user', function ($q2) use ($search_term) {
                                $q2->whereRaw(
                                    'unaccent(name) ILIKE unaccent(?)',
                                    ["%{$search_term}%"]
                                );
                            });
                    });
                }
            )

            // Entre duas datas
            ->when(
                $start_date && $end_date,
                function ($query) use ($start_date, $end_date) {
                    $query->whereBetween(
                        'tickets.created_at',
                        [$start_date, $end_date]
                    );
                }
            )

            // Maior ou igual à data inicial
            ->when(
                $start_date && !$end_date,
                function ($query) use ($start_date) {
                    $query->where(
                        'tickets.created_at',
                        '>=',
                        $start_date
                    );
                }
            )

            // Menor ou igual à data final
            ->when(
                !$start_date && $end_date,
                function ($query) use ($end_date) {
                    $query->where(
                        'tickets.created_at',
                        '<=',
                        $end_date
                    );
                }
            )

            ->orderByDesc('tickets.created_at')
            ->paginate(20);

        return response()->json($tickets);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->all();

            $validators = Validator::make($data, [
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:255',
            ]);

            if ($validators->fails()) {
                return response([
                    'message' => 'Não foi possível salvar o chamado',
                    'error' => $validators->errors()
                ], 400);
            }
            $data['user_id'] = auth('sanctum')->user()->id;
            $data['status_id'] = OrderStatus::where('id', OrderStatusEnum::PENDING)->first()->id;
            $ticket = Ticket::create($data);
            $ticket->load(['user:id,name', 'status:id,name']);
            broadcast(new NewTicket($ticket));
            return response($ticket);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível salvar o chamado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        try {
            $ticket = Ticket::with('order')->findOrFail($id);

            return response($ticket);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar o chamado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        try {
            $data = $request->all();
            $validators = Validator::make($data, [
                'title' => 'required|string|max:255',
                'description' => 'required|string|max:255',
            ]);

            if ($validators->fails()) {
                return response([
                    'message' => 'Não foi possível salvar o ticket',
                    'error' => $validators->errors()
                ], 400);
            }
            $ticket = $ticket->update($data);
            return response($ticket);
        } catch (\Exception $e) {
            return response([
                'message' => 'Não foi possível atualizar o ticket',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }

    public function getUserTickets()
    {
        try {
            $user_id = auth('sanctum')->user()->id;
            $tickets = Ticket::with('order')->where('user_id', $user_id)
                ->orderBy('created_at', 'desc')
                ->paginate(20);
            return response($tickets);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar os tickets',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
