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

        $penjualanTerbaru = Pesanan::with('akun:id_akun,nama')
            ->latest()
            ->take(5)
            ->get();

        $revenueTrend = Pesanan::where('status', '!=', 'dibatalkan')
            ->where('tgl_pesanan', '>=', now()->subDays(29)->startOfDay())
            ->selectRaw('DATE(tgl_pesanan) as date, SUM(grand_total) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $monthlyRevenue = Pesanan::where('status', '!=', 'dibatalkan')
            ->whereYear('tgl_pesanan', now()->year)
            ->selectRaw('MONTH(tgl_pesanan) as month, SUM(grand_total) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $ordersByStatus = Pesanan::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->orderBy('count', 'desc')
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
            'revenueTrend' => $revenueTrend,
            'monthlyRevenue' => $monthlyRevenue,
            'ordersByStatus' => $ordersByStatus,
        ]);
    }
}
