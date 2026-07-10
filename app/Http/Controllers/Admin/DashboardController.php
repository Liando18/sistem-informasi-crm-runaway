<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use App\Models\DetailPesanan;
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

        $pesananTerbaru = Pesanan::with('akun:id_akun,nama')->latest()->take(5)->get();

        $pendapatanHariIni = Pesanan::whereNotIn('status', ['dibatalkan'])
            ->whereDate('tgl_pesanan', today())
            ->sum('grand_total');

        $revenueTrend = Pesanan::whereNotIn('status', ['dibatalkan'])
            ->where('tgl_pesanan', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw('DATE(tgl_pesanan) as date, SUM(grand_total) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $ordersByStatus = Pesanan::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->orderBy('count', 'desc')
            ->get();

        $topProducts = DetailPesanan::selectRaw('produk.nama_produk, SUM(detail_pesanan.jumlah) as total_terjual')
            ->join('produk', 'produk.id_produk', '=', 'detail_pesanan.produk_id')
            ->join('pesanan', 'pesanan.id_pesanan', '=', 'detail_pesanan.pesanan_id')
            ->whereNotIn('pesanan.status', ['dibatalkan'])
            ->groupBy('produk.nama_produk')
            ->orderBy('total_terjual', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'totalProduk' => $totalProduk,
            'totalKategori' => $totalKategori,
            'totalPesanan' => $totalPesanan,
            'totalPelanggan' => $totalPelanggan,
            'pesananTerbaru' => $pesananTerbaru,
            'pendapatanHariIni' => $pendapatanHariIni,
            'revenueTrend' => $revenueTrend,
            'ordersByStatus' => $ordersByStatus,
            'topProducts' => $topProducts,
        ]);
    }
}
