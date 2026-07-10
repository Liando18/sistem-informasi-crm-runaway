import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Eye, AlertCircle, Package } from 'lucide-react';

interface Kategori {
    id_kategori: number;
    nama_kategori: string;
}

interface Diskon {
    id_diskon: number;
    nama_diskon: string;
    tipe: string;
    nilai: number;
}

interface ProdukGambar {
    id_produk_gambar: number;
    produk_id: number;
    gambar: string;
    is_utama: boolean;
}

interface Produk {
    id_produk: number;
    nama_produk: string;
    kategori_id: number;
    diskon_id: number | null;
    harga: number;
    stok: number;
    berat: number;
    deskripsi: string;
    gambarUtama?: ProdukGambar;
    kategori?: Kategori;
    diskon?: Diskon;
    variasis?: Array<{ stok: number }>;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
    path: string;
}

function rupiah(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return 'Rp ' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDiskon(diskon?: Diskon): string {
    if (!diskon) return 'Tidak ada diskon';
    if (diskon.tipe === 'persentase') return `${Number(diskon.nilai)}%`;
    if (diskon.tipe === 'nominal') return rupiah(Number(diskon.nilai));
    return diskon.nama_diskon;
}

export default function AdminProdukIndex() {
    const { produks, kategoris } = usePage<{
        produks?: PaginatedData<Produk>;
        kategoris?: Kategori[];
    }>().props;

    const [search, setSearch] = useState('');
    const [filterKategori, setFilterKategori] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        router.get('/admin/produk', { search, kategori_id: filterKategori }, { preserveState: true });
    }

    function handleFilterChange(value: string) {
        setFilterKategori(value);
        router.get('/admin/produk', { search, kategori_id: value }, { preserveState: true });
    }

    function confirmDelete(id: number) {
        setDeleteId(id);
    }

    function handleDelete() {
        if (!deleteId) return;
        router.delete(`/admin/produk/${deleteId}`, { preserveScroll: true, onSuccess: () => setDeleteId(null) });
    }

    const items = produks?.data || [];

    return (
        <>
            <Head title="Produk - Admin" />

            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
                    <Link href="/admin/produk/create" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-all shadow-sm">
                        <Plus size={18} /> Tambah
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari produk..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
                    </div>
                    <select
                        value={filterKategori}
                        onChange={e => handleFilterChange(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    >
                        <option value="">Semua Kategori</option>
                        {(kategoris || []).map(k => (
                            <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>
                        ))}
                    </select>
                </form>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-center px-5 py-3 font-medium w-12">No</th>
                                    <th className="text-center px-5 py-3 font-medium">Nama</th>
                                    <th className="text-center px-5 py-3 font-medium">Kategori</th>
                                    <th className="text-center px-5 py-3 font-medium">Harga</th>
                                    <th className="text-center px-5 py-3 font-medium">Stok</th>
                                    <th className="text-center px-5 py-3 font-medium">Diskon</th>
                                    <th className="text-center px-5 py-3 font-medium w-36">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length > 0 ? items.map((item, i) => (
                                    <tr key={item.id_produk} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 text-center text-gray-500">{produks?.from ? produks.from + i : i + 1}</td>
                                        <td className="px-5 py-3 text-center font-medium text-gray-900">{item.nama_produk}</td>
                                        <td className="px-5 py-3 text-center text-gray-500">{item.kategori?.nama_kategori || '-'}</td>
                                        <td className="px-5 py-3 text-center font-medium">{rupiah(item.harga)}</td>
                                        <td className="px-5 py-3 text-center">
                                            {item.variasis && item.variasis.length > 0 ? (
                                                <div>
                                                    <span className="font-medium">{item.variasis.reduce((sum, v) => sum + (v.stok || 0), 0)}</span>
                                                    <div className="text-xs text-gray-400">({item.variasis.length} varian)</div>
                                                </div>
                                            ) : (
                                                item.stok
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-center">{formatDiskon(item.diskon)}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={`/produk/${item.id_produk}`} className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-all" title="Lihat">
                                                    <Eye size={16} />
                                                </Link>
                                                <Link href={`/admin/produk/${item.id_produk}/edit`} className="bg-amber-400 text-white p-2 rounded-lg hover:bg-amber-500 transition-all" title="Edit">
                                                    <Pencil size={16} />
                                                </Link>
                                                <button onClick={() => confirmDelete(item.id_produk)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all" title="Hapus">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">Tidak ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {produks?.links && produks.links.length > 0 && (
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

                {deleteId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
                            <div className="text-center">
                                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Konfirmasi Hapus</h3>
                                <p className="text-sm text-gray-500 mb-6">Apakah Anda yakin ingin menghapus produk ini?</p>
                                <div className="flex gap-3 justify-center">
                                    <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all">Batal</button>
                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all">Hapus</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
