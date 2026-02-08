<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    
    public function myNotifications(Request $request)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $notifications = Notification::with(['sender', 'replies.sender'])
            ->whereNull('parent_id') 
            ->whereHas('sender', function($q) {
                $q->where('is_admin', false); 
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }
//sent to user
    public function sendToUser(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'title' => 'required|string',
            'message' => 'required|string',
        ]);

        if ($data['receiver_id']) {
            Notification::create([
                'sender_id' => $request->user()->id,
                'receiver_id' => $data['receiver_id'],
                'receiver_type' => 'user',
                'title' => $data['title'],
                'message' => $data['message'],
            ]);
        } else {
            $users = User::where('is_admin', false)->where('is_worker', false)->get();
            foreach ($users as $user) {
                Notification::create([
                    'sender_id' => $request->user()->id,
                    'receiver_id' => $user->id,
                    'receiver_type' => 'user',
                    'title' => $data['title'],
                    'message' => $data['message'],
                ]);
            }
        }

        return response()->json(['message' => 'Notification sent to user(s)']);
    }

//to worker
    public function sendToWorker(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'nullable|exists:users,id',
            'title' => 'required|string',
            'message' => 'required|string',
        ]);

        if ($data['receiver_id']) {
            Notification::create([
                'sender_id' => $request->user()->id,
                'receiver_id' => $data['receiver_id'],
                'receiver_type' => 'worker',
                'title' => $data['title'],
                'message' => $data['message'],
            ]);
        } else {
            $workers = User::where('is_worker', true)->get();
            foreach ($workers as $worker) {
                Notification::create([
                    'sender_id' => $request->user()->id,
                    'receiver_id' => $worker->id,
                    'receiver_type' => 'worker',
                    'title' => $data['title'],
                    'message' => $data['message'],
                ]);
            }
        }

        return response()->json(['message' => 'Notification sent to worker(s)']);
    }
//reply section 
    public function sendReply(Request $request)
    {
        $data = $request->validate([
            'parent_id' => 'required|exists:notifications,id',
            'message' => 'required|string',
        ]);

        $parent = Notification::findOrFail($data['parent_id']);

        $reply = Notification::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $parent->sender_id, 
            'receiver_type' => $parent->receiver_type,
            'title' => $parent->title, 
            'message' => $data['message'],
            'parent_id' => $parent->id,
        ]);

        return response()->json(['message' => 'Reply sent', 'reply' => $reply]);
    }
//sent to admin
    public function sendToAdmin(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
        ]);

        $admins = User::where('is_admin', true)->get();

        foreach ($admins as $admin) {
            Notification::create([
                'sender_id' => $request->user()->id,
                'receiver_id' => $admin->id,
                'receiver_type' => 'admin',
                'title' => $data['title'],
                'message' => $data['message'],
            ]);
        }

        return response()->json(['message' => 'Notification sent to admin']);
    }

//admin to all u/w
    public function myAdminNotifications(Request $request)
    {
        $userId = $request->user()->id;

        $notifications = Notification::with('replies.sender')
            ->whereHas('sender', function($q) {
                $q->where('is_admin', true); 
            })
            ->where(function ($q) use ($userId) {
                $q->where('receiver_id', $userId) 
                  ->orWhere(function($q2){
                      $q2->where('receiver_id', null); 
                  });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }
}
