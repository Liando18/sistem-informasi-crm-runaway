<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $flash = [];
        if ($request->session()->has('success')) {
            $flash = ['type' => 'success', 'message' => $request->session()->get('success')];
        } elseif ($request->session()->has('error')) {
            $flash = ['type' => 'error', 'message' => $request->session()->get('error')];
        } elseif ($request->session()->has('warning')) {
            $flash = ['type' => 'warning', 'message' => $request->session()->get('warning')];
        } elseif ($request->session()->has('info')) {
            $flash = ['type' => 'info', 'message' => $request->session()->get('info')];
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'toast' => $flash ?: null,
        ];
    }
}
