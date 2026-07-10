<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pesanan;
use App\Services\ChatNotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesananController extends Controller
{
    public function index(Request $request)
    {
        $pesanans = Pesanan::with('akun')
            ->when($request->search, function ($q, $search) {
                $q->whereHas('akun', function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($q, $status) {
                $q->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/pesanan/index', [
            'pesanan' => $pesanans,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(Pesanan $pesanan)
    {
        $pesanan->load(['akun', 'detailPesanans.produk.gambarUtama', 'detailPesanans.variasi', 'pembayaran', 'diskon']);

        return Inertia::render('admin/pesanan/show', [
            'pesanan' => $pesanan,
        ]);
    }

    public function updateStatus(Request $request, Pesanan $pesanan)
    {
        $request->validate([
            'status' => 'required|in:pending,dibayar,dipacking,dikirim,selesai,dibatalkan',
        ]);

        if ($request->status === 'dibatalkan' && $pesanan->status !== 'dibatalkan') {
            $pesanan->load('detailPesanans.variasi');

            foreach ($pesanan->detailPesanans as $detail) {
                if ($detail->variasi) {
                    $detail->variasi->increment('stok', $detail->jumlah);
                }
            }
        }

        $oldStatus = $pesanan->status;
        $pesanan->update(['status' => $request->status]);

        if ($oldStatus !== $request->status) {
            $pesanan->load('akun');
            $service = app(ChatNotificationService::class);

            match ($request->status) {
                'dipacking' => $service->prosesPacking($pesanan->akun_id, $pesanan->akun->nama, $pesanan->id_pesanan),
                'dikirim' => $service->pesananDikirim($pesanan->akun_id, $pesanan->akun->nama, $pesanan->id_pesanan),
                'selesai' => $service->pesananSelesai($pesanan->akun_id, $pesanan->akun->nama, $pesanan->id_pesanan),
                default => null,
            };
        }

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui');
    }
}
