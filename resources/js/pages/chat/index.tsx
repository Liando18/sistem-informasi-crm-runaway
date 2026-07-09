import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, ChevronRight, Phone } from 'lucide-react';

export default function ChatIndex() {
    const { conversations, activeConversation, messages, auth } = usePage().props;
    const [selectedChat, setSelectedChat] = useState(activeConversation || null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [showMobileList, setShowMobileList] = useState(!selectedChat);

    const { data, setData, post, processing } = useForm({
        pesan: '',
        penerima_id: selectedChat?.user_id || selectedChat?.id,
    });

    useEffect(() => {
        setData('penerima_id', selectedChat?.user_id || selectedChat?.id);
    }, [selectedChat]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function selectChat(chat: any) {
        setSelectedChat(chat);
        setShowMobileList(false);
        router.get('/chat', { dengan: chat.user_id || chat.id }, { preserveState: true });
    }

    function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!data.pesan.trim()) return;
        post('/chat/kirim', { preserveScroll: true, preserveState: true, onSuccess: () => setData('pesan', '') });
    }

    const chatList = conversations?.data || conversations || [];

    return (
        <>
            <Head title="Chat - Runaway Denim" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesan</h1>
                <p className="text-gray-500 mb-6">Hubungi tim Runaway Denim</p>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 260px)', minHeight: '520px' }}>
                    <div className="flex h-full">
                        <div className={`w-full md:w-80 border-r border-gray-100 flex-shrink-0 ${showMobileList ? 'block' : 'hidden md:block'}`}>
                            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-50">
                                <h3 className="font-bold text-gray-900">Percakapan</h3>
                            </div>
                            <div className="overflow-y-auto h-[calc(100%-65px)]">
                                {chatList.length > 0 ? chatList.map((chat: any, i: number) => (
                                    <button
                                        key={chat.id || i}
                                        onClick={() => selectChat(chat)}
                                        className={`w-full text-left px-5 py-4 hover:bg-primary-50/50 transition-colors border-b border-gray-50 flex items-center gap-3 ${
                                            selectedChat?.id === chat.id ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''
                                        }`}
                                    >
                                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                                            {chat.nama?.[0] || chat.user?.name?.[0] || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-gray-900 truncate">{chat.nama || chat.user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-400 truncate mt-0.5">{chat.last_message || chat.pesan_terakhir || 'Tidak ada pesan'}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            {chat.unread > 0 && (
                                                <span className="bg-primary-600 text-white text-xs font-bold rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1.5 shadow-md shadow-primary-200">
                                                    {chat.unread}
                                                </span>
                                            )}
                                            <ChevronRight size={16} className="text-gray-300" />
                                        </div>
                                    </button>
                                )) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                                            <MessageCircle className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <p className="text-sm text-gray-400">Belum ada percakapan</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`flex-1 flex flex-col ${!showMobileList ? 'block' : 'hidden md:flex'}`}>
                            {selectedChat ? (
                                <>
                                    <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
                                        <button onClick={() => setShowMobileList(true)} className="md:hidden text-gray-500 hover:text-gray-700 p-1">
                                            <ChevronRight size={20} className="rotate-180" />
                                        </button>
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                                            {selectedChat.nama?.[0] || selectedChat.user?.name?.[0] || 'U'}
                                        </div>
                                        <div className="flex-1">
                                            <span className="font-semibold text-gray-900">{selectedChat.nama || selectedChat.user?.name || 'User'}</span>
                                            <p className="text-xs text-gray-400">Online</p>
                                        </div>
                                        <a href="https://wa.me/6282183539906" target="_blank" className="text-green-500 hover:text-green-600 p-2 hover:bg-green-50 rounded-xl transition-all">
                                            <Phone size={18} />
                                        </a>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3 bg-gradient-to-b from-gray-50 to-white">
                                        {(messages || []).map((msg: any, i: number) => {
                                            const isMine = msg.pengirim_id === auth?.user?.id;
                                            return (
                                                <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-1 duration-200`}>
                                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                                                        isMine
                                                            ? 'bg-gradient-to-r from-primary-600 to-primary-600 text-white rounded-br-sm shadow-md shadow-primary-200'
                                                            : 'bg-white text-gray-900 border border-gray-100 rounded-bl-sm shadow-sm'
                                                    }`}>
                                                        {msg.pesan}
                                                        <p className={`text-xs mt-1.5 ${isMine ? 'text-primary-200' : 'text-gray-400'}`}>
                                                            {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={chatEndRef} />
                                    </div>

                                    <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex gap-2">
                                        <input
                                            type="text"
                                            value={data.pesan}
                                            onChange={(e) => setData('pesan', e.target.value)}
                                            placeholder="Ketik pesan..."
                                            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-gray-50/50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={processing || !data.pesan.trim()}
                                            className="bg-gradient-to-r from-primary-600 to-primary-600 text-white p-3 rounded-xl hover:from-primary-700 hover:to-primary-700 transition-all disabled:opacity-50 shadow-md shadow-primary-200"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-gray-400">
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                            <MessageCircle className="h-10 w-10 text-gray-300" />
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
