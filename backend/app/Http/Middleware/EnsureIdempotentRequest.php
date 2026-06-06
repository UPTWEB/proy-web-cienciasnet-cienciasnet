<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

final class EnsureIdempotentRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $key = $request->header('Idempotency-Key');

        if (! is_string($key) || trim($key) === '') {
            return response()->json([
                'error' => [
                    'code' => 'idempotency_key_required',
                    'message' => 'La cabecera Idempotency-Key es obligatoria.',
                    'fields' => (object) [],
                ],
            ], 422);
        }

        $cacheKey = 'idempotency:'.hash('sha256', implode('|', [
            (string) optional($request->user())->getAuthIdentifier(),
            $request->method(),
            $request->path(),
            $key,
        ]));

        $cached = Cache::get($cacheKey);
        if (is_array($cached)) {
            return new JsonResponse($cached['body'], $cached['status'], $cached['headers']);
        }

        return Cache::lock($cacheKey.':lock', 10)->block(5, function () use ($cacheKey, $next, $request): Response {
            $cached = Cache::get($cacheKey);
            if (is_array($cached)) {
                return new JsonResponse($cached['body'], $cached['status'], $cached['headers']);
            }

            $response = $next($request);
            if ($response instanceof JsonResponse && $response->isSuccessful()) {
                Cache::put($cacheKey, [
                    'body' => $response->getData(true),
                    'status' => $response->getStatusCode(),
                    'headers' => ['Idempotency-Replayed' => 'true'],
                ], now()->addDay());
            }

            return $response;
        });
    }
}
