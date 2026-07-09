<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class KontakController extends Controller
{
    public function index()
    {
        return Inertia::render('kontak');
    }
}
