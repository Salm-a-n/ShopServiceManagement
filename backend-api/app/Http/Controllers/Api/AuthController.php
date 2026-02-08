<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password; 
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;

class AuthController extends Controller
{
    public function register(Request $request)
{
    $data = $request->validate([
        'username' => 'required|string|unique:users,username',
        'email' => 'required|email|unique:users,email',
        'phone' => 'required|string',
        'password' => 'required|string|min:6|confirmed',
    ]);

    $user = User::create([
        'username' => $data['username'],
        
        'email' => $data['email'],
        'phone' => $data['phone'],
        'password' => Hash::make($data['password']),
        'description' => 'user',
        'is_admin' => false,
        'is_worker' => false,
        'is_active' => true,
    ]);

    return response()->json(['message' => 'User registered', 'user' => $user]);
}


    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

            if (!$user->is_active) {
                return response()->json(['message' => 'Account is deactivated'], 403);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
    //deleting all token of te user
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }


    public function index()
{
    $users = User::where('is_admin', false)
                 ->where('is_worker', false)
                 ->orderBy('created_at', 'desc')
                 ->get();

    return response()->json($users);
}
    


    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)]);
        } else {
            return response()->json(['message' => __($status)], 400);
        }
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->setRememberToken(Str::random(60));
                $user->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successful']);
        } else {
            return response()->json(['message' => __($status)], 400);
        }
    }

    public function fullWorkers()
{
    $workers = User::where('is_worker', true)
                   ->orderBy('created_at', 'desc')
                   ->get(); 

    return response()->json($workers);
}
}
