<?php

namespace App\Services;

use App\Models\Akun;
use App\Models\Chat;

class ChatNotificationService
{
    public function send(int $penerimaId, string $pesan): void
    {
        $admin = Akun::where('role', 'admin')->first();

        if (! $admin) {
            return;
        }

        Chat::create([
            'akun_pengirim' => $admin->id_akun,
            'akun_penerima' => $penerimaId,
            'pesan' => $pesan,
            'dibaca' => false,
        ]);
    }

    public function pembayaranDiterima(int $penerimaId, string $nama, string $noPesanan): void
    {
        $this->send(
            $penerimaId,
            "Halo {$nama}, terima kasih! Pembayaran untuk pesanan #{$noPesanan} sudah kami terima. Pesanan akan segera kami proses."
        );
    }

    public function prosesPacking(int $penerimaId, string $nama, string $noPesanan): void
    {
        $this->send(
            $penerimaId,
            "Halo {$nama}, pesanan #{$noPesanan} sedang dalam proses packing. Kami akan segera mengirimkannya."
        );
    }

    public function pesananDikirim(int $penerimaId, string $nama, string $noPesanan): void
    {
        $this->send(
            $penerimaId,
            "Halo {$nama}, pesanan #{$noPesanan} sudah dikirim! Silakan ditunggu ya."
        );
    }

    public function pesananSelesai(int $penerimaId, string $nama, string $noPesanan): void
    {
        $this->send(
            $penerimaId,
            "Halo {$nama}, terima kasih telah berbelanja di Runaway Denim! Jangan lupa berikan ulasan untuk produk yang kamu beli."
        );
    }
}
