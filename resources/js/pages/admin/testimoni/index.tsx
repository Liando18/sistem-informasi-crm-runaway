import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, AlertCircle } from 'lucide-react';

export default function AdminTestimoniIndex() {
    const { testimoni } = usePage().props;
    const [deleteId, setDeleteId] = useState(null);

    const items = testimoni?.data || testimoni || [];

    function setujui(id) {
        router.patch(`/admin/testimoni/${id}/status`, { status: 'disetujui' }, { preserveScroll: true });
    }

    function tolak(id) {
        router.patch(`/admin/testimoni/${id}/status`, { status: 'ditolak' }, { preserveScroll: true });
    }

    function confirmDelete(id) {
        setDeleteId(id);
    }

    function handleDelete() {
        if (!deleteId) return;
        router.delete(`/admin/testimoni/${deleteId}`, { preserveScroll: true, onSuccess: () => setDeleteId(null) });
    }

    const statusBadge = {
        disetujui: 'bg-green-100 text-green-800',
        ditolak: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <>
            <Head title="Testimoni - Admin" />

            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Testimoni</h1>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-center px-5 py-3 font-medium w-12">No</th>
                                    <th className="text-center px-5 py-3 font-medium">Pelanggan</th>
                                    <th className="text-center px-5 py-3 font-medium">Produk</th>
                                    <th className="text-center px-5 py-3 font-medium">Rating</th>
                                    <th className="text-center px-5 py-3 font-medium">Komentar</th>
                                    <th className="text-center px-5 py-3 font-medium">Status</th>
                                    <th className="text-center px-5 py-3 font-medium w-36">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length > 0 ? items.map((t, i) => (
                                    <tr key={t.id_testimoni} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 text-center text-gray-500">{i + 1}</td>
                                        <td className="px-5 py-3 text-center font-medium text-gray-900">{t.akun?.nama || t.pelanggan?.nama || t.user?.name || '-'}</td>
                                        <td className="px-5 py-3 text-center text-gray-500">{t.produk?.nama_produk || t.produk?.nama || '-'}</td>
                                        <td className="px-5 py-3 text-center">
                                            <div className="flex items-center justify-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={14} className={s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-center text-gray-600 max-w-xs truncate">{t.komentar}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[t.status] || ''}`}>
                                                {t.status?.charAt(0).toUpperCase() + t.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {t.status !== 'disetujui' && (
                                                    <button onClick={() => setujui(t.id_testimoni)} className="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-all" title="Setujui">
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                {t.status !== 'ditolak' && (
                                                    <button onClick={() => tolak(t.id_testimoni)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all" title="Tolak">
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                                <button onClick={() => confirmDelete(t.id_testimoni)} className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-all" title="Hapus">
                                                    <Trash2 size={16} />
                                                </button>
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

                {testimoni?.links && (
                    <div className="flex justify-center gap-2 mt-6">
                        {testimoni.links.map((link, i) => (
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
                                <p className="text-sm text-gray-500 mb-6">Apakah Anda yakin ingin menghapus testimoni ini?</p>
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
