<?php

namespace App\Http\Controllers;

use App\Models\Produk;
use App\Models\Testimoni;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimoniController extends Controller
{
    public function store(Request $request, Produk $produk)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string',
        ]);

        Testimoni::create([
            'akun_id' => auth()->id(),
            'produk_id' => $produk->id_produk,
            'rating' => $request->rating,
            'komentar' => $request->komentar,
            'status' => 'disetujui',
        ]);

        return redirect()->back()->with('success', 'Testimoni berhasil dikirim');
    }

    public function saya()
    {
        $testimonials = Testimoni::where('akun_id', auth()->id())
            ->with('produk')
            ->latest()
            ->paginate(10);

        return Inertia::render('testimoni/index', [
            'testimonials' => $testimonials,
        ]);
    }
}
