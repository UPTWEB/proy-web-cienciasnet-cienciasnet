<?php

use App\Http\Controllers\Api\V1\Auth\PasswordRecoveryController;
use App\Http\Controllers\Api\V1\Auth\SessionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', fn () => response()->json([
        'data' => ['status' => 'ok'],
    ]))->name('api.v1.health');

    Route::prefix('auth')->group(function (): void {
        Route::post('/login', [SessionController::class, 'store'])->middleware('throttle:human-login');
        Route::post('/forgot-password', [PasswordRecoveryController::class, 'requestLink'])
            ->middleware('throttle:password-recovery');
        Route::post('/reset-password', [PasswordRecoveryController::class, 'reset'])
            ->middleware('throttle:password-recovery');

        Route::middleware(['auth:sanctum', 'active.account'])->group(function (): void {
            Route::get('/session', [SessionController::class, 'show']);
            Route::post('/logout', [SessionController::class, 'destroy']);
        });
    });
});
