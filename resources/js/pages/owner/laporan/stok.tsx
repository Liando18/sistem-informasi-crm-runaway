import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, ArrowLeft, Package, AlertTriangle, CheckCircle, Printer } from 'lucide-react';

function rupiah(value) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

export default function OwnerLaporanStok() {
    const { produks, filters } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');

    function handleSearch(e) {
        e.preventDefault();
        router.get('/owner/laporan/stok', { search }, { preserveState: true });
    }

    const items = produks?.data || produks || [];

    function stokBadge(stok) {
        if (stok === 0) return { label: 'Habis', class: 'bg-red-100 text-red-800' };
        if (stok <= 5) return { label: 'Menipis', class: 'bg-amber-100 text-amber-800' };
        return { label: 'Aman', class: 'bg-green-100 text-green-800' };
    }

    return (
        <>
            <Head title="Laporan Stok - Owner" />

            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/owner/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Stok</h1>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari produk..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
                </form>
                    <Link
                        href="/owner/laporan/stok/cetak"
                        className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition-colors"
                    >
                        <Printer size={16} />
                        Cetak PDF
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium w-12">No</th>
                                    <th className="text-left px-5 py-3 font-medium">Nama</th>
                                    <th className="text-left px-5 py-3 font-medium">Kategori</th>
                                    <th className="text-left px-5 py-3 font-medium">Varian</th>
                                    <th className="text-center px-5 py-3 font-medium">Stok</th>
                                    <th className="text-right px-5 py-3 font-medium">Harga</th>
                                    <th className="text-center px-5 py-3 font-medium">Status Stok</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length > 0 ? items.map((item, i) => {
                                    const variants = item.variasis || [];
                                    const totalStok = variants.length > 0
                                        ? variants.reduce((sum, v) => sum + (v.stok || 0), 0)
                                        : (item.stok || 0);
                                    const badge = stokBadge(totalStok);
                                    const StatusIcon = totalStok === 0 ? Package : totalStok <= 5 ? AlertTriangle : CheckCircle;
                                    return (
                                        <tr key={item.id_produk} className="hover:bg-gray-50">
                                            <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                                            <td className="px-5 py-3 font-medium text-gray-900">{item.nama_produk}</td>
                                            <td className="px-5 py-3 text-gray-500 text-xs">{item.kategori?.nama_kategori || '-'}</td>
                                            <td className="px-5 py-3 text-xs text-gray-600">
                                                {variants.length > 0 ? variants.map((v, vi) => (
                                                    <div key={vi}>{v.warna}: {v.stok}</div>
                                                )) : '-'}
                                            </td>
                                            <td className="px-5 py-3 text-center font-medium">{totalStok}</td>
                                            <td className="px-5 py-3 text-right font-medium">{rupiah(item.harga)}</td>
                                            <td className="px-5 py-3 text-center">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.class}`}>
                                                    <StatusIcon size={14} /> {badge.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">Tidak ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {produks?.links && (
                    <div className="flex justify-center gap-2 mt-6">
                        {produks.links.map((link, i) => (
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
