import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Star, Sparkles, SlidersHorizontal, X } from 'lucide-react';

function rupiah(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return 'Rp ' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function StarRating({ rating = 0 }: { rating?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={13} className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
            ))}
        </div>
    );
}

function getGambar(product: any): string | null {
    return product.gambar_utama?.gambar || product.gambarUtama?.gambar || product.gambar_pertama?.gambar || product.gambarPertama?.gambar || null;
}

export default function ProdukIndex() {
    const { produks, kategoris, filters } = usePage<{
        produks?: any;
        kategoris?: any[];
        filters?: { search?: string; kategori_id?: string };
    }>().props;

    const [search, setSearch] = useState(filters?.search || '');
    const [selectedKategori, setSelectedKategori] = useState<string>(filters?.kategori_id || '');
    const [loading, setLoading] = useState(false);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        router.get('/produk', { search, kategori_id: selectedKategori }, { preserveState: true, onFinish: () => setLoading(false) });
    }

    function filterByKategori(id: string) {
        setSelectedKategori(id);
        setLoading(true);
        router.get('/produk', { search, kategori_id: id }, { preserveState: true, onFinish: () => setLoading(false) });
    }

    const items = produks?.data || [];

    return (
        <>
            <Head title="Produk - Runaway Denim" />

            <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                    <div className="absolute top-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl opacity-10" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl opacity-15" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/10">
                            <Sparkles size={16} className="text-yellow-300" />
                            Koleksi Denim Terbaru
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Produk Kami</h1>
                        <p className="text-primary-100/80 max-w-xl mx-auto">Temukan gaya denim impianmu dari koleksi premium kami</p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari produk..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50/50"
                            />
                            {search && (
                                <button type="button" onClick={() => { setSearch(''); router.get('/produk', { kategori_id: selectedKategori }, { preserveState: true }); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <button type="submit" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2">
                            <Search size={18} /> Cari
                        </button>
                    </form>

                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                        <SlidersHorizontal size={16} className="text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => filterByKategori('')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!selectedKategori ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                Semua
                            </button>
                            {(kategoris || []).map((k: any) => (
                                <button
                                    key={k.id_kategori}
                                    onClick={() => filterByKategori(String(k.id_kategori))}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${String(selectedKategori) === String(k.id_kategori) ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {k.nama_kategori}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600" />
                        </div>
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {items.map((product: any) => {
                                const gambar = getGambar(product);
                                return (
                                    <div key={product.id_produk} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <Link href={`/produk/${product.id_produk}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
                                            {gambar ? (
                                                <img src={`/storage/${gambar}`} alt={product.nama_produk} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                            )}
                                            {product.diskon && Number(product.diskon.nilai) > 0 && (
                                                <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                                                    {product.diskon.tipe === 'persen' ? `-${Number(product.diskon.nilai)}%` : `- ${rupiah(Number(product.diskon.nilai))}`}
                                                </span>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </Link>
                                        <div className="p-5">
                                            {product.kategori && (
                                                <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-full">{product.kategori.nama_kategori}</span>
                                            )}
                                            <Link href={`/produk/${product.id_produk}`} className="block text-gray-900 font-semibold mt-2 hover:text-primary-600 transition-colors line-clamp-2">{product.nama_produk}</Link>
                                            <div className="flex items-center justify-between mt-3">
                                                {product.diskon && Number(product.diskon.nilai) > 0 ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-gray-400 line-through">{rupiah(product.harga)}</span>
                                                        <span className="text-primary-600 font-bold text-lg">
                                                            {rupiah(product.diskon.tipe === 'persen' ? product.harga - (product.harga * product.diskon.nilai / 100) : product.harga - product.diskon.nilai)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-primary-600 font-bold text-lg">{rupiah(product.harga)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {produks?.links && (
                            <div className="flex justify-center gap-2 mt-10 mb-12">
                                {produks.links.map((link: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => { if (link.url) { setLoading(true); router.get(link.url, {}, { preserveState: true, onFinish: () => setLoading(false) }); } }}
                                        disabled={!link.url}
                                        className={`min-w-[40px] px-3 py-2 rounded-xl text-sm font-medium transition-all ${link.active ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Produk Tidak Ditemukan</h3>
                        <p className="text-gray-500 mb-6">Coba gunakan kata kunci lain atau pilih kategori berbeda</p>
                        <button onClick={() => { setSearch(''); setSelectedKategori(''); router.get('/produk', {}, { preserveState: true }); }} className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-md shadow-primary-200">
                            Reset Filter
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
