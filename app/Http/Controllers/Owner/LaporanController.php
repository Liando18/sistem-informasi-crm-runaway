<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Models\Produk;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanController extends Controller
{
    public function stok(Request $request)
    {
        $produks = Produk::with('kategori', 'variasis')
            ->when($request->search, function ($q, $search) {
                $q->where('nama_produk', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('owner/laporan/stok', [
            'produks' => $produks,
        ]);
    }

    public function cetakStok(Request $request)
    {
        $produks = Produk::with('kategori', 'variasis')->get();

        $items = collect();
        foreach ($produks as $produk) {
            if ($produk->variasis->isNotEmpty()) {
                $totalStok = $produk->variasis->sum('stok');
                $varian = $produk->variasis->map(fn ($v) => $v->warna.': '.$v->stok)->implode("\n");
                $items->push([
                    'nama_produk' => $produk->nama_produk,
                    'kategori' => $produk->kategori?->nama_kategori,
                    'varian' => $varian,
                    'stok' => $totalStok,
                    'harga' => $produk->harga,
                ]);
            } else {
                $items->push([
                    'nama_produk' => $produk->nama_produk,
                    'kategori' => $produk->kategori?->nama_kategori,
                    'varian' => '-',
                    'stok' => $produk->stok,
                    'harga' => $produk->harga,
                ]);
            }
        }

        return Inertia::render('owner/laporan/cetak-stok', [
            'items' => $items,
            'owner' => $request->user(),
        ]);
    }

    public function penjualan(Request $request)
    {
        $tipe = $request->tipe ?? 'perhari';
        $tanggal = $request->tanggal ?? today()->toDateString();
        $bulan = (int) ($request->bulan ?? now()->month);
        $tahun = (int) ($request->tahun ?? now()->year);

        $query = Pesanan::where('status', '!=', 'dibatalkan')
            ->with(['akun', 'detailPesanans.produk', 'detailPesanans.variasi']);

        if ($tipe === 'perhari') {
            $query->whereDate('tgl_pesanan', $tanggal);
        } elseif ($tipe === 'perbulan') {
            $query->whereMonth('tgl_pesanan', $bulan)
                ->whereYear('tgl_pesanan', $tahun);
        } else {
            $query->whereYear('tgl_pesanan', $tahun);
        }

        if ($tipe === 'perbulan') {
            $orders = $query->get();

            $weeks = collect();
            foreach ($orders as $order) {
                $week = $order->tgl_pesanan->weekOfMonth ?? $order->tgl_pesanan->weekNumberInMonth;
                if (! $weeks->has($week)) {
                    $weeks->put($week, ['minggu_ke' => 'Minggu Ke-'.$week, 'total_barang' => 0, 'total_penjualan' => 0]);
                }
                $current = $weeks->get($week);
                $barang = $order->detailPesanans->sum('jumlah');
                $weeks->put($week, [
                    'minggu_ke' => 'Minggu Ke-'.$week,
                    'total_barang' => $current['total_barang'] + $barang,
                    'total_penjualan' => $current['total_penjualan'] + (float) $order->grand_total,
                ]);
            }

            $rows = $weeks->sortKeys()->values();

            return Inertia::render('owner/laporan/penjualan', [
                'tipe' => $tipe,
                'tanggal' => $tanggal,
                'bulan' => $bulan,
                'tahun' => $tahun,
                'rows' => $rows,
            ]);
        }

        if ($tipe === 'pertahun') {
            $orders = $query->get();

            $months = $orders->groupBy(fn ($o) => $o->tgl_pesanan->month)->map(function ($group, $month) {
                $barang = $group->sum(fn ($o) => $o->detailPesanans->sum('jumlah'));

                return [
                    'bulan' => Carbon::create()->month($month)->locale('id')->translatedFormat('F'),
                    'total_barang' => $barang,
                    'total_penjualan' => $group->sum('grand_total'),
                ];
            })->values();

            return Inertia::render('owner/laporan/penjualan', [
                'tipe' => $tipe,
                'tanggal' => $tanggal,
                'bulan' => (int) $bulan,
                'tahun' => (int) $tahun,
                'rows' => $months,
            ]);
        }

        $orders = $query->latest()->get();

        $totalPesanan = $orders->count();
        $totalPendapatan = $orders->sum('grand_total');
        $totalProdukTerjual = $orders->sum(fn ($o) => $o->detailPesanans->sum('jumlah'));

        return Inertia::render('owner/laporan/penjualan', [
            'tipe' => $tipe,
            'tanggal' => $tanggal,
            'bulan' => (int) $bulan,
            'tahun' => (int) $tahun,
            'orders' => $orders,
            'totalPesanan' => $totalPesanan,
            'totalPendapatan' => $totalPendapatan,
            'totalProdukTerjual' => $totalProdukTerjual,
        ]);
    }

    public function cetakPenjualan(Request $request)
    {
        $tipe = $request->tipe ?? 'perhari';
        $tanggal = $request->tanggal ?? today()->toDateString();
        $bulan = (int) ($request->bulan ?? now()->month);
        $tahun = (int) ($request->tahun ?? now()->year);

        $query = Pesanan::where('status', '!=', 'dibatalkan')
            ->with(['akun', 'detailPesanans.produk', 'detailPesanans.variasi']);

        $judulWaktu = '';

        if ($tipe === 'perhari') {
            $query->whereDate('tgl_pesanan', $tanggal);
            $judulWaktu = Carbon::parse($tanggal)->locale('id')->translatedFormat('l, d F Y');
        } elseif ($tipe === 'perbulan') {
            $query->whereMonth('tgl_pesanan', $bulan)
                ->whereYear('tgl_pesanan', $tahun);
            $judulWaktu = Carbon::create()->month($bulan)->locale('id')->translatedFormat('F').' '.$tahun;
        } else {
            $query->whereYear('tgl_pesanan', $tahun);
            $judulWaktu = (string) $tahun;
        }

        if ($tipe === 'perbulan') {
            $orders = $query->get();

            $weeks = collect();
            foreach ($orders as $order) {
                $week = $order->tgl_pesanan->weekOfMonth ?? $order->tgl_pesanan->weekNumberInMonth;
                if (! $weeks->has($week)) {
                    $weeks->put($week, ['minggu_ke' => 'Minggu Ke-'.$week, 'total_barang' => 0, 'total_penjualan' => 0]);
                }
                $current = $weeks->get($week);
                $barang = $order->detailPesanans->sum('jumlah');
                $weeks->put($week, [
                    'minggu_ke' => 'Minggu Ke-'.$week,
                    'total_barang' => $current['total_barang'] + $barang,
                    'total_penjualan' => $current['total_penjualan'] + (float) $order->grand_total,
                ]);
            }

            $rows = $weeks->sortKeys()->values();

            return Inertia::render('owner/laporan/cetak-penjualan', [
                'tipe' => $tipe,
                'judulWaktu' => $judulWaktu,
                'rows' => $rows,
                'owner' => $request->user(),
            ]);
        }

        if ($tipe === 'pertahun') {
            $orders = $query->get();

            $months = $orders->groupBy(fn ($o) => $o->tgl_pesanan->month)->map(function ($group, $month) {
                $barang = $group->sum(fn ($o) => $o->detailPesanans->sum('jumlah'));

                return [
                    'bulan' => Carbon::create()->month($month)->locale('id')->translatedFormat('F'),
                    'total_barang' => $barang,
                    'total_penjualan' => $group->sum('grand_total'),
                ];
            })->values();

            return Inertia::render('owner/laporan/cetak-penjualan', [
                'tipe' => $tipe,
                'judulWaktu' => $judulWaktu,
                'rows' => $months,
                'owner' => $request->user(),
            ]);
        }

        $orders = $query->latest()->get();

        return Inertia::render('owner/laporan/cetak-penjualan', [
            'tipe' => $tipe,
            'judulWaktu' => $judulWaktu,
            'orders' => $orders,
            'owner' => $request->user(),
        ]);
    }
}
