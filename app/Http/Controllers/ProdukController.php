<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Produk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index(Request $request)
    {
        $produks = Produk::with(['kategori', 'diskon', 'gambarUtama', 'gambarPertama'])
            ->when($request->kategori_id, function ($q, $kategoriId) {
                $q->where('kategori_id', $kategoriId);
            })
            ->when($request->search, function ($q, $search) {
                $q->where('nama_produk', 'like', "%{$search}%");
            })
            ->paginate(12)
            ->withQueryString();

        $kategoris = Kategori::all();

        return Inertia::render('produk/index', [
            'produks' => $produks,
            'kategoris' => $kategoris,
            'filters' => $request->only(['search', 'kategori_id']),
        ]);
    }

    public function show(Produk $produk)
    {
        $produk->load(['kategori', 'diskon', 'gambarUtama', 'gambars', 'variasis', 'testimonials.akun']);

        $rataRating = $produk->testimonials->where('status', 'disetujui')->avg('rating');

        return Inertia::render('produk/show', [
            'produk' => $produk,
            'rataRating' => round($rataRating, 1),
        ]);
    }
}
