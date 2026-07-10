import { Head, Link, usePage } from '@inertiajs/react';
import { Mail, Phone, Calendar, ShoppingBag, MapPin, ArrowLeft } from 'lucide-react';

export default function OwnerPelangganShow() {
    const { pelanggan, pesananTerbaru } = usePage().props;

    function rupiah(value: number): string {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
    }

    const statusBadge: Record<string, string> = {
        pending: 'bg-amber-50 text-amber-700',
        dibayar: 'bg-primary-50 text-primary-700',
        dipacking: 'bg-primary-50 text-primary-700',
        dikirim: 'bg-purple-50 text-purple-700',
        selesai: 'bg-green-50 text-green-700',
        dibatalkan: 'bg-red-50 text-red-700',
    };

    return (
        <>
            <Head title={`${pelanggan.nama} - Pelanggan`} />

            <div className="max-w-4xl mx-auto">
                <Link href="/owner/pelanggan" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                    <ArrowLeft size={16} />
                    Kembali ke daftar pelanggan
                </Link>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-8">
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl shrink-0">
                            {pelanggan.nama?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{pelanggan.nama}</h1>
                            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-gray-500">
                                <span className="flex items-center gap-1.5"><Mail size={14} /> {pelanggan.email}</span>
                                <span className="flex items-center gap-1.5"><Phone size={14} /> {pelanggan.no_telp || '-'}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={14} /> Bergabung {new Date(pelanggan.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        <div className="shrink-0 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-center">
                            <div className="text-2xl font-bold">{pelanggan.total_pesanan || 0}</div>
                            <div className="text-xs font-medium">Pesanan</div>
                        </div>
                    </div>

                    {pelanggan.alamat && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                <span>{pelanggan.alamat}</span>
                            </div>
                        </div>
                    )}
                </div>

                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-purple-600" />
                    Pesanan Terbaru
                </h2>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {pesananTerbaru?.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {pesananTerbaru.map((p: any) => (
                                <div key={p.id_pesanan} className="flex items-center justify-between px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900">#{p.id_pesanan}</div>
                                        <div className="text-sm text-gray-500 mt-0.5">{new Date(p.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-900">{rupiah(p.grand_total)}</div>
                                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[p.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {p.status?.charAt(0).toUpperCase() + p.status?.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center text-gray-400">Belum ada pesanan</div>
                    )}
                </div>
            </div>
        </>
    );
}
