<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use App\Models\Pesanan;
use App\Services\ChatNotificationService;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PembayaranController extends Controller
{
    public function pilihMetode(Pesanan $pesanan)
    {
        if ($pesanan->akun_id !== auth()->id()) {
            abort(403);
        }

        if ($pesanan->pembayaran && $pesanan->pembayaran->status === 'sukses') {
            return to_route('pembayaran.sukses', $pesanan);
        }

        return Inertia::render('pembayaran/pilih', [
            'pesanan' => $pesanan->load('pembayaran'),
        ]);
    }

    public function snap(Request $request, Pesanan $pesanan)
    {
        if ($pesanan->akun_id !== auth()->id()) {
            abort(403);
        }

        if ($pesanan->pembayaran && $pesanan->pembayaran->status === 'sukses') {
            return to_route('pembayaran.sukses', $pesanan);
        }

        $pesanan->load('akun');

        if ($pesanan->pembayaran) {
            $pembayaran = $pesanan->pembayaran;
        } else {
            $pembayaran = Pembayaran::create([
                'pesanan_id' => $pesanan->id_pesanan,
                'jumlah' => $pesanan->grand_total,
                'status' => 'pending',
            ]);
        }

        $midtrans = app(MidtransService::class);
        $snap = $midtrans->createSnap($pesanan);

        $pembayaran->update([
            'snap_token' => $snap->token,
            'snap_redirect_url' => $snap->redirect_url,
        ]);

        return Inertia::render('pembayaran/snap', [
            'pesanan' => $pesanan->load('pembayaran'),
            'snapToken' => $pembayaran->snap_token,
            'snapRedirectUrl' => $pembayaran->snap_redirect_url,
            'metode' => null,
        ]);
    }

    public function callback(Request $request)
    {
        $midtrans = app(MidtransService::class);
        $notif = $midtrans->handleNotification();

        $transactionStatus = $notif->transaction_status;
        $orderId = $notif->order_id;
        $transactionId = $notif->transaction_id;

        $pesananId = explode('-', str_replace('ORDER-', '', $orderId))[0];
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
            $pesanan->update(['status' => 'dibayar']);

            $pesanan->load('akun');
            app(ChatNotificationService::class)->pembayaranDiterima(
                $pesanan->akun_id,
                $pesanan->akun->nama,
                $pesanan->id_pesanan
            );
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

    public function confirm(Pembayaran $pembayaran)
    {
        if ($pembayaran->pesanan->akun_id !== auth()->id()) {
            abort(403);
        }

        $isNew = $pembayaran->status !== 'sukses';

        if ($isNew) {
            $pembayaran->update([
                'status' => 'sukses',
                'tgl_bayar' => now(),
            ]);
            $pembayaran->pesanan->update(['status' => 'dibayar']);

            $pesanan = $pembayaran->pesanan->load('akun');
            app(ChatNotificationService::class)->pembayaranDiterima(
                $pesanan->akun_id,
                $pesanan->akun->nama,
                $pesanan->id_pesanan
            );
        }

        return to_route('pembayaran.sukses', $pembayaran->pesanan);
    }
}
