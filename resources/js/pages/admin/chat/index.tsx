import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { MessageCircle, ChevronRight, Search } from 'lucide-react';

export default function AdminChatIndex() {
    const { conversations, pelanggan: initialPelanggan } = usePage().props;
    const items = conversations?.data || conversations || [];
    const pelanggan = initialPelanggan?.data || initialPelanggan || [];
    const [showNewChat, setShowNewChat] = useState(false);
    const [newChatSearch, setNewChatSearch] = useState('');

    const filteredPelanggan = pelanggan.filter((p: any) =>
        !newChatSearch || (p.nama || '').toLowerCase().includes(newChatSearch.toLowerCase())
    );

    return (
        <>
            <Head title="Chat - Admin" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Pesan Masuk</h1>
                    <div className="relative">
                        <button
                            onClick={() => setShowNewChat(!showNewChat)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-all shadow-sm"
                        >
                            + Chat Baru
                        </button>
                        {showNewChat && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                                <div className="p-3 border-b border-gray-100">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={newChatSearch}
                                            onChange={(e) => setNewChatSearch(e.target.value)}
                                            placeholder="Cari pelanggan..."
                                            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {filteredPelanggan.length > 0 ? filteredPelanggan.map((p: any) => (
                                        <Link
                                            key={p.id_akun}
                                            href={`/admin/chat/${p.id_akun}`}
                                            onClick={() => setShowNewChat(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                {p.nama?.[0] || 'P'}
                                            </div>
                                            {p.nama}
                                        </Link>
                                    )) : (
                                        <p className="text-xs text-gray-400 text-center py-6">Pelanggan tidak ditemukan</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {items.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {items.map((chat, i) => (
                                <Link key={chat.id || i} href={`/admin/chat/${chat.user_id || chat.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="w-11 h-11 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                        {chat.nama?.[0] || chat.user?.name?.[0] || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="font-medium text-gray-900 truncate">{chat.nama || chat.user?.name || 'User'}</p>
                                            {chat.waktu && <span className="text-xs text-gray-400 flex-shrink-0">{chat.waktu}</span>}
                                        </div>
                                        <p className="text-sm text-gray-400 truncate">{chat.last_message || chat.pesan_terakhir || 'Tidak ada pesan'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {chat.unread > 0 && (
                                            <span className="bg-primary-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">{chat.unread}</span>
                                        )}
                                        <ChevronRight size={18} className="text-gray-300" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <MessageCircle className="h-16 w-16 mx-auto mb-3 text-gray-200" />
                            <p className="text-gray-400 mb-4">Belum ada pesan masuk</p>
                            {pelanggan.length > 0 && (
                                <button
                                    onClick={() => setShowNewChat(true)}
                                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all shadow-lg"
                                >
                                    <MessageCircle size={16} />
                                    Mulai Chat dengan Pelanggan
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
