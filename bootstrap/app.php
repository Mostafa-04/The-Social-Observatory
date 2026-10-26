<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        //
    })
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
        $status = $response->getStatusCode();

        // Si on est en local ou en testing, on laisse la page de debug de Laravel
        if (! app()->environment(['local', 'testing'])
            && in_array($status, [403, 404, 419, 429, 500, 503])) {
            return Inertia::render('Error', ['status' => $status])
                ->toResponse($request)
                ->setStatusCode($status);
        }

        return $response;
    });
})->create();
