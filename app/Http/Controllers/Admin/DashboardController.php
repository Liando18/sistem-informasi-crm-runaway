<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use App\Models\Kategori;
use App\Models\Pesanan;
use App\Models\Produk;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProduk = Produk::count();
        $totalKategori = Kategori::count();
        $totalPesanan = Pesanan::count();
        $totalPelanggan = Akun::where('role', 'pelanggan')->count();

        $pesananTerbaru = Pesanan::with('akun')->latest()->take(5)->get()->map(function ($p) {
            return $p;
        });

        $pendapatanHariIni = Pesanan::whereNotIn('status', ['dibatalkan'])
            ->whereDate('tgl_pesanan', today())
            ->sum('grand_total');

        return Inertia::render('admin/dashboard', [
            'totalProduk' => $totalProduk,
            'totalKategori' => $totalKategori,
            'totalPesanan' => $totalPesanan,
            'totalPelanggan' => $totalPelanggan,
            'pesananTerbaru' => $pesananTerbaru,
            'pendapatanHariIni' => $pendapatanHariIni,
        ]);
    }
}
