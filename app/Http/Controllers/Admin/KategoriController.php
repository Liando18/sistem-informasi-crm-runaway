<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index(Request $request)
    {
        $kategoris = Kategori::when($request->search, function ($q, $search) {
            $q->where('nama_kategori', 'like', "%{$search}%");
        })->paginate(10)->withQueryString();

        return Inertia::render('admin/kategori/index', [
            'kategori' => $kategoris,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/kategori/form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:30',
            'deskripsi' => 'nullable|string',
        ]);

        Kategori::create($request->only('nama_kategori', 'deskripsi'));

        return to_route('admin.kategori.index')->with('success', 'Kategori berhasil ditambahkan');
    }

    public function show(Kategori $kategori)
    {
        return Inertia::render('admin/kategori/show', [
            'kategori' => $kategori,
        ]);
    }

    public function edit(Kategori $kategori)
    {
        return Inertia::render('admin/kategori/form', [
            'kategori' => $kategori,
        ]);
    }

    public function update(Request $request, Kategori $kategori)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:30',
            'deskripsi' => 'nullable|string',
        ]);

        $kategori->update($request->only('nama_kategori', 'deskripsi'));

        return to_route('admin.kategori.index')->with('success', 'Kategori berhasil diperbarui');
    }

    public function destroy(Kategori $kategori)
    {
        if ($kategori->produks()->count() > 0) {
            return redirect()->back()->with('error', 'Kategori tidak dapat dihapus karena masih memiliki produk');
        }

        $kategori->delete();

        return to_route('admin.kategori.index')->with('success', 'Kategori berhasil dihapus');
    }
}
