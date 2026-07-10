<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Akun;
use App\Models\Chat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    private function getConversations()
    {
        $userId = auth()->id();

        $chats = Chat::where('akun_pengirim', $userId)
            ->orWhere('akun_penerima', $userId)
            ->with(['pengirim', 'penerima'])
            ->latest()
            ->get();

        $conversations = $chats->groupBy(function ($chat) use ($userId) {
            return $chat->akun_pengirim === $userId
                ? $chat->akun_penerima
                : $chat->akun_pengirim;
        })->map(function ($messages) use ($userId) {
            $first = $messages->first();
            $partner = $first->akun_pengirim === $userId ? $first->penerima : $first->pengirim;

            return [
                'id' => $partner->id_akun,
                'user_id' => $partner->id_akun,
                'id_akun' => $partner->id_akun,
                'nama' => $partner->nama,
                'last_message' => $first->pesan,
                'pesan_terakhir' => $first->pesan,
                'waktu' => $first->created_at->diffForHumans(),
                'unread' => $messages->where('akun_penerima', $userId)->where('dibaca', false)->count(),
            ];
        })->values();

        return $conversations;
    }

    public function index()
    {
        $pelanggan = Akun::where('role', 'pelanggan')
            ->orderBy('nama')
            ->get(['id_akun', 'nama']);

        return Inertia::render('admin/chat/index', [
            'conversations' => $this->getConversations(),
            'pelanggan' => $pelanggan,
        ]);
    }

    public function show(Akun $akun)
    {
        $userId = auth()->id();

        $messages = Chat::where(function ($q) use ($akun, $userId) {
            $q->where('akun_pengirim', $userId)
                ->where('akun_penerima', $akun->id_akun);
        })->orWhere(function ($q) use ($akun, $userId) {
            $q->where('akun_pengirim', $akun->id_akun)
                ->where('akun_penerima', $userId);
        })->with(['pengirim', 'penerima'])->orderBy('created_at')->get();

        Chat::where('akun_pengirim', $akun->id_akun)
            ->where('akun_penerima', $userId)
            ->where('dibaca', false)
            ->update(['dibaca' => true]);

        $pelanggan = Akun::where('role', 'pelanggan')
            ->orderBy('nama')
            ->get(['id_akun', 'nama']);

        return Inertia::render('admin/chat/show', [
            'messages' => $messages,
            'akun' => $akun,
            'conversations' => $this->getConversations(),
            'pelanggan' => $pelanggan,
        ]);
    }

    public function messagesJson(Akun $akun)
    {
        $userId = auth()->id();

        $messages = Chat::where(function ($q) use ($akun, $userId) {
            $q->where('akun_pengirim', $userId)
                ->where('akun_penerima', $akun->id_akun);
        })->orWhere(function ($q) use ($akun, $userId) {
            $q->where('akun_pengirim', $akun->id_akun)
                ->where('akun_penerima', $userId);
        })->with(['pengirim', 'penerima'])->orderBy('created_at')->get();

        Chat::where('akun_pengirim', $akun->id_akun)
            ->where('akun_penerima', $userId)
            ->where('dibaca', false)
            ->update(['dibaca' => true]);

        return response()->json([
            'messages' => $messages,
            'userId' => $userId,
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
