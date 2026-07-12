import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

function formatAngka(value: string | number): string {
    const str = typeof value === 'string' ? value : String(value);
    const num = str.split('.')[0].replace(/[^\d]/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseAngka(value: string): number {
    return Number(value.replace(/\./g, ''));
}

export default function AdminDiskonForm() {
    const { diskon } = usePage().props;
    const isEdit = !!diskon;

    const { data, setData, post, put, processing, errors } = useForm({
        nama_diskon: diskon?.nama_diskon || '',
        jenis_diskon: diskon?.jenis_diskon || 'produk',
        maks_penggunaan: diskon?.maks_penggunaan || '',
        tipe: diskon?.tipe || 'persen',
        nilai: diskon?.nilai || '',
        kode: diskon?.kode || '',
        tanggal_mulai: diskon?.tanggal_mulai ? new Date(diskon.tanggal_mulai).toISOString().split('T')[0] : '',
        tanggal_berakhir: diskon?.tanggal_berakhir ? new Date(diskon.tanggal_berakhir).toISOString().split('T')[0] : '',
        min_belanja: diskon?.min_belanja || '',
        status: diskon?.status || 'aktif',
    });

    const isVoucher = data.jenis_diskon === 'voucher_ongkir';

    function handleNilaiInput(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value.replace(/[^\d]/g, '');
        setData('nilai', raw);
    }

    function handleMinBelanjaInput(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value.replace(/[^\d]/g, '');
        setData('min_belanja', raw);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/diskon/${diskon.id_diskon}`, { preserveScroll: true });
        } else {
            post('/admin/diskon', { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={isEdit ? 'Edit Diskon - Admin' : 'Tambah Diskon - Admin'} />

            <div className="p-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/diskon" className="text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Diskon' : 'Tambah Diskon'}</h1>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Diskon</label>
                                <div className="flex gap-4 mt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="jenis_diskon"
                                            value="produk"
                                            checked={data.jenis_diskon === 'produk'}
                                            onChange={(e) => setData('jenis_diskon', e.target.value)}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Diskon Produk</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="jenis_diskon"
                                            value="voucher_ongkir"
                                            checked={data.jenis_diskon === 'voucher_ongkir'}
                                            onChange={(e) => setData('jenis_diskon', e.target.value)}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">Voucher Ongkir</span>
                                    </label>
                                </div>
                                {errors.jenis_diskon && <p className="text-red-500 text-sm mt-1">{errors.jenis_diskon}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Diskon</label>
                                <input
                                    type="text"
                                    value={data.nama_diskon}
                                    onChange={(e) => setData('nama_diskon', e.target.value)}
                                    required
                                    maxLength={20}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                                {errors.nama_diskon && <p className="text-red-500 text-sm mt-1">{errors.nama_diskon}</p>}
                            </div>

                            {isVoucher && (
                                <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kode Voucher</label>
                                    <input
                                        type="text"
                                        value={data.kode}
                                        onChange={(e) => setData('kode', e.target.value)}
                                        placeholder="FREESHIP10"
                                        maxLength={15}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    />
                                    {errors.kode && <p className="text-red-500 text-sm mt-1">{errors.kode}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Maks Penggunaan per User</label>
                                    <input
                                        type="number"
                                        value={data.maks_penggunaan}
                                        onChange={(e) => setData('maks_penggunaan', e.target.value)}
                                        placeholder="Kosongkan untuk unlimited"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    />
                                    {errors.maks_penggunaan && <p className="text-red-500 text-sm mt-1">{errors.maks_penggunaan}</p>}
                                </div>
                                </>
                            )}

                            {!isVoucher && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                        <div className="flex gap-4 mt-1">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="tipe"
                                                    value="persen"
                                                    checked={data.tipe === 'persen'}
                                                    onChange={(e) => setData('tipe', e.target.value)}
                                                    className="text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-gray-700">Persen (%)</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="tipe"
                                                    value="nominal"
                                                    checked={data.tipe === 'nominal'}
                                                    onChange={(e) => setData('tipe', e.target.value)}
                                                    className="text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-gray-700">Nominal (Rp)</span>
                                            </label>
                                        </div>
                                        {errors.tipe && <p className="text-red-500 text-sm mt-1">{errors.tipe}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nilai</label>
                                        <div className="relative">
                                            {data.tipe === 'nominal' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rp</span>}
                                            {data.tipe === 'persen' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">%</span>}
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={data.tipe === 'nominal' ? formatAngka(data.nilai) : data.nilai}
                                                onChange={handleNilaiInput}
                                                required
                                                className={`w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none ${data.tipe === 'nominal' ? 'pl-10' : ''}`}
                                            />
                                        </div>
                                        {errors.nilai && <p className="text-red-500 text-sm mt-1">{errors.nilai}</p>}
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                                {errors.tanggal_mulai && <p className="text-red-500 text-sm mt-1">{errors.tanggal_mulai}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berakhir</label>
                                <input
                                    type="date"
                                    value={data.tanggal_berakhir}
                                    onChange={(e) => setData('tanggal_berakhir', e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                                {errors.tanggal_berakhir && <p className="text-red-500 text-sm mt-1">{errors.tanggal_berakhir}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Minimal Belanja</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rp</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={formatAngka(data.min_belanja)}
                                        onChange={handleMinBelanjaInput}
                                        placeholder="0"
                                        className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    />
                                </div>
                                {errors.min_belanja && <p className="text-red-500 text-sm mt-1">{errors.min_belanja}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={processing} className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-all shadow-sm disabled:opacity-50">
                                <Save size={18} /> {isEdit ? 'Update' : 'Simpan'}
                            </button>
                            <Link href="/admin/diskon" className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all">
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
