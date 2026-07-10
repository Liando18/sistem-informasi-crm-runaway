import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Eye, ShoppingCart } from 'lucide-react';

function rupiah(value) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

export default function AdminPesananIndex() {
    const { pesanan, filters } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || 'semua');

    const tabs = [
        { key: 'semua', label: 'Semua' },
        { key: 'pending', label: 'Pending' },
        { key: 'dibayar', label: 'Dibayar' },
        { key: 'dikirim', label: 'Dikirim' },
        { key: 'selesai', label: 'Selesai' },
        { key: 'dibatalkan', label: 'Dibatalkan' },
    ];

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        dibayar: 'bg-primary-100 text-primary-800',
        dikirim: 'bg-primary-100 text-primary-800',
        selesai: 'bg-green-100 text-green-800',
        dibatalkan: 'bg-red-100 text-red-800',
    };

    function handleSearch(e) {
        e.preventDefault();
        router.get('/admin/pesanan', { search, status: statusFilter === 'semua' ? undefined : statusFilter }, { preserveState: true });
    }

    function filterByStatus(status) {
        setStatusFilter(status);
        router.get('/admin/pesanan', { search, status: status === 'semua' ? undefined : status }, { preserveState: true });
    }

    const items = pesanan?.data || pesanan || [];

    return (
        <>
            <Head title="Pesanan - Admin" />

            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Pesanan</h1>

                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => filterByStatus(tab.key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === tab.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            {tab.label}
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
                                    <th className="text-center px-5 py-3 font-medium w-12">No</th>
                                    <th className="text-center px-5 py-3 font-medium">Pelanggan</th>
                                    <th className="text-center px-5 py-3 font-medium">Tanggal</th>
                                    <th className="text-center px-5 py-3 font-medium">Total</th>
                                    <th className="text-center px-5 py-3 font-medium">Status</th>
                                    <th className="text-center px-5 py-3 font-medium w-20">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length > 0 ? items.map((item, i) => (
                                    <tr key={item.id_pesanan} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 text-center text-gray-500">{i + 1}</td>
                                        <td className="px-5 py-3 text-center font-medium text-gray-900">{item.akun?.nama || item.pelanggan?.nama || item.user?.name || '-'}</td>
                                        <td className="px-5 py-3 text-center text-gray-500">{new Date(item.tgl_pesanan || item.created_at).toLocaleDateString('id-ID')}</td>
                                        <td className="px-5 py-3 text-center font-medium">{rupiah(item.grand_total)}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status] || ''}`}>
                                                {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <Link href={`/admin/pesanan/${item.id_pesanan}`} className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-all inline-block" title="Lihat">
                                                <Eye size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">Tidak ada data</td></tr>
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
