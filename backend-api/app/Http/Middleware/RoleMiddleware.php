<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        switch ($role) {
            case 'admin':
                if (!$user->is_admin) {
                    return response()->json(['message' => 'Forbidden, admin only'], 403);
                }
                break;

            case 'worker':
                if (!$user->is_worker) {
                    return response()->json(['message' => 'Forbidden, worker only'], 403);
                }
                break;

            case 'user':
                if ($user->is_worker || $user->is_admin) {
                    return response()->json(['message' => 'Forbidden, user only'], 403);
                }
                break;

            default:
                return response()->json(['message' => 'Invalid role specified'], 400);
        }

        return $next($request);
    }
}
