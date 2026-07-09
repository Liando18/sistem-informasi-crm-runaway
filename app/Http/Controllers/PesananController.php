<?php

namespace App\Http\Controllers;

use App\Models\DetailPesanan;
use App\Models\Diskon;
use App\Models\Keranjang;
use App\Models\Pesanan;
use App\Models\ProdukVariasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesananController extends Controller
{
    public function checkout()
    {
        $items = Keranjang::where('akun_id', auth()->id())
            ->with(['produk.gambarUtama', 'produk.variasis'])
            ->get();

        $total = $items->sum(function ($item) {
            return $item->produk->harga * $item->jumlah;
        });

        $diskons = Diskon::where('status', 'aktif')
            ->where('tanggal_mulai', '<=', now())
            ->where('tanggal_berakhir', '>=', now())
            ->get();

        return Inertia::render('checkout/index', [
            'items' => $items,
            'total' => $total,
            'diskons' => $diskons,
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
            'kode_diskon' => 'nullable|string|exists:diskon,kode',
        ]);

        $items = Keranjang::where('akun_id', auth()->id())
            ->with('produk')
            ->get();

        if ($items->isEmpty()) {
            return redirect()->back()->with('error', 'Keranjang belanja kosong');
        }

        $totalHarga = $items->sum(function ($item) {
            return $item->produk->harga * $item->jumlah;
        });

        $potongan = 0;
        $diskonId = null;

        if ($request->kode_diskon) {
            $diskon = Diskon::where('kode', $request->kode_diskon)->first();

            if (! $diskon || $diskon->status !== 'aktif' || $diskon->tanggal_berakhir < now()) {
                return redirect()->back()->with('error', 'Kode diskon tidak valid atau sudah kadaluarsa');
            }

            if ($diskon->min_belanja && $totalHarga < $diskon->min_belanja) {
                return redirect()->back()->with('error', 'Minimal belanja Rp '.number_format($diskon->min_belanja, 0, ',', '.').' untuk menggunakan kode ini');
            }

            if ($diskon->tipe === 'persen') {
                $potongan = $totalHarga * $diskon->nilai / 100;
            } else {
                $potongan = $diskon->nilai;
            }

            $potongan = min($potongan, $totalHarga);
            $diskonId = $diskon->id_diskon;
        }

        $grandTotal = $totalHarga - $potongan;

        $pesanan = Pesanan::create([
            'akun_id' => auth()->id(),
            'diskon_id' => $diskonId,
            'tgl_pesanan' => now(),
            'status' => 'pending',
            'total_harga' => $totalHarga,
            'potongan' => $potongan,
            'grand_total' => $grandTotal,
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

            ProdukVariasi::find($item->produk_variasi_id)->decrement('stok', $item->jumlah);
        }

        Keranjang::where('akun_id', auth()->id())->delete();

        return to_route('pembayaran.snap', $pesanan);
    }

    public function index()
    {
        $pesanans = Pesanan::where('akun_id', auth()->id())
            ->with(['detailPesanans.produk.gambarUtama', 'detailPesanans.variasi', 'pembayaran'])
            ->latest()
            ->paginate(10);

        return Inertia::render('pesanan/index', [
            'pesanans' => $pesanans,
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
}
