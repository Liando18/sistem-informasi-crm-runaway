import { Head, Link, usePage } from '@inertiajs/react';
import { Star, CheckCircle, XCircle, Clock, MessageCircle, Sparkles, ShoppingBag } from 'lucide-react';

const statusBadge: Record<string, string> = {
    disetujui: 'bg-green-50 text-green-700 border-green-200',
    ditolak: 'bg-red-50 text-red-700 border-red-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
};

const statusIcon: Record<string, any> = {
    disetujui: CheckCircle,
    ditolak: XCircle,
    pending: Clock,
};

export default function TestimoniIndex() {
    const { testimoni } = usePage().props;
    const items = testimoni?.data || testimoni || [];

    return (
        <>
            <Head title="Testimoni Saya - Runaway Denim" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Testimoni Saya</h1>
                <p className="text-gray-500 mb-8">Lihat semua ulasan yang kamu berikan</p>

                {items.length > 0 ? (
                    <div className="space-y-4">
                        {items.map((t: any, i: number) => {
                            const StatusIcon = statusIcon[t.status] || Clock;
                            return (
                                <div key={t.id || i} className="group bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <Link href={`/produk/${t.produk?.id}`} className="font-bold text-gray-900 hover:text-primary-600 transition-colors text-lg">
                                                {t.produk?.nama || 'Produk'}
                                            </Link>
                                            <div className="flex items-center gap-0.5 mt-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={16} className={s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shrink-0 ${statusBadge[t.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            <StatusIcon size={14} />
                                            {t.status?.charAt(0).toUpperCase() + t.status?.slice(1)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{t.komentar}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageCircle className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Testimoni</h3>
                        <p className="text-gray-500 mb-8">Belum ada testimoni yang kamu tulis. Yuk, bagikan pengalamanmu!</p>
                        <Link href="/produk" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200">
                            <Sparkles size={20} /> Lihat Produk
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
