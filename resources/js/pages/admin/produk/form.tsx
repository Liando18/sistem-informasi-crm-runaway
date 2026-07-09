import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react';

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

interface ProdukVariasi {
    id_produk_variasi?: number;
    produk_id?: number;
    ukuran: string;
    warna: string;
    stok: number;
}

interface Produk {
    id_produk: number;
    nama_produk: string;
    kategori_id: number;
    diskon_id: number | null;
    harga: number;
    stok: number;
    deskripsi: string;
    gambars: ProdukGambar[];
    variasis: ProdukVariasi[];
}

interface PageErrors {
    [key: string]: string;
}

function formatRupiah(value: string | number): string {
    const num = typeof value === 'string' ? value.replace(/[^\d]/g, '') : String(value);
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function parseRupiah(value: string): number {
    return Number(value.replace(/\./g, ''));
}

export default function AdminProdukForm() {
    const { produk, kategoris, diskons, gambars: propGambars, variasis: propVariasis, errors } = usePage<{
        produk?: Produk;
        kategoris?: Kategori[];
        diskons?: Diskon[];
        gambars?: ProdukGambar[];
        variasis?: ProdukVariasi[];
        errors?: PageErrors;
    }>().props;

    const isEdit = !!produk;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [nama_produk, setNama_produk] = useState(produk?.nama_produk || '');
    const [kategori_id, setKategori_id] = useState(produk?.kategori_id || '');
    const [diskon_id, setDiskon_id] = useState(produk?.diskon_id || null);
    const [harga, setHarga] = useState(produk?.harga ? String(produk.harga) : '');
    const [stok, setStok] = useState(produk?.stok || '');
    const [deskripsi, setDeskripsi] = useState(produk?.deskripsi || '');
    const [processing, setProcessing] = useState(false);

    const [newGambars, setNewGambars] = useState<File[]>([]);
    const [existingGambars, setExistingGambars] = useState<string[]>(
        propGambars?.map(g => g.gambar) || []
    );
    const [removedGambars, setRemovedGambars] = useState<string[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [variasis, setVariasis] = useState<Array<{ ukuran: string; warna: string; stok: string }>>(
        propVariasis?.map(v => ({ ukuran: v.ukuran, warna: v.warna, stok: String(v.stok) })) || []
    );

    const hasVariasi = variasis.length > 0;

    function handleHargaInput(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value.replace(/[^\d]/g, '');
        if (raw === '') {
            setHarga('');
        } else {
            setHarga(formatRupiah(raw));
        }
    }

    function getHargaNumeric(): number {
        return parseRupiah(harga);
    }

    useEffect(() => {
        return () => previews.forEach(p => URL.revokeObjectURL(p));
    }, [previews]);

    function handleGambarFiles(files: FileList | null) {
        if (!files) return;
        const remaining = 5 - existingGambars.length - newGambars.length;
        const selected = Array.from(files).slice(0, remaining);
        setNewGambars(prev => [...prev, ...selected]);
        setPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function removeNewGambar(index: number) {
        setNewGambars(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            URL.revokeObjectURL(prev[existingGambars.length + index]);
            return prev.filter((_, i) => i !== existingGambars.length + index);
        });
    }

    function removeExistingGambar(gambar: string) {
        setExistingGambars(prev => prev.filter(g => g !== gambar));
        setRemovedGambars(prev => [...prev, gambar]);
    }

    function handleVariasiChange(index: number, field: 'ukuran' | 'warna' | 'stok', value: string) {
        setVariasis(prev => prev.map((v, i) =>
            i === index ? { ...v, [field]: value } : v
        ));
    }

    function addVariasi() {
        setVariasis(prev => [...prev, { ukuran: '', warna: '', stok: '' }]);
    }

    function removeVariasi(index: number) {
        setVariasis(prev => prev.filter((_, i) => i !== index));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('nama_produk', String(nama_produk));
        formData.append('kategori_id', String(kategori_id));
        formData.append('diskon_id', diskon_id ? String(diskon_id) : '');
        formData.append('harga', String(getHargaNumeric()));
        if (!hasVariasi) {
            formData.append('stok', String(stok));
        }
        formData.append('deskripsi', String(deskripsi));

        newGambars.forEach(file => formData.append('gambars[]', file));

        formData.append('variasis', JSON.stringify(variasis.map(v => ({ ...v, stok: Number(v.stok) }))));
        formData.append('existingGambars', JSON.stringify(existingGambars));
        formData.append('removedGambars', JSON.stringify(removedGambars));

        const options = { preserveScroll: true as const, onFinish: () => setProcessing(false) };

        if (isEdit) {
            formData.append('_method', 'PUT');
            router.post(`/admin/produk/${produk!.id_produk}`, formData, options);
        } else {
            router.post('/admin/produk', formData, options);
        }
    }

    const totalGambars = existingGambars.length + newGambars.length;

    return (
        <>
            <Head title={isEdit ? 'Edit Produk - Admin' : 'Tambah Produk - Admin'} />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/produk" className="text-gray-500 hover:text-gray-700 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h1>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                                <input
                                    type="text"
                                    value={nama_produk}
                                    onChange={e => setNama_produk(e.target.value)}
                                    required
                                    maxLength={30}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Maksimal 30 karakter</p>
                                {errors?.nama_produk && <p className="text-red-500 text-sm mt-1">{errors.nama_produk}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select
                                    value={kategori_id}
                                    onChange={e => setKategori_id(e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                >
                                    <option value="">Pilih Kategori</option>
                                    {(kategoris || []).map(k => (
                                        <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>
                                    ))}
                                </select>
                                {errors?.kategori_id && <p className="text-red-500 text-sm mt-1">{errors.kategori_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rp</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={harga}
                                        onChange={handleHargaInput}
                                        required
                                        placeholder="0"
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Dalam Rupiah, contoh: 5.000</p>
                                {errors?.harga && <p className="text-red-500 text-sm mt-1">{errors.harga}</p>}
                            </div>
                            <div>
<label className="block text-sm font-medium text-gray-700 mb-1">Diskon (opsional)</label>
                                    <select
                                        value={diskon_id === null ? '' : diskon_id}
                                        onChange={e => setDiskon_id(e.target.value === '' ? null : e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    >
                                        <option value="">Tidak Ada Diskon</option>
                                        {(diskons || []).map(d => (
                                            <option key={d.id_diskon} value={d.id_diskon}>{d.nama_diskon}</option>
                                        ))}
                                    </select>
                                {errors?.diskon_id && <p className="text-red-500 text-sm mt-1">{errors.diskon_id}</p>}
                            </div>
                        </div>

                        {!hasVariasi && (
                            <div className="max-w-xs">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                                <input
                                    type="number"
                                    value={stok}
                                    onChange={e => setStok(e.target.value)}
                                    required
                                    min={0}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                                <p className="text-xs text-gray-400 mt-1">Minimal 0</p>
                                {errors?.stok && <p className="text-red-500 text-sm mt-1">{errors.stok}</p>}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                            <textarea
                                value={deskripsi}
                                onChange={e => setDeskripsi(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            />
                            {errors?.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gambar {totalGambars > 0 && <span className="text-gray-400 font-normal">({totalGambars}/5)</span>}
                            </label>

                            {totalGambars > 0 && (
                                <div className="flex flex-wrap gap-3 mb-3">
                                    {existingGambars.map((gambar, i) => (
                                        <div key={`exist-${i}`} className="relative group">
                                            <img
                                                src={`/storage/${gambar}`}
                                                alt={`Gambar ${i + 1}`}
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingGambar(gambar)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {newGambars.map((_, i) => (
                                        <div key={`new-${i}`} className="relative group">
                                            <img
                                                src={previews[existingGambars.length + i]}
                                                alt={`New ${i + 1}`}
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeNewGambar(i)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-xs text-gray-400 mb-3">Format: JPG, PNG, JPEG, WEBP. Maksimal 1 MB per gambar. Maksimal 5 gambar.</p>

                            {totalGambars < 5 && (
                                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all text-gray-500 hover:text-primary-600">
                                    <Upload size={20} />
                                    <span className="text-sm font-medium">Klik atau tarik gambar ke sini</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                        multiple
                                        onChange={e => handleGambarFiles(e.target.files)}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            {errors?.gambars && <p className="text-red-500 text-sm mt-1">{errors.gambars}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Variasi</label>
                                <button
                                    type="button"
                                    onClick={addVariasi}
                                    className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
                                >
                                    <Plus size={16} /> Tambah Variasi
                                </button>
                            </div>
                            {variasis.length > 0 && (
                                <div className="space-y-3">
                                    {variasis.map((variasi, i) => (
                                        <div key={i} className="flex items-end gap-3 bg-gray-50 rounded-lg p-3">
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Ukuran</label>
                                                <input
                                                    type="text"
                                                    value={variasi.ukuran}
                                                    onChange={e => handleVariasiChange(i, 'ukuran', e.target.value)}
                                                    placeholder="M, L, XL..."
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Warna</label>
                                                <input
                                                    type="text"
                                                    value={variasi.warna}
                                                    onChange={e => handleVariasiChange(i, 'warna', e.target.value)}
                                                    placeholder="Hitam, Putih..."
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Stok</label>
                                                <input
                                                    type="number"
                                                    value={variasi.stok}
                                                    onChange={e => handleVariasiChange(i, 'stok', e.target.value)}
                                                    min={0}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeVariasi(i)}
                                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {variasis.length === 0 && (
                                <p className="text-sm text-gray-400 italic">Belum ada variasi. Klik "Tambah Variasi" untuk menambahkan.</p>
                            )}
                            {errors?.variasis && <p className="text-red-500 text-sm mt-1">{errors.variasis}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button type="submit" disabled={processing} className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-all shadow-sm disabled:opacity-50">
                                <Save size={18} /> {isEdit ? 'Update' : 'Simpan'}
                            </button>
                            <Link href="/admin/produk" className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-all">
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
