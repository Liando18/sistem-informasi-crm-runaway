<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Diskon extends Model
{
    protected $table = 'diskon';

    protected $primaryKey = 'id_diskon';

    protected $fillable = [
        'nama_diskon',
        'tipe',
        'nilai',
        'kode',
        'tanggal_mulai',
        'tanggal_berakhir',
        'min_belanja',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_berakhir' => 'date',
            'min_belanja' => 'decimal:2',
            'nilai' => 'decimal:2',
        ];
    }

    public function produks(): HasMany
    {
        return $this->hasMany(Produk::class, 'diskon_id', 'id_diskon');
    }
}
