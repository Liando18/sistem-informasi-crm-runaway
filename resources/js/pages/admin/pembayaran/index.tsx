import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Check, Eye } from 'lucide-react';

function rupiah(value) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

export default function AdminPembayaranIndex() {
    const { pembayaran, filters } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [filterStatus, setFilterStatus] = useState(filters?.status || 'semua');

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        dibayar: 'bg-green-100 text-green-800',
        gagal: 'bg-red-100 text-red-800',
        expired: 'bg-gray-100 text-gray-600',
    };

    function handleSearch(e) {
        e.preventDefault();
        router.get('/admin/pembayaran', { search, status: filterStatus === 'semua' ? undefined : filterStatus }, { preserveState: true });
    }

    function konfirmasi(id) {
        router.patch(`/admin/pembayaran/${id}/konfirmasi`, {}, { preserveScroll: true });
    }

    const items = pembayaran?.data || pembayaran || [];

    return (
        <>
            <Head title="Pembayaran - Admin" />

            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Pembayaran</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                    {['semua', 'pending', 'dibayar', 'gagal', 'expired'].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setFilterStatus(status); router.get('/admin/pembayaran', { search, status: status === 'semua' ? undefined : status }, { preserveState: true }); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === status ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="relative mb-6 max-w-md">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari pelanggan..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
                </form>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium w-12">No</th>
                                    <th className="text-left px-5 py-3 font-medium">Order ID</th>
                                    <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                                    <th className="text-right px-5 py-3 font-medium">Jumlah</th>
                                    <th className="text-left px-5 py-3 font-medium">Metode</th>
                                    <th className="text-center px-5 py-3 font-medium">Status</th>
                                    <th className="text-center px-5 py-3 font-medium w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length > 0 ? items.map((item, i) => (
                                    <tr key={item.id_pembayaran} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                                        <td className="px-5 py-3 font-medium text-gray-900">#{item.pesanan_id}</td>
                                        <td className="px-5 py-3 text-gray-900">{item.pesanan?.akun?.nama || item.pesanan?.user?.name || item.pesanan?.pelanggan?.nama || '-'}</td>
                                        <td className="px-5 py-3 text-right font-medium">{rupiah(item.jumlah)}</td>
                                        <td className="px-5 py-3 text-gray-500">{item.metode || '-'}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status] || ''}`}>
                                                {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={`/admin/pesanan/${item.pesanan_id}`} className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-all" title="Lihat">
                                                    <Eye size={16} />
                                                </Link>
                                                {item.status === 'pending' && (
                                                    <button onClick={() => konfirmasi(item.id_pembayaran)} className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-all" title="Konfirmasi">
                                                        <Check size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">Tidak ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pembayaran?.links && (
                    <div className="flex justify-center gap-2 mt-6">
                        {pembayaran.links.map((link, i) => (
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
