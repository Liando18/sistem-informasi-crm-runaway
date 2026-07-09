import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Truck, Package, Eye, SlidersHorizontal, Sparkles } from 'lucide-react';

function rupiah(value: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

const statusBadge: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    dibayar: 'bg-primary-50 text-primary-700 border-primary-200',
    dipacking: 'bg-primary-50 text-primary-700 border-primary-200',
    dikirim: 'bg-purple-50 text-purple-700 border-purple-200',
    selesai: 'bg-green-50 text-green-700 border-green-200',
    dibatalkan: 'bg-red-50 text-red-700 border-red-200',
};

const statusIcon: Record<string, any> = {
    pending: Clock,
    dibayar: CheckCircle,
    dipacking: Package,
    dikirim: Truck,
    selesai: CheckCircle,
    dibatalkan: XCircle,
};

export default function PesananIndex() {
    const { pesanan, filter } = usePage().props;
    const [activeTab, setActiveTab] = useState(filter || 'semua');

    const tabs = [
        { key: 'semua', label: 'Semua' },
        { key: 'pending', label: 'Menunggu' },
        { key: 'dipacking', label: 'Dipacking' },
        { key: 'dikirim', label: 'Dikirim' },
        { key: 'selesai', label: 'Selesai' },
        { key: 'dibatalkan', label: 'Dibatalkan' },
    ];

    function filterByStatus(status: string) {
        setActiveTab(status);
        router.get('/pesanan', { status: status === 'semua' ? undefined : status }, { preserveState: true });
    }

    const orders = pesanan?.data || pesanan || [];

    return (
        <>
            <Head title="Pesanan Saya - Runaway Denim" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesanan Saya</h1>
                <p className="text-gray-500 mb-8">Pantau status pesanan denim favoritmu</p>

                <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
                    <SlidersHorizontal size={16} className="text-gray-400 shrink-0" />
                    {tabs.map((tab) => {
                        const Icon = statusIcon[tab.key] || Package;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => filterByStatus(tab.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                    activeTab === tab.key
                                        ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order: any) => {
                            const StatusIcon = statusIcon[order.status] || Package;
                            return (
                                <div key={order.id} className="group bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-50 flex items-center justify-center">
                                                <Package className="h-6 w-6 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Pesanan #{order.id}</p>
                                                <p className="text-sm text-gray-400">{new Date(order.tgl_pesanan || order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusBadge[order.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            <StatusIcon size={14} />
                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">Total Belanja</p>
                                            <p className="text-xl font-bold text-primary-600">{rupiah(order.total)}</p>
                                        </div>
                                        <Link href={`/pesanan/${order.id}`} className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-md shadow-primary-200 text-sm">
                                            <Eye size={16} /> Detail
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Pesanan</h3>
                        <p className="text-gray-500 mb-8">Mulai belanja dan dapatkan denim impianmu!</p>
                        <Link href="/produk" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200">
                            <Sparkles size={20} /> Belanja Sekarang
                        </Link>
                    </div>
                )}

                {pesanan?.links && (
                    <div className="flex justify-center gap-2 mt-10">
                        {pesanan.links.map((link: any, i: number) => (
                            <button
                                key={i}
                                onClick={() => { if (link.url) router.get(link.url, {}, { preserveState: true }); }}
                                disabled={!link.url}
                                className={`min-w-[40px] px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                    link.active
                                        ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
