<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('akun', function (Blueprint $table) {
            $table->unsignedInteger('id_akun', true);
            $table->string('nama', 30);
            $table->string('email', 20)->unique();
            $table->string('password', 10);
            $table->enum('role', ['pelanggan', 'admin', 'owner'])->default('pelanggan');
            $table->string('no_telp', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('akun');
    }
};
