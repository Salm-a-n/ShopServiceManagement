<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

public function update(Request $request)
{
    $user = $request->user();

    $data = $request->validate([
        'username' => 'sometimes|string|unique:users,username,' . $user->id,
        'phone' => 'sometimes|string',
        'description' => 'sometimes|string',
        'profile_photo' => 'sometimes|image|max:2048',
    ]);

    if ($request->hasFile('profile_photo')) {
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $data['profile_photo'] =
            $request->file('profile_photo')->store('profiles', 'public');
    }

    if (empty($data)) {
        return response()->json([
            'message' => 'Nothing to update'
        ], 422);
    }

    $user->update($data);

    return response()->json([
        'message' => 'Profile updated',
        'user' => $user->fresh(), 
    ]);
}

public function changePassword(Request $request)
{
    $request->validate([
        'old_password' => 'required',
        'new_password' => 'required|min:6|confirmed',
    ]);

    $user = $request->user();
    if (!Hash::check($request->old_password, $user->password)) {
        return response()->json([
            'message' => 'Old password is incorrect'
        ], 422);
    }
    if ($request->old_password === $request->new_password) {
        return response()->json([
            'message' => 'New password cannot be the same as old password'
        ], 422);
    }
    $user->update([
        'password' => Hash::make($request->new_password),
    ]);

    return response()->json([
        'message' => 'Password changed successfully'
    ]);
}

}
