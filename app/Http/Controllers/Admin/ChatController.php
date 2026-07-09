<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use App\Models\Chat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $receivedChats = Chat::where('akun_penerima', auth()->id())
            ->with('pengirim')
            ->latest()
            ->get();

        $conversations = $receivedChats->groupBy('akun_pengirim')->map(function ($messages) {
            $customer = $messages->first()->pengirim;

            return [
                'id' => $customer->id_akun,
                'user_id' => $customer->id_akun,
                'nama' => $customer->nama,
                'last_message' => $messages->first()->pesan,
                'pesan_terakhir' => $messages->first()->pesan,
                'waktu' => $messages->first()->created_at->diffForHumans(),
                'unread' => $messages->where('dibaca', false)->count(),
            ];
        })->values();

        return Inertia::render('admin/chat/index', [
            'conversations' => $conversations,
        ]);
    }

    public function show(Akun $akun)
    {
        $messages = Chat::where(function ($q) use ($akun) {
            $q->where('akun_pengirim', auth()->id())
                ->where('akun_penerima', $akun->id_akun);
        })->orWhere(function ($q) use ($akun) {
            $q->where('akun_pengirim', $akun->id_akun)
                ->where('akun_penerima', auth()->id());
        })->with(['pengirim', 'penerima'])->orderBy('created_at')->get();

        Chat::where('akun_pengirim', $akun->id_akun)
            ->where('akun_penerima', auth()->id())
            ->where('dibaca', false)
            ->update(['dibaca' => true]);

        return Inertia::render('admin/chat/show', [
            'messages' => $messages,
            'akun' => $akun,
        ]);
    }

    public function kirim(Request $request)
    {
        $request->validate([
            'pesan' => 'required|string',
            'penerima_id' => 'required|exists:akun,id_akun',
        ]);

        Chat::create([
            'akun_pengirim' => auth()->id(),
            'akun_penerima' => $request->penerima_id,
            'pesan' => $request->pesan,
            'dibaca' => false,
        ]);

        return redirect()->back()->with('success', 'Pesan berhasil dikirim');
    }
}
