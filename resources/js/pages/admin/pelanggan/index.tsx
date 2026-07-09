import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Mail, ShoppingBag, Calendar } from 'lucide-react';

export default function AdminPelangganIndex() {
    const { pelanggan } = usePage().props;

    const items = pelanggan?.data || pelanggan || [];

    function rupiah(value: number): string {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
    }

    return (
        <>
            <Head title="Pelanggan - Admin" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Data Pelanggan</h1>
                        <p className="text-sm text-gray-500 mt-1">Kelola data pelanggan terdaftar</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium w-12">No</th>
                                    <th className="text-left px-5 py-3 font-medium">Nama</th>
                                    <th className="text-left px-5 py-3 font-medium">Email</th>
                                    <th className="text-left px-5 py-3 font-medium">No. Telepon</th>
                                    <th className="text-center px-5 py-3 font-medium">Total Pesanan</th>
                                    <th className="text-center px-5 py-3 font-medium">Bergabung</th>
                                    <th className="text-center px-5 py-3 font-medium w-24">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.length > 0 ? items.map((p: any, i: number) => (
                                    <tr key={p.id_akun} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 text-gray-500">{pelanggan.from + i}</td>
                                        <td className="px-5 py-3 font-medium text-gray-900">{p.nama}</td>
                                        <td className="px-5 py-3 text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Mail size={14} className="text-gray-400" />
                                                {p.email}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-gray-500">{p.no_telp || '-'}</td>
                                        <td className="px-5 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                                <ShoppingBag size={12} />
                                                {p.total_pesanan || 0}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-500 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(p.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <Link href={`/admin/pelanggan/${p.id_akun}`} className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-xs bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors">
                                                <Eye size={14} />
                                                Detail
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">Tidak ada pelanggan</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pelanggan?.links && (
                    <div className="flex justify-center gap-2 mt-6">
                        {pelanggan.links.map((link: any, i: number) => (
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
