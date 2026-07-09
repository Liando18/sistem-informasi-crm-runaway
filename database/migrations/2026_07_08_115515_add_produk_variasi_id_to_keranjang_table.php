<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('keranjang', function (Blueprint $table) {
            $table->integer('produk_variasi_id')->nullable()->after('produk_id');
            $table->foreign('produk_variasi_id')->references('id_produk_variasi')->on('produk_variasi')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('keranjang', function (Blueprint $table) {
            $table->dropForeign(['produk_variasi_id']);
            $table->dropColumn('produk_variasi_id');
        });
    }
};
