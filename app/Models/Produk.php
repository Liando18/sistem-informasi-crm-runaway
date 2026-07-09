<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Produk extends Model
{
    protected $table = 'produk';

    protected $primaryKey = 'id_produk';

    protected $fillable = [
        'kategori_id',
        'diskon_id',
        'nama_produk',
        'deskripsi',
        'harga',
        'stok',
    ];

    protected function casts(): array
    {
        return [
            'harga' => 'decimal:2',
        ];
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'kategori_id', 'id_kategori');
    }

    public function diskon(): BelongsTo
    {
        return $this->belongsTo(Diskon::class, 'diskon_id', 'id_diskon');
    }

    public function keranjangs(): HasMany
    {
        return $this->hasMany(Keranjang::class, 'produk_id', 'id_produk');
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimoni::class, 'produk_id', 'id_produk');
    }

    public function gambarUtama(): HasOne
    {
        return $this->hasOne(ProdukGambar::class, 'produk_id', 'id_produk')->where('is_utama', true);
    }

    public function gambarPertama(): HasOne
    {
        return $this->hasOne(ProdukGambar::class, 'produk_id', 'id_produk')->oldest('id_produk_gambar');
    }

    public function gambars(): HasMany
    {
        return $this->hasMany(ProdukGambar::class, 'produk_id', 'id_produk');
    }

    public function variasis(): HasMany
    {
        return $this->hasMany(ProdukVariasi::class, 'produk_id', 'id_produk');
    }
}
