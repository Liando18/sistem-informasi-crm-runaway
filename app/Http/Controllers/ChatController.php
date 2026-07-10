<?php

namespace App\Http\Controllers;

use App\Models\Akun;
use App\Models\Chat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index(Request $request)
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
                'nama' => $partner->nama,
                'last_message' => $first->pesan,
                'waktu' => $first->created_at->diffForHumans(),
                'unread' => $messages->where('akun_penerima', $userId)->where('dibaca', false)->count(),
            ];
        })->values();

        $activeConversation = null;
        $messages = [];

        if ($request->dengan) {
            $partnerId = $request->dengan;
            $conversation = $conversations->firstWhere('id', (int) $partnerId);
            $activeConversation = $conversation;

            $messages = Chat::where(function ($q) use ($userId, $partnerId) {
                $q->where('akun_pengirim', $userId)->where('akun_penerima', $partnerId);
            })->orWhere(function ($q) use ($userId, $partnerId) {
                $q->where('akun_pengirim', $partnerId)->where('akun_penerima', $userId);
            })->with(['pengirim', 'penerima'])->orderBy('created_at')->get();

            Chat::where('akun_pengirim', $partnerId)
                ->where('akun_penerima', $userId)
                ->where('dibaca', false)
                ->update(['dibaca' => true]);
        }

        $admin = Akun::where('role', 'admin')->first(['id_akun', 'nama']);

        return Inertia::render('chat/index', [
            'conversations' => $conversations,
            'messages' => $messages,
            'activeConversation' => $activeConversation,
            'admin' => $admin,
        ]);
    }

    public function messagesJson(Request $request)
    {
        $userId = auth()->id();
        $partnerId = $request->dengan;

        if (! $partnerId) {
            return response()->json([]);
        }

        $messages = Chat::where(function ($q) use ($userId, $partnerId) {
            $q->where('akun_pengirim', $userId)->where('akun_penerima', $partnerId);
        })->orWhere(function ($q) use ($userId, $partnerId) {
            $q->where('akun_pengirim', $partnerId)->where('akun_penerima', $userId);
        })->with(['pengirim', 'penerima'])->orderBy('created_at')->get();

        Chat::where('akun_pengirim', $partnerId)
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
