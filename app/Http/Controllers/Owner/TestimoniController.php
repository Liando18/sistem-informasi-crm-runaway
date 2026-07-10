<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\Testimoni;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimoniController extends Controller
{
    public function index()
    {
        $testimoni = Testimoni::with(['akun', 'produk'])
            ->latest()
            ->paginate(10);

        return Inertia::render('owner/testimoni/index', [
            'testimoni' => $testimoni,
        ]);
    }

    public function updateStatus(Request $request, Testimoni $testimoni)
    {
        $request->validate(['status' => 'required|in:disetujui,ditolak']);

        $testimoni->update(['status' => $request->status]);

        return back();
    }

    public function destroy(Testimoni $testimoni)
    {
        $testimoni->delete();

        return back();
    }
}
