<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use App\Models\Pesanan;
use App\Models\Produk;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProduk = Produk::count();
        $totalPelanggan = Akun::where('role', 'pelanggan')->count();
        $totalPesananSelesai = Pesanan::where('status', 'selesai')->count();

        $pendapatanHariIni = Pesanan::where('status', '!=', 'dibatalkan')
            ->whereDate('tgl_pesanan', today())
            ->sum('grand_total');

        $pendapatanBulanIni = Pesanan::where('status', '!=', 'dibatalkan')
            ->whereMonth('tgl_pesanan', now()->month)
            ->whereYear('tgl_pesanan', now()->year)
            ->sum('grand_total');

        $pendapatanTahunIni = Pesanan::where('status', '!=', 'dibatalkan')
            ->whereYear('tgl_pesanan', now()->year)
            ->sum('grand_total');

        $stokMenipis = Produk::where('stok', '<=', 5)->get();

        $penjualanTerbaru = Pesanan::with('akun')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('owner/dashboard', [
            'totalProduk' => $totalProduk,
            'totalPelanggan' => $totalPelanggan,
            'totalPesananSelesai' => $totalPesananSelesai,
            'pendapatanHariIni' => $pendapatanHariIni,
            'pendapatanBulanIni' => $pendapatanBulanIni,
            'pendapatanTahunIni' => $pendapatanTahunIni,
            'stokMenipis' => $stokMenipis,
            'penjualanTerbaru' => $penjualanTerbaru,
        ]);
    }
}
