import { Head, Link, usePage } from '@inertiajs/react';
import { MessageCircle, ChevronRight, User } from 'lucide-react';

export default function AdminChatIndex() {
    const { conversations } = usePage().props;
    const items = conversations?.data || conversations || [];

    return (
        <>
            <Head title="Chat - Admin" />

            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Pesan Masuk</h1>

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
                            <p className="text-gray-400">Belum ada pesan masuk</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
