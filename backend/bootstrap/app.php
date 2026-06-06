<?php

use App\Http\Middleware\EnsureActiveHumanAccount;
use App\Http\Middleware\EnsureIdempotentRequest;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();

        $middleware->alias([
            'active.account' => EnsureActiveHumanAccount::class,
            'idempotent' => EnsureIdempotentRequest::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (ValidationException $exception, Request $request): ?JsonResponse {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'error' => [
                    'code' => 'validation_failed',
                    'message' => 'Los datos enviados no son válidos.',
                    'fields' => $exception->errors(),
                ],
            ], 422);
        });

        $exceptions->render(function (Throwable $exception, Request $request): ?JsonResponse {
            if (! $request->is('api/*')) {
                return null;
            }

            [$status, $code, $message] = match (true) {
                $exception instanceof AuthenticationException => [401, 'unauthenticated', 'Debes iniciar sesión.'],
                $exception instanceof AuthorizationException => [403, 'forbidden', 'No tienes permiso para realizar esta acción.'],
                $exception instanceof ModelNotFoundException => [404, 'not_found', 'El recurso solicitado no existe.'],
                $exception instanceof HttpExceptionInterface => [$exception->getStatusCode(), 'http_error', $exception->getMessage() ?: 'La solicitud no pudo procesarse.'],
                default => [500, 'server_error', 'Ocurrió un error inesperado.'],
            };

            return response()->json([
                'error' => [
                    'code' => $code,
                    'message' => $message,
                    'fields' => (object) [],
                ],
            ], $status);
        });
    })->create();
