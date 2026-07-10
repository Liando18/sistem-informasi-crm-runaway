<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Diskon;
use App\Services\OngkirSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiskonController extends Controller
{
    public function index(Request $request)
    {
        $diskons = Diskon::with('pemilik')
            ->when($request->search, function ($q, $search) {
                $q->where('nama_diskon', 'like', "%{$search}%");
            })->latest()->paginate(10)->withQueryString();

        return Inertia::render('admin/diskon/index', [
            'diskon' => $diskons,
            'filters' => $request->only(['search']),
            'ongkirSetting' => OngkirSetting::get(),
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
            'jenis_diskon' => 'required|in:produk,voucher_ongkir',
            'maks_penggunaan' => 'nullable|integer|min:1',
            'tipe' => 'nullable|in:persen,nominal',
            'nilai' => 'nullable|numeric|min:0',
            'tanggal_mulai' => 'required|date',
            'tanggal_berakhir' => 'required|date|after_or_equal:tanggal_mulai',
            'min_belanja' => 'nullable|numeric',
            'status' => 'nullable|in:aktif,nonaktif',
        ]);

        Diskon::create([
            'nama_diskon' => $request->nama_diskon,
            'jenis_diskon' => $request->jenis_diskon,
            'maks_penggunaan' => $request->maks_penggunaan,
            'tipe' => $request->jenis_diskon === 'voucher_ongkir' ? 'nominal' : ($request->tipe ?? 'nominal'),
            'nilai' => $request->jenis_diskon === 'voucher_ongkir' ? 0 : ($request->nilai ?? 0),
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_berakhir' => $request->tanggal_berakhir,
            'min_belanja' => $request->filled('min_belanja') ? $request->min_belanja : 0,
            'status' => $request->status ?? 'aktif',
        ]);

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
            'jenis_diskon' => 'required|in:produk,voucher_ongkir',
            'maks_penggunaan' => 'nullable|integer|min:1',
            'tipe' => 'nullable|in:persen,nominal',
            'nilai' => 'nullable|numeric|min:0',
            'tanggal_mulai' => 'required|date',
            'tanggal_berakhir' => 'required|date|after_or_equal:tanggal_mulai',
            'min_belanja' => 'nullable|numeric',
            'status' => 'nullable|in:aktif,nonaktif',
        ]);

        $diskon->update([
            'nama_diskon' => $request->nama_diskon,
            'jenis_diskon' => $request->jenis_diskon,
            'maks_penggunaan' => $request->maks_penggunaan,
            'tipe' => $request->jenis_diskon === 'voucher_ongkir' ? 'nominal' : ($request->tipe ?? 'nominal'),
            'nilai' => $request->jenis_diskon === 'voucher_ongkir' ? 0 : ($request->nilai ?? 0),
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_berakhir' => $request->tanggal_berakhir,
            'min_belanja' => $request->min_belanja ?? 0,
            'status' => $request->status ?? 'aktif',
        ]);

        return to_route('admin.diskon.index')->with('success', 'Diskon berhasil diperbarui');
    }

    public function updateOngkirSetting(Request $request)
    {
        $data = $request->validate([
            'jarak_gratis' => 'required|numeric|min:0',
            'ongkir_per_km' => 'required|numeric|min:0',
            'jarak_per_kenaikan' => 'required|numeric|min:1',
        ]);

        OngkirSetting::save($data);

        return to_route('admin.diskon.index')->with('success', 'Setting ongkir berhasil disimpan');
    }

    public function destroy(Diskon $diskon)
    {
        $diskon->delete();

        return to_route('admin.diskon.index')->with('success', 'Diskon berhasil dihapus');
    }
}
