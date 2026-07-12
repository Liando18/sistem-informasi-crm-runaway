import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function AdminKategoriForm() {
    const { kategori } = usePage().props;
    const isEdit = !!kategori;

    const { data, setData, post, put, processing, errors } = useForm({
        nama_kategori: kategori?.nama_kategori || '',
        deskripsi: kategori?.deskripsi || '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/kategori/${kategori.id_kategori}`, { preserveScroll: true });
        } else {
            post('/admin/kategori', { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={isEdit ? 'Edit Kategori - Admin' : 'Tambah Kategori - Admin'} />

            <div className="p-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/kategori" className="text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h1>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                            <input
                                type="text"
                                value={data.nama_kategori}
                                onChange={(e) => setData('nama_kategori', e.target.value)}
                                required
                                maxLength={30}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                            {errors.nama_kategori && <p className="text-red-500 text-sm mt-1">{errors.nama_kategori}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                            {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={processing} className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-all shadow-sm disabled:opacity-50">
                                <Save size={18} /> {isEdit ? 'Update' : 'Simpan'}
                            </button>
                            <Link href="/admin/kategori" className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all">
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
