<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('akun')->update(['password' => 'password']);

        Schema::table('akun', function (Blueprint $table) {
            $table->string('password', 10)->change();
        });
    }

    public function down(): void
    {
        Schema::table('akun', function (Blueprint $table) {
            $table->string('password')->change();
        });
    }
};
