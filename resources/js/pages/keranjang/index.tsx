import { Head, Link, usePage, router } from '@inertiajs/react';
import { Trash2, Minus, Plus, ShoppingCart, ShoppingBag, ArrowLeft } from 'lucide-react';

function rupiah(value: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

interface Variasi {
    id_produk_variasi: number;
    ukuran: string;
    warna: string;
    stok: number;
}

interface GambarUtama {
    gambar: string;
}

interface Produk {
    id: number;
    nama: string;
    harga: number;
    gambarUtama?: GambarUtama;
    variasis?: Variasi[];
}

interface KeranjangItem {
    id: number;
    produk_id: number;
    produk_variasi_id: number | null;
    jumlah: number;
    produk: Produk;
}

interface KeranjangData {
    data: KeranjangItem[];
}

interface KeranjangPageProps {
    keranjang: KeranjangData | KeranjangItem[];
    total: number;
    [key: string]: unknown;
}

export default function KeranjangIndex() {
    const { keranjang, total } = usePage<KeranjangPageProps>().props;

    function updateQty(item: KeranjangItem, qty: number): void {
        if (qty < 1) return;
        router.patch(`/keranjang/${item.id}`, { jumlah: qty }, { preserveScroll: true, preserveState: true });
    }

    function hapusItem(item: KeranjangItem): void {
        router.delete(`/keranjang/${item.id}`, { preserveScroll: true });
    }

    const items: KeranjangItem[] = (keranjang as KeranjangData)?.data || keranjang as KeranjangItem[] || [];
    const totalHarga: number = total || items.reduce((sum, item) => sum + (item.produk?.harga || 0) * item.jumlah, 0);

    return (
        <>
            <Head title="Keranjang - Runaway Denim" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/produk" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Lanjut Belanja</span>
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Belanja</h1>

                {items.length > 0 ? (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => {
                                const produk = item.produk;
                                const harga = produk.harga;
                                const selectedVariasi = produk.variasis?.find(
                                    (v) => v.id_produk_variasi === item.produk_variasi_id
                                );
                                return (
                                    <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 shadow-sm hover:shadow-md transition-all flex gap-4">
                                        <Link href={`/produk/${produk.id}`} className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                            {produk.gambarUtama?.gambar && <img src={`/storage/${produk.gambarUtama.gambar}`} alt={produk.nama} className="w-full h-full object-cover" />}
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link href={`/produk/${produk.id}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">{produk.nama}</Link>
                                                    {item.produk_variasi_id && selectedVariasi && (
                                                        <p className="text-sm text-gray-400 mt-0.5">
                                                            {selectedVariasi.ukuran} / {selectedVariasi.warna}
                                                        </p>
                                                    )}
                                                </div>
                                                <button onClick={() => hapusItem(item)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <p className="text-primary-600 font-bold mt-2">{rupiah(harga)}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                                    <button onClick={() => updateQty(item, item.jumlah - 1)} className="p-2 hover:bg-gray-100 transition-colors"><Minus size={16} /></button>
                                                    <span className="px-4 font-semibold text-sm min-w-[32px] text-center">{item.jumlah}</span>
                                                    <button onClick={() => updateQty(item, item.jumlah + 1)} className="p-2 hover:bg-gray-100 transition-colors"><Plus size={16} /></button>
                                                </div>
                                                <p className="font-bold text-gray-900">{rupiah(harga * item.jumlah)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit lg:sticky lg:top-24">
                            <h3 className="font-bold text-gray-900 text-lg mb-5">Ringkasan Belanja</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Total Barang</span>
                                    <span className="font-semibold text-gray-900">{items.length} item</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-900">{rupiah(totalHarga)}</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 mt-5 pt-5">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">{rupiah(totalHarga)}</span>
                                </div>
                            </div>
                            <Link
                                href="/checkout"
                                className="mt-6 w-full bg-gradient-to-r from-primary-600 to-primary-600 text-white py-3.5 rounded-xl font-bold hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} /> Checkout
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h3>
                        <p className="text-gray-500 mb-8">Yuk, mulai belanja produk denim favoritmu!</p>
                        <Link href="/produk" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200">
                            <ShoppingBag size={20} /> Mulai Belanja
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
