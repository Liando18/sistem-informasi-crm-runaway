<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use App\Models\Produk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KeranjangController extends Controller
{
    public function index()
    {
        $items = Keranjang::where('akun_id', auth()->id())
            ->with(['produk.gambarUtama', 'produk.variasis'])
            ->get();

        return Inertia::render('keranjang/index', [
            'keranjang' => $items,
        ]);
    }

    public function tambah(Request $request, Produk $produk)
    {
        $request->validate([
            'jumlah' => 'required|integer|min:1',
            'produk_variasi_id' => 'nullable|integer|exists:produk_variasi,id_produk_variasi',
        ]);

        $existing = Keranjang::where('akun_id', auth()->id())
            ->where('produk_id', $produk->id_produk)
            ->where('produk_variasi_id', $request->produk_variasi_id)
            ->first();

        if ($existing) {
            $existing->increment('jumlah', $request->jumlah);
        } else {
            Keranjang::create([
                'akun_id' => auth()->id(),
                'produk_id' => $produk->id_produk,
                'produk_variasi_id' => $request->produk_variasi_id,
                'jumlah' => $request->jumlah,
            ]);
        }

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan ke keranjang');
    }

    public function update(Request $request, Keranjang $keranjang)
    {
        if ($keranjang->akun_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'jumlah' => 'required|integer|min:1',
        ]);

        $keranjang->update(['jumlah' => $request->jumlah]);

        return redirect()->back()->with('success', 'Jumlah berhasil diperbarui');
    }

    public function hapus(Keranjang $keranjang)
    {
        if ($keranjang->akun_id !== auth()->id()) {
            abort(403);
        }

        $keranjang->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus dari keranjang');
    }
}
