<?php

namespace App\Console\Commands;

use App\Models\Akun;
use App\Services\VoucherService;
use Illuminate\Console\Command;

class BuatVoucherOtomatis extends Command
{
    protected $signature = 'voucher:buat-otomatis';

    protected $description = 'Cek dan buat voucher loyal untuk semua akun yang memenuhi syarat (5x transaksi / 500k spending)';

    public function handle(): int
    {
        $akuns = Akun::where('role', 'pelanggan')->get();
        $bar = $this->output->createProgressBar($akuns->count());
        $bar->start();

        $created = 0;
        foreach ($akuns as $akun) {
            VoucherService::cekDanBuatVoucherOtomatis($akun);
            $created++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Selesai! {$created} akun diperiksa.");

        return Command::SUCCESS;
    }
}
