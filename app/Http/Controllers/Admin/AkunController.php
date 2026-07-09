<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use Inertia\Inertia;

class AkunController extends Controller
{
    public function index()
    {
        $pelanggan = Akun::where('role', 'pelanggan')
            ->withCount(['pesanans as total_pesanan' => function ($q) {
                $q->whereNotIn('status', ['dibatalkan']);
            }])
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/pelanggan/index', [
            'pelanggan' => $pelanggan,
        ]);
    }

    public function show(Akun $akun)
    {
        if ($akun->role !== 'pelanggan') {
            abort(404);
        }

        $akun->loadCount(['pesanans as total_pesanan']);

        $pesananTerbaru = $akun->pesanans()
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('admin/pelanggan/show', [
            'pelanggan' => $akun,
            'pesananTerbaru' => $pesananTerbaru,
        ]);
    }
}
