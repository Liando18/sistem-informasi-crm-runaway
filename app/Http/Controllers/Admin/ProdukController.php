<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Diskon;
use App\Models\Kategori;
use App\Models\Produk;
use App\Models\ProdukGambar;
use App\Models\ProdukVariasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProdukController extends Controller
{
    public function index(Request $request)
    {
        $produks = Produk::with(['kategori', 'diskon', 'gambarUtama', 'variasis'])
            ->when($request->search, function ($q, $search) {
                $q->where('nama_produk', 'like', "%{$search}%");
            })
            ->when($request->kategori_id, function ($q, $kategoriId) {
                $q->where('kategori_id', $kategoriId);
            })
            ->paginate(10)
            ->withQueryString();

        $kategoris = Kategori::all();

        return Inertia::render('admin/produk/index', [
            'produks' => $produks,
            'kategoris' => $kategoris,
        ]);
    }

    public function create()
    {
        $kategoris = Kategori::all();
        $diskons = Diskon::where('status', 'aktif')->where('jenis_diskon', 'produk')->get();

        return Inertia::render('admin/produk/form', [
            'kategoris' => $kategoris,
            'diskons' => $diskons,
            'variasis' => [],
            'gambars' => [],
        ]);
    }

    public function store(Request $request)
    {
        $variasis = $request->input('variasis');
        if (is_string($variasis)) {
            $variasis = json_decode($variasis, true) ?? [];
            $request->merge(['variasis' => $variasis]);
        }

        $request->validate([
            'nama_produk' => 'required|string|max:30',
            'kategori_id' => 'required|exists:kategori,id_kategori',
            'diskon_id' => 'nullable|exists:diskon,id_diskon',
            'harga' => 'required|numeric|min:0',
            'stok' => 'nullable|integer|min:0',
            'deskripsi' => 'nullable|string',
            'gambars' => 'nullable|array|max:5',
            'gambars.*' => 'image|mimes:jpg,png,jpeg,webp|max:1024',
            'variasis' => 'nullable|array',
            'variasis.*.ukuran' => 'required|string|max:20',
            'variasis.*.warna' => 'required|string|max:30',
            'variasis.*.stok' => 'required|integer|min:0',
        ]);

        $data = $request->only(['nama_produk', 'kategori_id', 'harga', 'deskripsi']);
        $data['diskon_id'] = $request->filled('diskon_id') ? $request->diskon_id : null;

        if (empty($variasis)) {
            $data['stok'] = $request->stok ?? 0;
        } else {
            $data['stok'] = 0;
        }

        $produk = Produk::create($data);

        if ($request->hasFile('gambars')) {
            foreach ($request->file('gambars') as $index => $gambar) {
                $path = $gambar->store('produk', 'public');

                ProdukGambar::create([
                    'produk_id' => $produk->id_produk,
                    'gambar' => $path,
                    'is_utama' => $index === 0,
                ]);
            }
        }

        if ($variasis) {
            foreach ($variasis as $variasi) {
                ProdukVariasi::create([
                    'produk_id' => $produk->id_produk,
                    'ukuran' => $variasi['ukuran'],
                    'warna' => $variasi['warna'],
                    'stok' => $variasi['stok'],
                ]);
            }
        }

        return to_route('admin.produk.index')->with('success', 'Produk berhasil ditambahkan');
    }

    public function show(Produk $produk)
    {
        $produk->load(['kategori', 'diskon', 'gambars', 'variasis']);

        return Inertia::render('admin/produk/show', [
            'produk' => $produk,
        ]);
    }

    public function edit(Produk $produk)
    {
        $kategoris = Kategori::all();
        $diskons = Diskon::where('status', 'aktif')->where('jenis_diskon', 'produk')->get();

        $produk->load(['gambars', 'variasis']);

        return Inertia::render('admin/produk/form', [
            'produk' => $produk,
            'kategoris' => $kategoris,
            'diskons' => $diskons,
            'variasis' => $produk->variasis,
            'gambars' => $produk->gambars,
        ]);
    }

    public function update(Request $request, Produk $produk)
    {
        $variasis = $request->input('variasis');
        if (is_string($variasis)) {
            $variasis = json_decode($variasis, true) ?? [];
            $request->merge(['variasis' => $variasis]);
        }

        $request->validate([
            'nama_produk' => 'required|string|max:30',
            'kategori_id' => 'required|exists:kategori,id_kategori',
            'diskon_id' => 'nullable|exists:diskon,id_diskon',
            'harga' => 'required|numeric|min:0',
            'stok' => 'nullable|integer|min:0',
            'deskripsi' => 'nullable|string',
            'gambars' => 'nullable|array|max:5',
            'gambars.*' => 'image|mimes:jpg,png,jpeg,webp|max:1024',
            'variasis' => 'nullable|array',
            'variasis.*.ukuran' => 'required|string|max:20',
            'variasis.*.warna' => 'required|string|max:30',
            'variasis.*.stok' => 'required|integer|min:0',
        ]);

        $data = $request->only(['nama_produk', 'kategori_id', 'harga', 'deskripsi']);
        $data['diskon_id'] = $request->filled('diskon_id') ? $request->diskon_id : null;

        if (empty($variasis)) {
            $data['stok'] = $request->stok ?? 0;
        } else {
            $data['stok'] = 0;
        }

        $produk->update($data);

        if ($request->hasFile('gambars')) {
            foreach ($produk->gambars as $oldGambar) {
                Storage::disk('public')->delete($oldGambar->gambar);
            }

            $produk->gambars()->delete();

            foreach ($request->file('gambars') as $index => $gambar) {
                $path = $gambar->store('produk', 'public');

                ProdukGambar::create([
                    'produk_id' => $produk->id_produk,
                    'gambar' => $path,
                    'is_utama' => $index === 0,
                ]);
            }
        }

        if ($variasis) {
            $produk->variasis()->delete();

            foreach ($variasis as $variasi) {
                ProdukVariasi::create([
                    'produk_id' => $produk->id_produk,
                    'ukuran' => $variasi['ukuran'],
                    'warna' => $variasi['warna'],
                    'stok' => $variasi['stok'],
                ]);
            }
        }

        return to_route('admin.produk.index')->with('success', 'Produk berhasil diperbarui');
    }

    public function destroy(Produk $produk)
    {
        foreach ($produk->gambars as $gambar) {
            Storage::disk('public')->delete($gambar->gambar);
        }

        $produk->gambars()->delete();
        $produk->variasis()->delete();
        $produk->delete();

        return to_route('admin.produk.index')->with('success', 'Produk berhasil dihapus');
    }
}
