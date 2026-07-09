<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Diskon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiskonController extends Controller
{
    public function index(Request $request)
    {
        $diskons = Diskon::when($request->search, function ($q, $search) {
            $q->where('nama_diskon', 'like', "%{$search}%");
        })->paginate(10)->withQueryString();

        return Inertia::render('admin/diskon/index', [
            'diskon' => $diskons,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/diskon/form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_diskon' => 'required|string|max:30',
            'tipe' => 'required|in:persen,nominal',
            'nilai' => 'required|numeric|min:0',
            'kode' => 'required|string|max:30|unique:diskon,kode',
            'tanggal_mulai' => 'required|date',
            'tanggal_berakhir' => 'required|date|after_or_equal:tanggal_mulai',
            'min_belanja' => 'nullable|numeric',
            'status' => 'nullable|in:aktif,nonaktif',
        ]);

        $data = $request->all();
        $data['status'] = $request->status ?? 'aktif';

        Diskon::create($data);

        return to_route('admin.diskon.index')->with('success', 'Diskon berhasil ditambahkan');
    }

    public function show(Diskon $diskon)
    {
        return Inertia::render('admin/diskon/show', [
            'diskon' => $diskon,
        ]);
    }

    public function edit(Diskon $diskon)
    {
        return Inertia::render('admin/diskon/form', [
            'diskon' => $diskon,
        ]);
    }

    public function update(Request $request, Diskon $diskon)
    {
        $request->validate([
            'nama_diskon' => 'required|string|max:30',
            'tipe' => 'required|in:persen,nominal',
            'nilai' => 'required|numeric|min:0',
            'kode' => 'required|string|max:30|unique:diskon,kode,'.$diskon->id_diskon.',id_diskon',
            'tanggal_mulai' => 'required|date',
            'tanggal_berakhir' => 'required|date|after_or_equal:tanggal_mulai',
            'min_belanja' => 'nullable|numeric',
            'status' => 'nullable|in:aktif,nonaktif',
        ]);

        $diskon->update($request->all());

        return to_route('admin.diskon.index')->with('success', 'Diskon berhasil diperbarui');
    }

    public function destroy(Diskon $diskon)
    {
        $diskon->delete();

        return to_route('admin.diskon.index')->with('success', 'Diskon berhasil dihapus');
    }
}
