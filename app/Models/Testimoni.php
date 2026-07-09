<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimoni extends Model
{
    protected $table = 'testimoni';

    protected $primaryKey = 'id_testimoni';

    protected $fillable = [
        'akun_id',
        'produk_id',
        'rating',
        'komentar',
        'status',
    ];

    public function akun(): BelongsTo
    {
        return $this->belongsTo(Akun::class, 'akun_id', 'id_akun');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'id_produk');
    }
}
