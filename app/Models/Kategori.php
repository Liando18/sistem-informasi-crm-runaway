<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kategori extends Model
{
    protected $table = 'kategori';

    protected $primaryKey = 'id_kategori';

    protected $fillable = [
        'nama_kategori',
        'deskripsi',
    ];

    public function getRouteKeyName(): string
    {
        return 'id_kategori';
    }

    public function produks(): HasMany
    {
        return $this->hasMany(Produk::class, 'kategori_id', 'id_kategori');
    }
}
