<?php

namespace App\Services;

use App\Models\Akun;
use App\Models\Diskon;

class VoucherService
{
    public static function buatVoucherNewUser(Akun $akun): void
    {
        for ($i = 1; $i <= 2; $i++) {
            Diskon::create([
                'nama_diskon' => 'Voucher New #'.$i,
                'jenis_diskon' => 'voucher_ongkir',
                'pemilik_id' => $akun->id_akun,
                'maks_penggunaan' => 1,
                'tipe' => 'nominal',
                'nilai' => 0,
                'tanggal_mulai' => now(),
                'tanggal_berakhir' => now()->addMonths(3),
                'min_belanja' => 0,
                'status' => 'aktif',
            ]);
        }
    }

    public static function buatVoucherLoyal(Akun $akun): void
    {
        $sudahAda = Diskon::where('pemilik_id', $akun->id_akun)
            ->where('nama_diskon', 'like', 'Voucher Loyal%')
            ->where('status', 'aktif')
            ->exists();

        if ($sudahAda) {
            return;
        }

        Diskon::create([
            'nama_diskon' => 'Voucher Loyal',
            'jenis_diskon' => 'voucher_ongkir',
            'pemilik_id' => $akun->id_akun,
            'maks_penggunaan' => 1,
            'tipe' => 'nominal',
            'nilai' => 0,
            'tanggal_mulai' => now(),
            'tanggal_berakhir' => now()->addMonths(6),
            'min_belanja' => 0,
            'status' => 'aktif',
        ]);
    }

    public static function cekDanBuatVoucherOtomatis(Akun $akun): void
    {
        $totalTransaksi = $akun->pesanans()->whereIn('status', ['selesai', 'dikirim', 'dibayar'])->count();
        $totalBelanja = $akun->pesanans()->whereIn('status', ['selesai', 'dikirim', 'dibayar'])->sum('grand_total');

        if ($totalTransaksi >= 5 || $totalBelanja >= 500000) {
            self::buatVoucherLoyal($akun);
        }
    }
}
