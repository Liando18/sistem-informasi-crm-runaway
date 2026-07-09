import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import { useRef, useEffect } from 'react';
import { ArrowLeft, Send, User, Phone } from 'lucide-react';

export default function AdminChatShow() {
    const { akun, messages, auth } = usePage().props;
    const chatEndRef = useRef(null);

    const { data, setData, post, processing } = useForm({
        pesan: '',
        penerima_id: akun?.id || akun?.user_id,
    });

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    function handleSend(e) {
        e.preventDefault();
        if (!data.pesan.trim()) return;
        post('/admin/chat/kirim', { preserveScroll: true, preserveState: true, onSuccess: () => setData('pesan', '') });
    }

    return (
        <>
            <Head title={`Chat - ${akun?.nama || akun?.name || 'User'} - Admin`} />

            <div className="p-6 h-[calc(100vh-120px)] flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/admin/chat" className="text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {(akun?.nama || akun?.name || 'U')[0]}
                    </div>
                    <div>
                        <h1 className="font-semibold text-gray-900">{akun?.nama || akun?.name || 'User'}</h1>
                        {akun?.no_telp && <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={12} /> {akun.no_telp}</p>}
                    </div>
                </div>

                <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 overflow-y-auto p-4 space-y-3 mb-4">
                    {(messages || []).map((msg, i) => {
                        const isAdmin = msg.pengirim_id === auth?.user?.id;
                        return (
                            <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${isAdmin ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-white text-gray-900 border border-gray-100 rounded-bl-sm shadow-sm'}`}>
                                    {msg.pesan}
                                    <p className={`text-xs mt-1 ${isAdmin ? 'text-primary-200' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        value={data.pesan}
                        onChange={(e) => setData('pesan', e.target.value)}
                        placeholder="Ketik pesan..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                    <button type="submit" disabled={processing || !data.pesan.trim()} className="bg-primary-600 text-white p-2.5 rounded-lg hover:bg-primary-700 transition-all disabled:opacity-50">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </>
    );
}
