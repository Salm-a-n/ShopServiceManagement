<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class WorkerController extends Controller
{
    public function createWorker(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'phone' => 'required|string',
            'password' => 'required|string|min:6',
            'description' => 'nullable|string',
        ]);

        $worker = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'password' => Hash::make($data['password']),
            'description' => $data['description'] ?? 'Worker',
            'is_admin' => false,
            'is_worker' => true,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Worker created successfully',
            'worker' => $worker
        ]);
    }

public function listWorkers(Request $request)
{
    $search = $request->query('search');

    $workers = User::where('is_worker', true)
        ->when($search, function($query, $search) {
            $query->where('username', 'LIKE', "%$search%");
        })
        ->withCount([
            'works as total_works',
            'works as completed_works' => function($q) {
                $q->where('status', 'completed');
            },
            'works as pending_works' => function($q) {
                $q->whereIn('status', ['pending', 'in_progress']);
            },
        ])
        ->orderByDesc('completed_works')
        // ->get();
        ->paginate(3); 
    return response()->json($workers);
}

    public function toggleWorker(User $worker)
    {
        if (!$worker->is_worker) {
            return response()->json([
                'message' => 'User is not a worker'
            ], 400);
        }

        $worker->is_active = !$worker->is_active;
        $worker->save();

        return response()->json([
            'message' => $worker->is_active ? 'Worker unblocked successfully' : 'Worker blocked successfully',
            'worker' => [
                'id' => $worker->id,
                'username' => $worker->username,
                'is_active' => $worker->is_active,
            ]
        ]);
    }
}
