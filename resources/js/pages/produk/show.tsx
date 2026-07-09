import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Star, Minus, Plus, ShoppingCart, Package, CheckCircle, MessageCircle, Sparkles, ArrowLeft, AlertCircle, Send, ShieldCheck, Truck } from 'lucide-react';

function rupiah(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return 'Rp ' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const COLOR_MAP: Record<string, string> = {
    merah: '#EF4444', biru: '#3B82F6', hijau: '#22C55E', kuning: '#EAB308',
    hitam: '#171717', putih: '#F5F5F5', abu: '#6B7280', abuabu: '#6B7280',
    coklat: '#92400E', ungu: '#8B5CF6', pink: '#EC4899', orange: '#F97316',
    krem: '#FDE68A', navy: '#1E3A5F', marun: '#991B1B', emas: '#D97706',
    silver: '#9CA3AF', toska: '#14B8A6',
};

interface Variasi {
    id_produk_variasi: number;
    ukuran: string;
    warna: string;
    stok: number;
}

interface GambarItem {
    gambar: string;
}

interface Kategori {
    nama_kategori: string;
}

interface Diskon {
    status: string;
    tipe: string;
    nilai: number;
    tanggal_berakhir: string;
}

interface Produk {
    id_produk: number;
    nama_produk: string;
    harga: number;
    deskripsi: string;
    kategori: Kategori | null;
    diskon: Diskon | null;
    gambarUtama: GambarItem | null;
    gambars: GambarItem[];
    variasis: Variasi[];
    stok?: number;
}

interface Testimoni {
    rating: number;
    komentar: string;
    pelanggan?: { nama: string };
    user?: { name: string };
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Auth {
    user: User | null;
}

interface ProdukPageProps {
    produk: Produk;
    testimoni: Testimoni[];
    relatedProduk: Produk[];
    auth: Auth;
    [key: string]: unknown;
}

function StarInput({ value, onChange }: { value: number; onChange: (val: number) => void }) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none transition-transform hover:scale-110">
                    <Star size={22} className={star <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200 hover:text-amber-300'} />
                </button>
            ))}
        </div>
    );
}

