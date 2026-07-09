<?php

namespace App\Http\Controllers;

use App\Models\Akun;
use App\Models\Chat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $chats = Chat::where('akun_pengirim', auth()->id())
            ->orWhere('akun_penerima', auth()->id())
            ->with(['pengirim', 'penerima'])
            ->latest()
            ->get();

        $conversations = $chats->groupBy(function ($chat) {
            return $chat->akun_pengirim === auth()->id()
                ? $chat->akun_penerima
                : $chat->akun_pengirim;
        })->map(function ($messages, $partnerId) {
            $partner = $messages->first()->akun_pengirim === auth()->id()
                ? $messages->first()->penerima
                : $messages->first()->pengirim;

            return [
                'partner' => $partner,
                'latest_message' => $messages->first(),
                'unread' => $messages->where('akun_penerima', auth()->id())->where('dibaca', false)->count(),
            ];
        })->values();

        return Inertia::render('chat/index', [
            'conversations' => $conversations,
        ]);
    }

    public function kirim(Request $request)
    {
        $request->validate([
            'pesan' => 'required|string',
            'penerima_id' => 'required|exists:akun,id_akun',
        ]);

        $penerima = Akun::find($request->penerima_id);

        if ($penerima->role !== 'admin') {
            return redirect()->back()->with('error', 'Hanya dapat mengirim pesan ke admin');
        }

        Chat::create([
            'akun_pengirim' => auth()->id(),
            'akun_penerima' => $request->penerima_id,
            'pesan' => $request->pesan,
            'dibaca' => false,
        ]);

        return redirect()->back()->with('success', 'Pesan berhasil dikirim');
    }
}
