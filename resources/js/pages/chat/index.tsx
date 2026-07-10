import { Head, usePage, router, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, ChevronRight, Phone } from 'lucide-react';

function timeAgo(date: string): string {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}j`;
    if (diff < 172800) return 'kemarin';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function messageTime(date: string): string {
    return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatIndex() {
    const { conversations, activeConversation, messages: initialMessages, admin } = usePage().props;
    const { auth } = usePage().props;
    const [selectedChat, setSelectedChat] = useState(activeConversation || null);
    const [messages, setMessages] = useState(initialMessages || []);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [showMobileList, setShowMobileList] = useState(!selectedChat);
    const userId = auth?.user?.id_akun || auth?.user?.id;

    const { data, setData, post, processing } = useForm({
        pesan: '',
        penerima_id: selectedChat?.id || '',
    });

    useEffect(() => {
        setData('penerima_id', selectedChat?.id || '');
    }, [selectedChat]);

    useEffect(() => {
        setMessages(initialMessages || []);
    }, [initialMessages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!selectedChat) return;
        const interval = setInterval(() => {
            fetch(`/chat/messages?dengan=${selectedChat.id}`, { headers: { Accept: 'application/json' } })
                .then(r => r.json())
                .then(data => { if (data.messages) setMessages(data.messages); })
                .catch(() => {});
        }, 1000);
        return () => clearInterval(interval);
    }, [selectedChat]);

    function selectChat(chat: any) {
        setSelectedChat(chat);
        setShowMobileList(false);
        router.get(`/chat?dengan=${chat.id}`, { preserveState: true });
    }

    function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!data.pesan.trim()) return;
        post('/chat/kirim', { preserveScroll: true, preserveState: true, onSuccess: () => setData('pesan', '') });
    }

    const chatList = conversations?.data || conversations || [];

    function startChatWithAdmin() {
        if (!admin) return;
        selectChat({ id: admin.id_akun, nama: admin.nama });
    }

    return (
        <>
            <Head title="Chat - Runaway Denim" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesan</h1>
                <p className="text-gray-500 mb-6">Hubungi tim Runaway Denim</p>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 260px)', minHeight: '520px' }}>
                    <div className="flex h-full">
                        <div className={`w-full md:w-72 border-r border-gray-100 flex-shrink-0 ${showMobileList ? 'block' : 'hidden md:block'}`}>
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 text-sm">Percakapan</h3>
                                {admin && (
                                    <button
                                        onClick={startChatWithAdmin}
                                        className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-all font-medium"
                                    >
                                        + Pesan Admin
                                    </button>
                                )}
                            </div>
                            <div className="overflow-y-auto h-[calc(100%-57px)]">
                                {chatList.length > 0 ? chatList.map((chat: any, i: number) => (
                                    <button
                                        key={chat.id || i}
                                        onClick={() => selectChat(chat)}
                                        className={`w-full text-left px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 flex items-center gap-3 ${
                                            selectedChat?.id === chat.id || (admin && selectedChat?.id === admin.id_akun && chatList.length === 0) ? 'bg-primary-50' : ''
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {chat.nama?.[0] || 'A'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-sm text-gray-900 truncate">{chat.nama || 'Admin'}</p>
                                                <span className="text-xs text-gray-400 shrink-0">{chat.waktu || timeAgo(chat.created_at)}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{chat.last_message || 'Tidak ada pesan'}</p>
                                        </div>
                                        {chat.unread > 0 && (
                                            <span className="bg-primary-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shrink-0">
                                                {chat.unread}
                                            </span>
                                        )}
                                    </button>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                                            <MessageCircle className="h-7 w-7 text-gray-300" />
                                        </div>
                                        <p className="text-sm text-gray-400 mb-4">Belum ada percakapan</p>
                                        {admin && (
                                            <button
                                                onClick={startChatWithAdmin}
                                                className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all shadow-lg"
                                            >
                                                <MessageCircle size={16} />
                                                Hubungi Admin
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`flex-1 flex flex-col ${!showMobileList ? 'block' : 'hidden md:flex'}`}>
                            {selectedChat ? (
                                <>
                                    <div className="p-3 border-b border-gray-100 flex items-center gap-3 bg-white">
                                        <button onClick={() => setShowMobileList(true)} className="md:hidden text-gray-500 hover:text-gray-700 p-1">
                                            <ChevronRight size={20} className="rotate-180" />
                                        </button>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {selectedChat.nama?.[0] || 'A'}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold text-sm text-gray-900">{selectedChat.nama || 'Admin'}</span>
                                            <p className="text-xs text-gray-400">Online</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-gray-100">
                                        {messages.map((msg: any, i: number) => {
                                            const isMine = msg.akun_pengirim === userId;
                                            return (
                                                <div key={msg.id_chat || i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] px-3.5 py-2.5 text-sm leading-relaxed ${
                                                        isMine
                                                            ? 'bg-primary-600 text-white rounded-2xl rounded-br-sm'
                                                            : 'bg-white text-gray-900 rounded-2xl rounded-bl-sm shadow-sm border border-gray-50'
                                                    }`}>
                                                        {msg.pesan}
                                                        <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-primary-200' : 'text-gray-400'}`}>
                                                            {messageTime(msg.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={chatEndRef} />
                                    </div>

                                    <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex gap-2">
                                        <input
                                            type="text"
                                            value={data.pesan}
                                            onChange={(e) => setData('pesan', e.target.value)}
                                            placeholder="Ketik pesan..."
                                            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-gray-50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing || !data.pesan.trim()}
                                            className="bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50 shadow-sm"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                            <MessageCircle className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <p className="font-medium text-gray-500">Pilih Percakapan</p>
                                        <p className="text-sm text-gray-400 mt-1">Pilih percakapan untuk mulai chat</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
