<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Work;
use Illuminate\Http\Request;

class WorkController extends Controller
{


    public function index() 
    {
    $works = Work::with(['user', 'worker'])
                 ->orderBy('created_at', 'desc')
                 ->get();
                 
    return response()->json($works);
    }

    public function store(Request $request)
    {
        $worker = $request->user();

        if (!$worker || !$worker->is_worker) {
            return response()->json(['message' => 'Only workers can create works'], 403);
        }

        if (!$worker->is_active) {
            return response()->json(['message' => 'Your account is blocked by admin'], 403);
        }

        $activeWorks = Work::where('worker_id', $worker->id)
            ->whereIn('status', ['pending', 'in_progress'])
            ->count();

        if ($activeWorks >= 4) {
            return response()->json(['message' => 'You already have 3 active works'], 403);
        }

        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'complaint' => 'required|string',
            'brand' => 'required|string',
            'model' => 'required|string',
            'expected_delivery' => 'nullable|date',
            'price' => 'nullable|numeric|min:0',
        ]);

        $work = Work::create([
            'user_id' => $data['user_id'],
            'worker_id' => $worker->id,
            'complaint' => $data['complaint'],
            'brand' => $data['brand'],
            'model' => $data['model'],
            'expected_delivery' => $data['expected_delivery'] ?? null,
            'price' => $data['price'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Work created successfully',
            'work' => $work
        ], 201);
    }

    public function searchUserByEmail(Request $request)
    {
        $worker = $request->user();
        if (!$worker || !$worker->is_worker) {
            return response()->json(['message' => 'Only workers allowed'], 403);
        }

        $email = $request->query('email');
        if (!$email) {
            return response()->json(['message' => 'Email query parameter is required'], 400);
        }

        $user = \App\Models\User::where('email', $email)
            ->where('is_admin', false)
            ->where('is_worker', false)
            ->first();

        if (!$user) {
            return response()->json(null, 200);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->username,
            'email' => $user->email,
        ]);
    }

public function destroy(Work $work)
{
    $worker = request()->user();
    if ($work->worker_id !== $worker->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    if ($work->status !== 'pending') {
        return response()->json(['message' => 'Only pending jobs can be deleted'], 422);
    }

    $work->delete();
    return response()->json(['message' => 'Work deleted successfully']);
}

    public function myWorks(Request $request)
{
    $worker = $request->user();
    if (!$worker || !$worker->is_worker) {
        return response()->json(['message' => 'Only workers can view this'], 403);
    }

    $activeWorks = Work::with('user')
        ->where('worker_id', $worker->id)
        ->whereIn('status', ['pending', 'in_progress'])
        ->orderBy('created_at', 'desc')
        ->get();

    $historyQuery = Work::with('user')
        ->where('worker_id', $worker->id)
        ->where('status', 'completed')
        ->orderBy('updated_at', 'desc');

    if ($request->filled('search')) {
        $search = $request->search;
        $historyQuery->where(function($q) use ($search) {
            $q->where('brand', 'like', "%{$search}%")
              ->orWhere('model', 'like', "%{$search}%")
              ->orWhereHas('user', function($u) use ($search) {
                  $u->where('username', 'like', "%{$search}%");
              });
        });
    }

    $history = $historyQuery->paginate($request->get('per_page', 10));

    return response()->json([
        'active' => $activeWorks,
        'history' => $history
    ]);
}

    public function userWorks(Request $request)
    {
        $user = $request->user();
        if ($user->is_worker) {
            return response()->json(['message' => 'Workers cannot access this'], 403);
        }

        $query = Work::with('worker')->where('user_id', $user->id);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('complaint', 'like', "%{$search}%");
            });
        }

        $works = $query->orderBy('created_at', 'desc')
                       ->paginate($request->get('per_page', 10));

        return response()->json($works);
    }

    public function update(Request $request, Work $work)
    {
        $worker = $request->user();

        if (!$worker || $work->worker_id !== $worker->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $data = $request->validate([
            'status' => 'sometimes|in:pending,in_progress,completed',
            'price' => 'sometimes|numeric|min:0',
            'expected_delivery' => 'sometimes|date',
            'complaint' => 'sometimes|string',
        ]);

        $work->update($data);

        return response()->json([
            'message' => 'Work updated successfully',
            'work' => $work
        ]);
    }

    public function addUserQuestion(Request $request, Work $work)
    {
        $user = $request->user();
        if ($work->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['question' => 'required|string']);

        $questions = $work->user_questions ?? [];
        $questions[] = [
            'message' => $request->question,
            'time' => now()->toDateTimeString(),
        ];

        $work->update(['user_questions' => $questions]);

        return response()->json([
            'message' => 'Question added successfully',
            'questions' => $questions
        ]);
    }

    public function addWorkerAnswer(Request $request, Work $work)
    {
        $worker = $request->user();
        if (!$worker || $work->worker_id !== $worker->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate(['answer' => 'required|string']);

        $answers = $work->worker_answers ?? [];
        $answers[] = [
            'message' => $request->answer,
            'time' => now()->toDateTimeString(),
        ];

        $work->update(['worker_answers' => $answers]);

        return response()->json([
            'message' => 'Answer added successfully',
            'answers' => $answers
        ]);
    }
}