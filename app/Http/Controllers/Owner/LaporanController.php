<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\DetailPesanan;
use App\Models\Pesanan;
use App\Models\Produk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function stok(Request $request)
    {
        $produks = Produk::with('kategori')
            ->when($request->search, function ($q, $search) {
                $q->where('nama_produk', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('owner/laporan/stok', [
            'produks' => $produks,
        ]);
    }

    public function penjualan(Request $request)
    {
        $periode = $request->periode ?? 'bulan';
        $tanggalMulai = $request->tanggal_mulai;
        $tanggalAkhir = $request->tanggal_akhir;

        $query = Pesanan::where('status', '!=', 'dibatalkan');

        if ($tanggalMulai && $tanggalAkhir) {
            $query->whereBetween('tgl_pesanan', [$tanggalMulai, $tanggalAkhir]);
        } else {
            switch ($periode) {
                case 'hari':
                    $query->whereDate('tgl_pesanan', today());
                    break;
                case 'tahun':
                    $query->whereYear('tgl_pesanan', now()->year);
                    break;
                default:
                    $query->whereMonth('tgl_pesanan', now()->month)
                        ->whereYear('tgl_pesanan', now()->year);
                    break;
            }
        }

        $orders = $query->with('akun')->latest()->get();

        $totalPesanan = $orders->count();
        $totalPendapatan = $orders->sum('grand_total');
        $totalProdukTerjual = DetailPesanan::whereIn('pesanan_id', $orders->pluck('id_pesanan'))->sum('jumlah');

        $chartData = $orders->groupBy(function ($order) use ($periode) {
            if ($periode === 'hari') {
                return $order->tgl_pesanan->format('H:i');
            } elseif ($periode === 'tahun') {
                return $order->tgl_pesanan->format('F');
            }

            return $order->tgl_pesanan->format('d M');
        })->map(function ($groupedOrders, $label) {
            return [
                'label' => $label,
                'total' => $groupedOrders->sum('grand_total'),
                'count' => $groupedOrders->count(),
            ];
        })->values();

        return Inertia::render('owner/laporan/penjualan', [
            'totalPesanan' => $totalPesanan,
            'totalPendapatan' => $totalPendapatan,
            'totalProdukTerjual' => $totalProdukTerjual,
            'orders' => $orders,
            'chartData' => $chartData,
            'periode' => $periode,
            'tanggalMulai' => $tanggalMulai,
            'tanggalAkhir' => $tanggalAkhir,
        ]);
    }

    public function cetakPenjualan(Request $request)
    {
        $periode = $request->periode ?? 'bulan';
        $tanggalMulai = $request->tanggal_mulai;
        $tanggalAkhir = $request->tanggal_akhir;

        $query = Pesanan::where('status', '!=', 'dibatalkan');

        if ($tanggalMulai && $tanggalAkhir) {
            $query->whereBetween('tgl_pesanan', [$tanggalMulai, $tanggalAkhir]);
        } else {
            switch ($periode) {
                case 'hari':
                    $query->whereDate('tgl_pesanan', today());
                    break;
                case 'tahun':
                    $query->whereYear('tgl_pesanan', now()->year);
                    break;
                default:
                    $query->whereMonth('tgl_pesanan', now()->month)
                        ->whereYear('tgl_pesanan', now()->year);
                    break;
            }
        }

        $orders = $query->with('akun')->latest()->get();

        $totalPesanan = $orders->count();
        $totalPendapatan = $orders->sum('grand_total');
        $totalProdukTerjual = DetailPesanan::whereIn('pesanan_id', $orders->pluck('id_pesanan'))->sum('jumlah');

        return Inertia::render('owner/laporan/cetak', [
            'orders' => $orders,
            'totalPesanan' => $totalPesanan,
            'totalPendapatan' => $totalPendapatan,
            'totalProdukTerjual' => $totalProdukTerjual,
            'periode' => $periode,
            'tanggalMulai' => $tanggalMulai,
            'tanggalAkhir' => $tanggalAkhir,
        ]);
    }
}
