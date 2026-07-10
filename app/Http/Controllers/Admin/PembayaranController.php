<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembayaranController extends Controller
{
    public function index(Request $request)
    {
        $pembayarans = Pembayaran::with('pesanan.akun')
            ->when($request->search, function ($q, $search) {
                $q->where('pesanan_id', 'like', "%{$search}%");
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/pembayaran/index', [
            'pembayaran' => $pembayarans,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function konfirmasi(Pembayaran $pembayaran)
    {
        $pembayaran->update([
            'status' => 'sukses',
            'tgl_bayar' => now(),
        ]);

        $pembayaran->pesanan->update(['status' => 'dibayar']);

        return redirect()->back()->with('success', 'Pembayaran berhasil dikonfirmasi');
    }
}
