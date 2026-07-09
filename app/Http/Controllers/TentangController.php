<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TentangController extends Controller
{
    public function index()
    {
        return Inertia::render('tentang');
    }
}
