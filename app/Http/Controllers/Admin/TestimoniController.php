<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimoni;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimoniController extends Controller
{
    public function index()
    {
        $testimonials = Testimoni::with(['akun', 'produk'])
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/testimoni/index', [
            'testimoni' => $testimonials,
        ]);
    }

    public function updateStatus(Request $request, Testimoni $testimoni)
    {
        $request->validate([
            'status' => 'required|in:disetujui,ditolak',
        ]);

        $testimoni->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status testimoni berhasil diperbarui');
    }

    public function destroy(Testimoni $testimoni)
    {
        $testimoni->delete();

        return redirect()->back()->with('success', 'Testimoni berhasil dihapus');
    }
}
