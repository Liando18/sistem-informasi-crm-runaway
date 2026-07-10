<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\Role;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => Role::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return null;
            }

            if ($e instanceof ValidationException) {
                return null;
            }

            if (! config('app.debug')) {
                $status = $e instanceof HttpExceptionInterface
                    ? $e->getStatusCode()
                    : ($e instanceof AuthorizationException ? 403 : 500);

                if (in_array($status, [403, 404, 500, 503])) {
                    $pages = [
                        403 => 'errors/403',
                        404 => 'errors/404',
                        500 => 'errors/500',
                        503 => 'errors/500',
                    ];

                    return Inertia::render($pages[$status] ?? 'errors/500', [
                        'status' => $status,
                    ])->toResponse($request)->setStatusCode($status);
                }
            }

            return null;
        });
    })->create();
