import { Head, usePage, router, useForm } from '@inertiajs/react';
import { useRef, useEffect, useState } from 'react';
import { Send, ArrowLeft, MessageCircle, Search, ChevronRight } from 'lucide-react';

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

export default function AdminChatShow() {
    const { akun, messages: initialMessages, conversations: initialConversations, pelanggan: initialPelanggan } = usePage().props;
    const { auth } = usePage().props;
    const [selectedAkun, setSelectedAkun] = useState(akun || null);
    const [messages, setMessages] = useState(initialMessages || []);
    const [search, setSearch] = useState('');
    const [newChatSearch, setNewChatSearch] = useState('');
    const [showNewChat, setShowNewChat] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const userId = auth?.user?.id_akun || auth?.user?.id;
    const [showMobileList, setShowMobileList] = useState(false);

    const { data, setData, post, processing } = useForm({
        pesan: '',
        penerima_id: selectedAkun?.id_akun || '',
    });

    const conversations = initialConversations?.data || initialConversations || [];
    const pelanggan = initialPelanggan?.data || initialPelanggan || [];

    const filteredPelanggan = pelanggan.filter((p: any) =>
        !newChatSearch || (p.nama || '').toLowerCase().includes(newChatSearch.toLowerCase())
    );

    function startNewChat(customer: any) {
        setShowNewChat(false);
        setNewChatSearch('');
        selectAkun(customer);
    }

    useEffect(() => {
        setData('penerima_id', selectedAkun?.id_akun || '');
    }, [selectedAkun]);

    useEffect(() => {
        setMessages(initialMessages || []);
    }, [initialMessages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!selectedAkun) return;
        const interval = setInterval(() => {
            fetch(`/admin/chat/${selectedAkun.id_akun}/messages`, { headers: { Accept: 'application/json' } })
                .then(r => r.json())
                .then(data => { if (data.messages) setMessages(data.messages); })
                .catch(() => {});
        }, 1000);
        return () => clearInterval(interval);
    }, [selectedAkun]);

    function selectAkun(akun: any) {
        setSelectedAkun(akun);
        setShowMobileList(false);
        router.get(`/admin/chat/${akun.id_akun}`, { preserveState: true });
    }

    function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!data.pesan.trim()) return;
        post('/admin/chat/kirim', { preserveScroll: true, preserveState: true, onSuccess: () => setData('pesan', '') });
    }

    const filteredConversations = conversations.filter((c: any) =>
        !search || (c.nama || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Head title={`Chat${selectedAkun ? ` - ${selectedAkun.nama}` : ''} - Admin`} />

            <div className="p-4 h-[calc(100vh-100px)]">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden h-full">
                    <div className="flex h-full">
                        <div className={`w-full md:w-72 border-r border-gray-100 flex-shrink-0 flex flex-col ${showMobileList ? 'block' : 'hidden md:flex'}`}>
                            <div className="p-3 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <ArrowLeft size={18} className="text-gray-400 md:hidden" />
                                        <h3 className="font-bold text-gray-900 text-sm">Pesan Masuk</h3>
                                    </div>
                                    <button
                                        onClick={() => setShowNewChat(!showNewChat)}
                                        className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-all font-medium"
                                    >
                                        + Baru
                                    </button>
                                </div>
                                {showNewChat ? (
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={newChatSearch}
                                                onChange={(e) => setNewChatSearch(e.target.value)}
                                                placeholder="Cari pelanggan..."
                                                className="w-full pl-8 pr-3 py-1.5 text-xs border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="max-h-40 overflow-y-auto bg-white rounded-lg border border-gray-200">
                                            {filteredPelanggan.length > 0 ? filteredPelanggan.map((p: any) => (
                                                <button
                                                    key={p.id_akun}
                                                    onClick={() => startNewChat(p)}
                                                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-primary-50 transition-colors border-b border-gray-50 last:border-0 flex items-center gap-2"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                                                        {p.nama?.[0] || 'P'}
                                                    </div>
                                                    {p.nama}
                                                </button>
                                            )) : (
                                                <p className="text-xs text-gray-400 text-center py-3">Pelanggan tidak ditemukan</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari percakapan..."
                                            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {filteredConversations.length > 0 ? filteredConversations.map((chat: any, i: number) => (
                                    <button
                                        key={chat.id || i}
                                        onClick={() => selectAkun(chat)}
                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 flex items-center gap-3 ${
                                            selectedAkun?.id_akun === chat.id ? 'bg-primary-50' : ''
                                        }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {chat.nama?.[0] || 'P'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-sm text-gray-900 truncate">{chat.nama || 'Pelanggan'}</p>
                                                <span className="text-xs text-gray-400 shrink-0">{chat.waktu || timeAgo(chat.created_at)}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{chat.last_message || chat.pesan_terakhir || 'Tidak ada pesan'}</p>
                                        </div>
                                        {chat.unread > 0 && (
                                            <span className="bg-primary-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shrink-0">
                                                {chat.unread}
                                            </span>
                                        )}
                                        <ChevronRight size={16} className="text-gray-300 shrink-0" />
                                    </button>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-2">
                                            <MessageCircle className="h-6 w-6 text-gray-300" />
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            {search ? 'Tidak ditemukan' : 'Belum ada percakapan'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`flex-1 flex flex-col ${!showMobileList ? 'block' : 'hidden md:flex'}`}>
                            {selectedAkun ? (
                                <>
                                    <div className="p-3 border-b border-gray-100 flex items-center gap-3 bg-white">
                                        <button onClick={() => setShowMobileList(true)} className="md:hidden text-gray-500 hover:text-gray-700 p-1">
                                            <ChevronRight size={20} className="rotate-180" />
                                        </button>
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {selectedAkun.nama?.[0] || 'P'}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold text-sm text-gray-900">{selectedAkun.nama || 'Pelanggan'}</span>
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
                                        <p className="font-medium text-gray-500">Pilih Pelanggan</p>
                                        <p className="text-sm text-gray-400 mt-1">Pilih pelanggan untuk mulai chat</p>
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
