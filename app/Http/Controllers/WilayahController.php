<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;

class WilayahController extends Controller
{
    public function provinsi()
    {
        $response = Http::get('https://wilayah.id/api/provinces.json');

        return response()->json($response->json());
    }

    public function kabupaten($provinsi)
    {
        $response = Http::get("https://wilayah.id/api/regencies/{$provinsi}.json");

        return response()->json($response->json());
    }

    public function kecamatan($kabupaten)
    {
        $response = Http::get("https://wilayah.id/api/districts/{$kabupaten}.json");

        return response()->json($response->json());
    }

    public function kelurahan($kecamatan)
    {
        $response = Http::get("https://wilayah.id/api/villages/{$kecamatan}.json");

        return response()->json($response->json());
    }
}
