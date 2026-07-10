import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';

export default function AdminKategoriIndex() {
    const { kategori, filters } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [deleteId, setDeleteId] = useState(null);

    function handleSearch(e) {
        e.preventDefault();
        router.get('/admin/kategori', { search }, { preserveState: true });
    }

    function confirmDelete(id) {
        setDeleteId(id);
    }

    function handleDelete() {
        if (!deleteId) return;
        router.delete(`/admin/kategori/${deleteId}`, { preserveScroll: true, onSuccess: () => setDeleteId(null) });
    }

    const items = kategori?.data || kategori || [];

    return (
        <>
            <Head title="Kategori - Admin" />

            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Kategori</h1>
                    <Link href="/admin/kategori/create" className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-all shadow-sm">
                        <Plus size={18} /> Tambah
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="relative mb-6 max-w-md">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari kategori..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-500" />
                </form>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-center px-5 py-3 font-medium w-16">No</th>
                                    <th className="text-center px-5 py-3 font-medium">Nama Kategori</th>
                                    <th className="text-center px-5 py-3 font-medium">Deskripsi</th>
                                    <th className="text-center px-5 py-3 font-medium w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length > 0 ? items.map((item, i) => (
                                    <tr key={item.id_kategori} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 text-center text-gray-500">{i + 1}</td>
                                        <td className="px-5 py-3 text-center font-medium text-gray-900">{item.nama_kategori}</td>
                                        <td className="px-5 py-3 text-center text-gray-500">{item.deskripsi || '-'}</td>
                                        <td className="px-5 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={`/admin/kategori/${item.id_kategori}/edit`} className="bg-amber-400 text-white p-2 rounded-lg hover:bg-amber-500 transition-all" title="Edit">
                                                    <Pencil size={16} />
                                                </Link>
                                                <button onClick={() => confirmDelete(item.id_kategori)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all" title="Hapus">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">Tidak ada data</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {kategori?.links && (
                    <div className="flex justify-center gap-2 mt-6">
                        {kategori.links.map((link, i) => (
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
                                <p className="text-sm text-gray-500 mb-6">Apakah Anda yakin ingin menghapus kategori ini?</p>
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
