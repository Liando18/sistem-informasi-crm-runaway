<?php

namespace App\Services;

use App\Models\Pesanan;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createSnap(Pesanan $pesanan): object
    {
        $params = [
            'transaction_details' => [
                'order_id' => 'ORDER-'.$pesanan->id_pesanan,
                'gross_amount' => (int) $pesanan->grand_total,
            ],
            'customer_details' => [
                'first_name' => $pesanan->akun->nama,
                'email' => $pesanan->akun->email,
                'phone' => $pesanan->akun->no_telp,
            ],
        ];

        return Snap::createTransaction($params);
    }

    public function handleNotification(): object
    {
        return new Notification;
    }
}
