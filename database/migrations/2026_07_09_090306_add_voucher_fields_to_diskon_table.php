<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('diskon', function (Blueprint $table) {
            if (! Schema::hasColumn('diskon', 'jenis_diskon')) {
                $table->enum('jenis_diskon', ['produk', 'voucher_ongkir'])->default('produk')->after('nama_diskon');
            }
            if (! Schema::hasColumn('diskon', 'pemilik_id')) {
                $table->unsignedInteger('pemilik_id')->nullable()->after('jenis_diskon');
                $table->foreign('pemilik_id')->references('id_akun')->on('akun')->onDelete('set null');
            }
            if (! Schema::hasColumn('diskon', 'maks_penggunaan')) {
                $table->unsignedInteger('maks_penggunaan')->nullable()->after('pemilik_id');
            }
            if (! Schema::hasColumn('diskon', 'digunakan')) {
                $table->unsignedInteger('digunakan')->default(0)->after('maks_penggunaan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('diskon', function (Blueprint $table) {
            $table->dropForeign(['pemilik_id']);
            $table->dropColumn(['jenis_diskon', 'pemilik_id', 'maks_penggunaan', 'digunakan']);
        });
    }
};
