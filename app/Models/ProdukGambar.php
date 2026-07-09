<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProdukGambar extends Model
{
    protected $table = 'produk_gambar';

    protected $primaryKey = 'id_produk_gambar';

    protected $fillable = [
        'produk_id',
        'gambar',
        'is_utama',
    ];

    protected function casts(): array
    {
        return [
            'is_utama' => 'boolean',
        ];
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'produk_id', 'id_produk');
    }
}
