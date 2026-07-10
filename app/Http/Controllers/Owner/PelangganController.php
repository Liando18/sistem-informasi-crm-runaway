<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PelangganController extends Controller
{
    public function index(Request $request)
    {
        $pelanggan = Akun::where('role', 'pelanggan')
            ->withCount(['pesanans as total_pesanan' => function ($q) {
                $q->where('status', '!=', 'dibatalkan');
            }])
            ->latest()
            ->paginate(10);

        return Inertia::render('owner/pelanggan/index', [
            'pelanggan' => $pelanggan,
        ]);
    }

    public function show(Akun $akun)
    {
        if ($akun->role !== 'pelanggan') {
            abort(404);
        }

        $akun->loadCount(['pesanans as total_pesanan' => function ($q) {
            $q->where('status', '!=', 'dibatalkan');
        }]);

        $pesananTerbaru = $akun->pesanans()
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('owner/pelanggan/show', [
            'pelanggan' => $akun,
            'pesananTerbaru' => $pesananTerbaru,
        ]);
    }
}
