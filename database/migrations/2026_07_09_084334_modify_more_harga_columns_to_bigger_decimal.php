<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pesanan', function (Blueprint $table) {
            $table->decimal('grand_total', 12, 2)->change();
            $table->decimal('potongan', 12, 2)->default(0)->change();
        });

        Schema::table('detail_pesanan', function (Blueprint $table) {
            $table->decimal('subtotal', 12, 2)->change();
        });
    }

    public function down(): void
    {
        Schema::table('pesanan', function (Blueprint $table) {
            $table->decimal('grand_total', 8, 2)->change();
            $table->decimal('potongan', 8, 2)->default(0)->change();
        });

        Schema::table('detail_pesanan', function (Blueprint $table) {
            $table->decimal('subtotal', 8, 2)->change();
        });
    }
};
