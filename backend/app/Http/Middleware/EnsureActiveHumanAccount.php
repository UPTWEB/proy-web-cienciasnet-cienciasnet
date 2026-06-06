<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveHumanAccount
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->activo !== true) {
            if ($request->hasSession()) {
                $request->session()->invalidate();
            }

            return response()->json([
                'error' => [
                    'code' => 'unauthenticated',
                    'message' => 'Debes iniciar sesión.',
                    'fields' => (object) [],
                ],
            ], 401);
        }

        return $next($request);
    }
}
