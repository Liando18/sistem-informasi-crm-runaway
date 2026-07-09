<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use App\Models\Pesanan;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembayaranController extends Controller
{
    public function snap(Pesanan $pesanan)
    {
        if ($pesanan->akun_id !== auth()->id()) {
            abort(403);
        }

        $pesanan->load('akun');

        $midtrans = app(MidtransService::class);
        $snap = $midtrans->createSnap($pesanan);

        if ($pesanan->pembayaran) {
            $pembayaran = $pesanan->pembayaran;
        } else {
            $pembayaran = Pembayaran::create([
                'pesanan_id' => $pesanan->id_pesanan,
                'jumlah' => $pesanan->grand_total,
                'status' => 'pending',
            ]);
        }

        $pembayaran->update([
            'snap_token' => $snap->token,
            'snap_redirect_url' => $snap->redirect_url,
        ]);

        return Inertia::render('pembayaran/snap', [
            'pesanan' => $pesanan->load('pembayaran'),
            'snapToken' => $snap->token,
        ]);
    }

    public function callback(Request $request)
    {
        $midtrans = app(MidtransService::class);
        $notif = $midtrans->handleNotification();

        $transactionStatus = $notif->transaction_status;
        $orderId = $notif->order_id;
        $transactionId = $notif->transaction_id;

        $pesananId = str_replace('ORDER-', '', $orderId);
        $pesanan = Pesanan::find($pesananId);

        if (! $pesanan) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $pembayaran = $pesanan->pembayaran;

        if (! $pembayaran) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $pembayaran->update([
            'midtrans_transaction_id' => $transactionId,
            'midtrans_status' => $transactionStatus,
        ]);

        if (in_array($transactionStatus, ['settlement', 'capture'])) {
            $pembayaran->update([
                'status' => 'sukses',
                'tgl_bayar' => now(),
            ]);
            $pesanan->update(['status' => 'diproses']);
        } elseif (in_array($transactionStatus, ['expire', 'deny', 'cancel'])) {
            $pembayaran->update(['status' => 'gagal']);
            $pesanan->update(['status' => 'dibatalkan']);
        }

        return response()->json(['message' => 'OK'], 200);
    }

    public function sukses(Pesanan $pesanan)
    {
        return Inertia::render('pembayaran/sukses', [
            'pesanan' => $pesanan->load('pembayaran'),
        ]);
    }
}