export default function ProdukShow() {
    const { produk, testimoni, relatedProduk, auth } = usePage<ProdukPageProps>().props;
    const [qty, setQty] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedWarna, setSelectedWarna] = useState<string | null>(null);
    const [selectedUkuran, setSelectedUkuran] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);
    const [buyingNow, setBuyingNow] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        rating: 5,
        komentar: '',
    });

    const diskon = produk.diskon;
    const diskonAktif = diskon && diskon.status === 'aktif' && new Date(diskon.tanggal_berakhir) > new Date();
    const hargaSetelahDiskon = diskonAktif
        ? diskon.tipe === 'persen'
            ? produk.harga - (produk.harga * diskon.nilai / 100)
            : produk.harga - diskon.nilai
        : produk.harga;

    const hasVariasi = produk.variasis && produk.variasis.length > 0;

    const allUkuran = useMemo(() => [...new Set(produk.variasis.map(v => v.ukuran))], [produk.variasis]);
    const allWarna = useMemo(() => [...new Set(produk.variasis.map(v => v.warna))], [produk.variasis]);

    const availableUkuran = useMemo(() => {
        if (!selectedWarna) return allUkuran;
        return [...new Set(produk.variasis.filter(v => v.warna === selectedWarna).map(v => v.ukuran))];
    }, [produk.variasis, selectedWarna, allUkuran]);

    const availableWarna = useMemo(() => {
        if (!selectedUkuran) return allWarna;
        return [...new Set(produk.variasis.filter(v => v.ukuran === selectedUkuran).map(v => v.warna))];
    }, [produk.variasis, selectedUkuran, allWarna]);

    const selectedVariasi = useMemo(() => {
        if (!selectedWarna || !selectedUkuran) return null;
        return produk.variasis.find(v => v.ukuran === selectedUkuran && v.warna === selectedWarna) || null;
    }, [produk.variasis, selectedWarna, selectedUkuran]);

    const stokTersedia = hasVariasi
        ? (selectedVariasi?.stok ?? 0)
        : (produk.stok ?? 0);

    const qtyError = qty > stokTersedia;

    function handleWarnaClick(warna: string) {
        if (selectedWarna === warna) {
            setSelectedWarna(null);
        } else {
            setSelectedWarna(warna);
            if (selectedUkuran && !produk.variasis.some(v => v.ukuran === selectedUkuran && v.warna === warna)) {
                setSelectedUkuran(null);
            }
        }
        setQty(1);
    }

    function handleUkuranClick(ukuran: string) {
        if (selectedUkuran === ukuran) {
            setSelectedUkuran(null);
        } else {
            setSelectedUkuran(ukuran);
            if (selectedWarna && !produk.variasis.some(v => v.ukuran === ukuran && v.warna === selectedWarna)) {
                setSelectedWarna(null);
            }
        }
        setQty(1);
    }

    const variasiLengkap = hasVariasi ? (selectedWarna !== null && selectedUkuran !== null) : true;
    const bisaTambah = stokTersedia > 0 && variasiLengkap && !qtyError;

    function handleTambahKeKeranjang() {
        if (!bisaTambah && hasVariasi) return;
        setAddedToCart(true);
        router.post(
            `/keranjang/tambah/${produk.id_produk}`,
            { produk_variasi_id: selectedVariasi?.id_produk_variasi, jumlah: qty },
            { preserveScroll: true, onFinish: () => setTimeout(() => setAddedToCart(false), 2000) }
        );
    }

    function handleBeliLangsung() {
        if (!bisaTambah && hasVariasi) return;
        setBuyingNow(true);
        router.post(
            `/keranjang/tambah/${produk.id_produk}`,
            { produk_variasi_id: selectedVariasi?.id_produk_variasi, jumlah: qty },
            { preserveScroll: true, onFinish: () => { setBuyingNow(false); router.visit('/checkout'); } }
        );
    }

    function handleTestimoni(e: React.FormEvent) {
        e.preventDefault();
        post(`/testimoni/${produk.id_produk}`, { preserveScroll: true, onSuccess: () => { setData('rating', 5); setData('komentar', ''); } });
    }

    const images: string[] = [];
    // Handle both camelCase and snake_case eager relations
    const gUtama = (produk as any).gambar_utama || produk.gambarUtama;
    const gList = produk.gambars || [];

    if (gUtama?.gambar) images.push(`/storage/${gUtama.gambar}`);
    if (gList) {
        gList.forEach((g: GambarItem) => {
            const imgPath = `/storage/${g.gambar}`;
            if (g.gambar && !images.includes(imgPath)) images.push(imgPath);
        });
    }

    // fallback if no image in database
    if (images.length === 0 && (produk as any).gambar_pertama?.gambar) {
        images.push(`/storage/${(produk as any).gambar_pertama.gambar}`);
    }

    function getWarnaColor(warna: string): string {
        return COLOR_MAP[warna.toLowerCase().replace(/\s/g, '')] || undefined;
    }

    return (
        <>
            <Head title={`${produk.nama_produk} - Runaway Denim`} />

            <div className="min-h-screen bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
                    <Link href="/produk" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-4 group text-sm font-medium">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Kembali ke Katalog</span>
                    </Link>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-4 sm:p-6 md:p-8 lg:p-10 mb-10">
                        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
                            {/* Left Column: Images */}
                            <div className="md:sticky md:top-24 md:self-start space-y-4">
                                <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-inner group">
                                    {images.length > 0 ? (
                                        <img src={images[selectedImage]} alt={produk.nama_produk} className="w-full h-full object-cover transition-all duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-100"><Package size={64} className="mb-2" /> <span>No Image</span></div>
                                    )}
                                    {diskonAktif && (
                                        <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                            {diskon.tipe === 'persen' ? `-${diskon.nilai}%` : `Diskon ${rupiah(diskon.nilai)}`}
                                        </span>
                                    )}
                                </div>
                                {images.length > 1 && (
                                    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImage(i)}
                                                className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                                                    i === selectedImage
                                                        ? 'border-primary-600 shadow-md ring-2 ring-primary-50'
                                                        : 'border-gray-200 hover:border-primary-300 opacity-80 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Info */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    {produk.kategori && (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl font-medium border border-primary-100">
                                            <Package size={12} />
                                            {produk.kategori.nama_kategori}
                                        </span>
                                    )}

                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{produk.nama_produk}</h1>

                                    {diskonAktif ? (
                                        <div className="flex items-end gap-3 pt-1">
                                            <span className="text-2xl sm:text-3xl font-bold text-primary-600">{rupiah(hargaSetelahDiskon)}</span>
                                            <span className="text-sm sm:text-base text-gray-400 line-through mb-1">{rupiah(produk.harga)}</span>
                                        </div>
                                    ) : (
                                        <span className="text-2xl sm:text-3xl font-bold text-gray-900 pt-1 block">{rupiah(produk.harga)}</span>
                                    )}
                                </div>

                                <div className="border-t border-gray-100 pt-5">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Deskripsi Produk</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">{produk.deskripsi}</p>
                                </div>

                                <div className="flex items-center gap-4 text-sm bg-gray-50 border border-gray-100 rounded-xl p-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${stokTersedia > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                        <span className="font-medium text-gray-700">
                                            {stokTersedia > 0
                                                ? `Stok: ${stokTersedia}`
                                                : (hasVariasi && (!selectedWarna || !selectedUkuran) ? 'Pilih variasi' : 'Stok Habis')
                                            }
                                        </span>
                                    </div>
                                </div>

                                {hasVariasi && (
                                    <div className="border-t border-gray-100 pt-5 space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                                Pilih Warna {selectedWarna && <span className="text-primary-600 font-medium ml-1">({selectedWarna})</span>}
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {allWarna.map((warna) => {
                                                    const isAvail = availableWarna.includes(warna);
                                                    const isSelected = selectedWarna === warna;
                                                    const colorHex = getWarnaColor(warna);
                                                    return (
                                                        <button
                                                            key={warna}
                                                            disabled={!isAvail}
                                                            onClick={() => handleWarnaClick(warna)}
                                                            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                                                                isSelected
                                                                    ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                                                                    : isAvail
                                                                        ? 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-gray-50'
                                                                        : 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            {colorHex && (
                                                                <span className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: colorHex }} />
                                                            )}
                                                            {warna}
                                                            {isSelected && (
                                                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary-600 rounded-full flex items-center justify-center">
                                                                    <CheckCircle size={8} className="text-white" />
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                                Pilih Ukuran {selectedUkuran && <span className="text-primary-600 font-medium ml-1">({selectedUkuran})</span>}
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {allUkuran.map((ukuran) => {
                                                    const isAvail = availableUkuran.includes(ukuran);
                                                    const isSelected = selectedUkuran === ukuran;
                                                    return (
                                                        <button
                                                            key={ukuran}
                                                            disabled={!isAvail}
                                                            onClick={() => handleUkuranClick(ukuran)}
                                                            className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all min-w-[50px] ${
                                                                isSelected
                                                                    ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-100'
                                                                    : isAvail
                                                                        ? 'bg-white text-gray-700 border-gray-200 hover:border-primary-400 hover:bg-gray-50'
                                                                        : 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            {ukuran}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-gray-100 pt-5 space-y-4">
                                    {!variasiLengkap && hasVariasi && (
                                        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-3.5 py-2.5 rounded-xl">
                                            <AlertCircle size={14} className="shrink-0" />
                                            Silakan tentukan warna dan ukuran terlebih dahulu
                                        </div>
                                    )}

                                    {stokTersedia === 0 && variasiLengkap && (
                                        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl">
                                            <Package size={14} className="shrink-0" />
                                            Maaf, produk ini sedang habis stok
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className={`flex items-center border rounded-xl overflow-hidden bg-white transition-all ${
                                            !variasiLengkap || stokTersedia === 0 ? 'border-gray-200 opacity-50' : 'border-gray-300'
                                        }`}>
                                            <button
                                                onClick={() => setQty(Math.max(1, qty - 1))}
                                                disabled={!variasiLengkap || stokTersedia === 0 || qty <= 1}
                                                className="p-3 hover:bg-gray-50 transition-colors disabled:text-gray-300 disabled:hover:bg-transparent"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="px-4 font-semibold min-w-[36px] text-center text-gray-900 text-sm">{qty}</span>
                                            <button
                                                onClick={() => setQty(Math.min(stokTersedia, qty + 1))}
                                                disabled={!variasiLengkap || stokTersedia === 0 || qty >= stokTersedia}
                                                className="p-3 hover:bg-gray-50 transition-colors disabled:text-gray-300 disabled:hover:bg-transparent"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {qtyError && (
                                            <span className="text-xs text-red-500 font-medium flex items-center gap-1.5">
                                                <AlertCircle size={12} />
                                                Hanya {stokTersedia} tersedia
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                        <button
                                            onClick={handleTambahKeKeranjang}
                                            disabled={!bisaTambah || processing}
                                            className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border-2 font-bold text-sm transition-all ${
                                                bisaTambah
                                                    ? 'border-primary-600 text-primary-600 bg-white hover:bg-primary-50/50 hover:border-primary-700 shadow-sm active:scale-98'
                                                    : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                                            }`}
                                        >
                                            <ShoppingCart size={18} />
                                            {addedToCart ? 'Berhasil Ditambah!' : 'Masukkan Keranjang'}
                                        </button>
                                        <button
                                            onClick={handleBeliLangsung}
                                            disabled={!bisaTambah || buyingNow}
                                            className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
                                                bisaTambah
                                                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-100 hover:shadow-lg active:scale-98'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {buyingNow ? 'Memproses...' : 'Beli Sekarang'}
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-5 grid grid-cols-2 gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-2.5">
                                        <ShieldCheck size={18} className="text-primary-500 shrink-0" />
                                        <span>Produk Original & Premium</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Truck size={18} className="text-primary-500 shrink-0" />
                                        <span>Pengiriman Seluruh Indonesia</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonials section */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl shadow-gray-100/40">
                        {(() => {
                            const ulasan = produk.testimonials || (produk as any).testimonials || [];
                            return (
                                <>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Ulasan Produk ({ulasan.length})</h2>

                                    {ulasan.length > 0 ? (
                                        <div className="space-y-6 divide-y divide-gray-100">
                                            {ulasan.map((t: any, index: number) => (
                                                <div key={index} className={`pt-6 ${index === 0 ? 'pt-0' : ''}`}>
                                                    <div className="flex items-center gap-1.5 mb-2">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <Star key={s} size={14} className={s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                                                        ))}
                                                    </div>
                                                    <p className="text-gray-700 text-sm leading-relaxed mb-2">{t.komentar}</p>
                                                    <span className="text-xs text-gray-400 font-medium">Oleh: {t.pelanggan?.nama || t.akun?.nama || t.user?.name || 'Anonim'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic py-4">Belum ada ulasan untuk produk ini.</p>
                                    )}
                                </>
                            );
                        })()}

                        {auth.user && (
                            <form onSubmit={handleTestimoni} className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                                <h3 className="font-semibold text-gray-800 text-sm">Berikan Ulasan Anda</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Rating</label>
                                        <StarInput value={data.rating} onChange={(val) => setData('rating', val)} />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 block mb-1">Komentar</label>
                                        <textarea
                                            value={data.komentar}
                                            onChange={(e) => setData('komentar', e.target.value)}
                                            rows={3}
                                            required
                                            placeholder="Tulis pendapat Anda tentang produk ini..."
                                            className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        Kirim Ulasan
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
