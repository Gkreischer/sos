<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;

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
            )
            ->with([
                'user:id,name',
                'status:id,name'
            ])
            // Filtro por status
            ->when(isset($status_id) && $status_id != 0, function ($query) use ($status_id) {
                $query->where('tickets.status_id', $status_id);
            })

            // Filtro por texto
            ->when(!empty($search_term), function ($query) use ($search_term) {
                $query->where(function ($q) use ($search_term) {

                    // Busca por ID
                    if (is_numeric($search_term)) {
                        $q->orWhere('tickets.id', (int) $search_term);
                    }

                    // Busca por título
                    $q->orWhere('tickets.title', 'LIKE', '%' . $search_term . '%')

                        // Busca por usuário
                        ->orWhereHas('user', function ($q2) use ($search_term) {
                            $q2->where('name', 'LIKE', '%' . $search_term . '%');
                        });
                });
            })

            // Entre duas datas
            ->when($start_date && $end_date, function ($query) use ($start_date, $end_date) {
                $query->whereBetween('tickets.created_at', [$start_date, $end_date]);
            })

            // Maior ou igual à data inicial
            ->when($start_date && !$end_date, function ($query) use ($start_date) {
                $query->where('tickets.created_at', '>=', $start_date);
            })

            // Menor ou igual à data final
            ->when(!$start_date && $end_date, function ($query) use ($end_date) {
                $query->where('tickets.created_at', '<=', $end_date);
            })
            ->orderByDesc('tickets.created_at')
            ->limit(20)
            ->paginate();

        return response($tickets);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket, int $id)
    {
        try {
            $ticket = Ticket::findOrFail($id);

            return response($ticket);
        } catch (Exception $e) {
            return response([
                'message' => 'Não foi possível carregar o chamado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }
}
