<?php

namespace App\Http\Controllers;

use App\Models\DetailPesanan;
use App\Models\Diskon;
use App\Models\Keranjang;
use App\Models\Pesanan;
use App\Models\ProdukVariasi;
use App\Services\OngkirSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesananController extends Controller
{
    public function checkout()
    {
        $items = Keranjang::where('akun_id', auth()->id())
            ->with(['produk.gambarUtama', 'produk.variasis', 'produk.diskon'])
            ->get();

        $total = $items->sum(function ($item) {
            return $item->produk->harga * $item->jumlah;
        });

        $diskons = Diskon::where('status', 'aktif')
            ->where('tanggal_mulai', '<=', now())
            ->where('tanggal_berakhir', '>=', now())
            ->get();

        $vouchers = Diskon::where('jenis_diskon', 'voucher_ongkir')
            ->where('status', 'aktif')
            ->where('tanggal_mulai', '<=', now())
            ->where('tanggal_berakhir', '>=', now())
            ->where(function ($q) {
                $q->whereNull('pemilik_id')->orWhere('pemilik_id', auth()->id());
            })
            ->where(function ($q) {
                $q->whereNull('maks_penggunaan')->orWhereRaw('digunakan < maks_penggunaan');
            })
            ->get();

        return Inertia::render('checkout/index', [
            'items' => $items,
            'total' => $total,
            'diskons' => $diskons,
            'vouchers' => $vouchers,
            'ongkirSetting' => OngkirSetting::get(),
        ]);
    }

    public function prosesCheckout(Request $request)
    {
        $request->validate([
            'provinsi' => 'required|string',
            'kabupaten' => 'required|string',
            'kecamatan' => 'required|string',
            'kelurahan' => 'required|string',
            'alamat_detail' => 'required|string',
            'no_telp_kirim' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'catatan' => 'nullable|string',
            'ongkir' => 'nullable|numeric|min:0',
            'jarak' => 'nullable|numeric|min:0',
            'voucher_id' => 'nullable|integer|exists:diskon,id_diskon',
        ]);

        $items = Keranjang::where('akun_id', auth()->id())
            ->with('produk.diskon')
            ->get();

        if ($items->isEmpty()) {
            return redirect()->back()->with('error', 'Keranjang belanja kosong');
        }

        $totalHarga = $items->sum(function ($item) {
            return $item->produk->harga * $item->jumlah;
        });

        $potongan = 0;
        $diskonId = null;

        foreach ($items as $item) {
            $diskon = $item->produk->diskon;
            if ($diskon && $diskon->status === 'aktif' && $diskon->tanggal_berakhir >= now()) {
                $sub = $item->produk->harga * $item->jumlah;
                if ($diskon->tipe === 'persen') {
                    $potongan += $sub * $diskon->nilai / 100;
                } else {
                    $potongan += min($diskon->nilai, $sub);
                }
            }
        }

        $potongan = min($potongan, $totalHarga);

        $grandTotal = $totalHarga - $potongan;
        $ongkir = $request->ongkir ?? 0;

        if ($request->voucher_id) {
            $voucher = Diskon::where('id_diskon', $request->voucher_id)
                ->where('jenis_diskon', 'voucher_ongkir')
                ->where('status', 'aktif')
                ->where('tanggal_mulai', '<=', now())
                ->where('tanggal_berakhir', '>=', now())
                ->where(function ($q) {
                    $q->whereNull('pemilik_id')->orWhere('pemilik_id', auth()->id());
                })
                ->first();

            if ($voucher) {
                $ongkir = 0;
                $voucher->increment('digunakan');
                if ($voucher->maks_penggunaan && $voucher->digunakan >= $voucher->maks_penggunaan) {
                    $voucher->update(['status' => 'nonaktif']);
                }
            }
        }

        $grandTotal = $totalHarga - $potongan + $ongkir;

        $pesanan = Pesanan::create([
            'akun_id' => auth()->id(),
            'diskon_id' => $diskonId,
            'tgl_pesanan' => now(),
            'status' => 'pending',
            'total_harga' => $totalHarga,
            'potongan' => $potongan,
            'grand_total' => $grandTotal,
            'ongkir' => $ongkir,
            'catatan' => $request->catatan,
            'provinsi' => $request->provinsi,
            'kabupaten' => $request->kabupaten,
            'kecamatan' => $request->kecamatan,
            'kelurahan' => $request->kelurahan,
            'alamat_detail' => $request->alamat_detail,
            'no_telp_kirim' => $request->no_telp_kirim,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        foreach ($items as $item) {
            DetailPesanan::create([
                'pesanan_id' => $pesanan->id_pesanan,
                'produk_id' => $item->produk_id,
                'produk_variasi_id' => $item->produk_variasi_id,
                'jumlah' => $item->jumlah,
                'harga' => $item->produk->harga,
                'subtotal' => $item->produk->harga * $item->jumlah,
            ]);

            if ($item->produk_variasi_id) {
                ProdukVariasi::find($item->produk_variasi_id)->decrement('stok', $item->jumlah);
            }
        }

        Keranjang::where('akun_id', auth()->id())->delete();

        return to_route('pembayaran.pilih', $pesanan);
    }

    public function index(Request $request)
    {
        $pesanans = Pesanan::where('akun_id', auth()->id())
            ->with(['detailPesanans.produk.gambarUtama', 'detailPesanans.variasi', 'pembayaran'])
            ->when($request->status && $request->status !== 'semua', function ($q) use ($request) {
                $q->where('status', $request->status);
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('pesanan/index', [
            'pesanan' => $pesanans,
            'filter' => $request->status ?? 'semua',
        ]);
    }

    public function show(Pesanan $pesanan)
    {
        if ($pesanan->akun_id !== auth()->id()) {
            abort(403);
        }

        $pesanan->load(['detailPesanans.produk.gambarUtama', 'detailPesanans.variasi', 'pembayaran', 'diskon']);

        return Inertia::render('pesanan/show', [
            'pesanan' => $pesanan,
        ]);
    }

    public function invoice(Pesanan $pesanan)
    {
        if ($pesanan->akun_id !== auth()->id() && ! in_array(auth()->user()->role, ['admin', 'owner'])) {
            abort(403);
        }

        $pesanan->load(['akun', 'detailPesanans.produk', 'detailPesanans.variasi', 'pembayaran', 'diskon']);

        return Inertia::render('pesanan/cetak-invoice', [
            'pesanan' => $pesanan,
        ]);
    }
}
