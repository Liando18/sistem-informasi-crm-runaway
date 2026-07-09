<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Testimoni;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $produkTerbaru = Produk::with(['kategori', 'diskon', 'gambarUtama', 'gambarPertama'])->latest()->take(8)->get();

        $produkDiskon = Produk::whereHas('diskon', function ($q) {
            $q->where('status', 'aktif')->where('tanggal_berakhir', '>=', now());
        })->with(['kategori', 'diskon', 'gambarUtama'])->latest()->take(3)->get();

        $testimoni = Testimoni::where('status', 'disetujui')
            ->with('akun')
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('welcome', [
            'produkTerbaru' => $produkTerbaru,
            'produkDiskon' => $produkDiskon,
            'testimoni' => $testimoni,
        ]);
    }
}
