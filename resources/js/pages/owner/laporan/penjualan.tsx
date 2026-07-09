import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Printer, ShoppingCart, TrendingUp, Package, Search } from 'lucide-react';

function rupiah(value) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

export default function OwnerLaporanPenjualan() {
    const { pesanan, summary, filters } = usePage().props;
    const [periode, setPeriode] = useState(filters?.periode || 'hari');
    const [dari, setDari] = useState(filters?.dari || '');
    const [sampai, setSampai] = useState(filters?.sampai || '');

    const orders = pesanan?.data || pesanan || [];
    const totalPesanan = summary?.total_pesanan || 0;
    const totalPendapatan = summary?.total_pendapatan || 0;
    const totalProdukTerjual = summary?.total_produk_terjual || 0;

    function filterPeriode(p) {
        setPeriode(p);
        router.get('/owner/laporan/penjualan', { periode: p }, { preserveState: true });
    }

    function handleCustomFilter() {
        router.get('/owner/laporan/penjualan', { periode: 'custom', dari, sampai }, { preserveState: true });
    }

    const maxRevenue = Math.max(...orders.map((o) => o.total), 1);

    return (
        <>
            <Head title="Laporan Penjualan - Owner" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/owner/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
                    </div>
                    <Link href="/owner/laporan/penjualan/cetak" className="inline-flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all shadow-sm">
                        <Printer size={18} /> Cetak
                    </Link>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {[
                        { key: 'hari', label: 'Hari Ini' },
                        { key: 'bulan', label: 'Bulan Ini' },
                        { key: 'tahun', label: 'Tahun Ini' },
                    ].map((p) => (
                        <button
                            key={p.key}
                            onClick={() => filterPeriode(p.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${periode === p.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 mb-6 items-end">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Dari</label>
                        <input
                            type="date"
                            value={dari}
                            onChange={(e) => setDari(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Sampai</label>
                        <input
                            type="date"
                            value={sampai}
                            onChange={(e) => setSampai(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                    </div>
                    <button onClick={handleCustomFilter} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-all text-sm">
                        <Search size={16} className="inline" /> Filter
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <ShoppingCart className="h-5 w-5 text-primary-500" />
                            <p className="text-sm text-gray-500">Total Pesanan</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{totalPesanan}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-emerald-500" />
                            <p className="text-sm text-gray-500">Total Pendapatan</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">{rupiah(totalPendapatan)}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="h-5 w-5 text-primary-500" />
                            <p className="text-sm text-gray-500">Produk Terjual</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{totalProdukTerjual}</p>
                    </div>
                </div>

                {orders.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-8">
                        <h3 className="font-semibold text-gray-900 mb-4">Grafik Penjualan</h3>
                        <div className="flex items-end gap-2 h-40">
                            {orders.slice(0, 14).map((order, i) => {
                                const height = (order.total / maxRevenue) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs text-gray-400 font-medium">{rupiah(order.total).slice(0, 6)}...</span>
                                        <div className="w-full bg-primary-100 rounded-t" style={{ height: `${Math.max(height, 4)}%` }}>
                                            <div className="w-full bg-primary-600 rounded-t h-full opacity-80 hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(order.tgl_pesanan || order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Daftar Penjualan</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium w-12">No</th>
                                    <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                                    <th className="text-left px-5 py-3 font-medium">Tanggal</th>
                                    <th className="text-right px-5 py-3 font-medium">Total</th>
                                    <th className="text-center px-5 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.length > 0 ? orders.map((order, i) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                                        <td className="px-5 py-3 font-medium text-gray-900">{order.pelanggan?.nama || order.user?.name || '-'}</td>
                                        <td className="px-5 py-3 text-gray-500">{new Date(order.tgl_pesanan || order.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className="px-5 py-3 text-right font-medium text-primary-600">{rupiah(order.total)}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">Tidak ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pesanan?.links && (
                    <div className="flex justify-center gap-2 mt-6">
                        {pesanan.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => { if (link.url) router.get(link.url, {}, { preserveState: true }); }}
                                disabled={!link.url}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${link.active ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
