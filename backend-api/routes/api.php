<?php

use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\Api\WorkerController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\WorkController;
use App\Http\Controllers\Api\NotificationController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);
Route::get('/services', [ServiceController::class, 'index']); // list active
        Route::get('/services/{service}', [ServiceController::class, 'show']); // single
Route::get('/ping', function () {
    return response()->json(['message' => 'API is alive']);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/admin/users', [AuthController::class, 'index']);
    Route::get('/admin/allworkers', [AuthController::class, 'fullWorkers']);
    Route::get('/admin/fullworkers', [WorkerController::class, 'listWorkers']);
    Route::get('/admin/works', [WorkController::class, 'index']);

    Route::post('notifications/user', [NotificationController::class, 'sendToUser']); // admin → user
    Route::post('notifications/worker', [NotificationController::class, 'sendToWorker']); // admin → worker
    Route::post('notifications/admin', [NotificationController::class, 'sendToAdmin']); // user/worker → admin
    Route::post('notifications/reply', [NotificationController::class, 'sendReply']); // reply
    Route::get('notifications', [NotificationController::class, 'myNotifications']); // admin only: messages from users/workers
    Route::get('notifications/admin', [NotificationController::class, 'myAdminNotifications']); // user/worker: messages from admin




Route::middleware(RoleMiddleware::class . ':worker')->group(function () {
        Route::post('worker/works', [WorkController::class, 'store']); // Create work
        // Route::get('/works/{work}', [WorkController::class, 'show']);
        Route::delete('/worker/works/{work}', [WorkController::class, 'destroy']);

        Route::get('/worker/works', [WorkController::class, 'myWorks']); // View own works
        Route::patch('/worker/works/{work}', [WorkController::class, 'update']); // Combined update
        Route::post('/works/{work}/answer', [WorkController::class, 'addWorkerAnswer']); // Answer user question
        Route::get('/worker/users/search', [WorkController::class, 'searchUserByEmail']);
    });

    // User routes
    Route::get('/user/works', [WorkController::class, 'userWorks']); // User sees their works
    Route::post('/works/{work}/question', [WorkController::class, 'addUserQuestion']); // Add question


    // Admin-only route
    Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin'])->group(function () {
    Route::post('/create-worker', [WorkerController::class, 'createWorker']); // create worker
    Route::get('/admin/workers', [WorkerController::class, 'listWorkers']);   // list workers + search
    Route::patch('/admin/workers/{worker}/toggle', [WorkerController::class, 'toggleWorker']); // block/unblock
});

    /*
    |--------------------------------------------------------------------------
    | Services - ADMIN
    |--------------------------------------------------------------------------
    */
    Route::middleware(['auth:sanctum',RoleMiddleware::class . ':admin'])->group(function () {
    Route::get('/admin/services', [ServiceController::class, 'allServices']); // For the management page
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
});   

});


// profile routes
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile', [ProfileController::class, 'update']);
    Route::patch('/profile/password', [ProfileController::class, 'changePassword']);
});
