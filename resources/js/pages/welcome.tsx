import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { home, tentang, login, register } from '@/routes';
import produk from '@/routes/produk';
import { Search, ShoppingBag, Package, Star, MapPin, Clock, Phone, MessageCircle, Menu, X, ArrowRight, ChevronRight, Sparkles, Shield, Truck, Award, Users, User, ChevronDown, ShoppingCart, LogOut } from 'lucide-react';

function rupiah(value) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

function StarRating({ rating = 0 }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
            ))}
        </div>
    );
}

const benefits = [
    { icon: Truck, title: 'Gratis Ongkir', desc: 'Min. belanja Rp150rb' },
    { icon: Shield, title: 'Garansi Kualitas', desc: '100% original denim' },
    { icon: Sparkles, title: 'Produk Premium', desc: 'Bahan terbaik & nyaman' },
    { icon: MessageCircle, title: 'Layanan 24/7', desc: 'CS siap membantu' },
];

export default function Welcome() {
    const { auth, produkTerbaru, testimoni } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const featuredProducts = produkTerbaru?.slice(0, 8) || [];
    const testimonials = testimoni?.slice(0, 6) || [];

    return (
        <>
            <Head title="Runaway Denim - Toko Jeans Denim Terpercaya" />

            <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        <Link href={home.url()} className="flex items-center gap-2 group">
                            <img src="/logo-runaway.png" alt="Runaway Denim" className="h-8 w-8 object-contain" />
                            <span className={`font-bold text-xl tracking-tight transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>Runaway Denim</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            <Link href={home.url()} className={`font-medium transition-colors text-sm ${scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}>Beranda</Link>
                            <Link href={produk.index.url()} className={`font-medium transition-colors text-sm ${scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}>Produk</Link>
                            <Link href={tentang.url()} className={`font-medium transition-colors text-sm ${scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}>Tentang</Link>
                            {auth.user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                                            scrolled
                                                ? 'bg-primary-600 text-white hover:bg-primary-700'
                                                : 'bg-white/15 backdrop-blur-md text-white hover:bg-white/25 border border-white/20'
                                        }`}
                                    >
                                        <User size={16} />
                                        <span>{auth.user.nama}</span>
                                        <ChevronDown size={14} />
                                    </button>
                                    {userMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                                                {auth.user.role === 'pelanggan' && (
                                                    <>
                                                        <Link href="/keranjang" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                            <ShoppingCart size={16} /> Keranjang
                                                        </Link>
                                                        <Link href="/pesanan" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                            <Package size={16} /> Pesanan Saya
                                                        </Link>
                                                        <Link href="/settings/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                            <User size={16} /> Profil
                                                        </Link>
                                                        <hr className="my-2" />
                                                    </>
                                                )}
                                                {auth.user.role === 'admin' && (
                                                    <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        Dashboard Admin
                                                    </Link>
                                                )}
                                                {auth.user.role === 'owner' && (
                                                    <Link href="/owner/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                                        Dashboard Owner
                                                    </Link>
                                                )}
                                                <button onClick={() => router.post('/logout')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full">
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href={login.url()} className={`font-medium text-sm transition-colors ${scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white'}`}>Login</Link>
                                    <Link href={register.url()} className="bg-white text-primary-700 px-5 py-2 rounded-full hover:bg-primary-50 font-semibold text-sm transition-all shadow-lg shadow-primary-900/20">
                                        Daftar
                                    </Link>
                                </div>
                            )}
                        </div>

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {mobileMenuOpen && (
                        <div className="md:hidden pb-6 border-t border-white/10 bg-white rounded-b-2xl shadow-xl">
                            <div className="flex flex-col gap-2 pt-4 px-2">
                                <Link href={home.url()} className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all">Beranda</Link>
                                <Link href={produk.index.url()} className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all">Produk</Link>
                                <Link href={tentang.url()} className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all">Tentang</Link>
                                <div className="border-t border-gray-100 my-2" />
                                {auth.user ? (
                                    <>
                                        {auth.user.role === 'pelanggan' && (
                                            <>
                                                <Link href="/keranjang" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Keranjang</Link>
                                                <Link href="/pesanan" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Pesanan Saya</Link>
                                                <Link href="/settings/profile" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Profil</Link>
                                            </>
                                        )}
                                        {auth.user.role === 'admin' && (
                                            <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Dashboard Admin</Link>
                                        )}
                                        {auth.user.role === 'owner' && (
                                            <Link href="/owner/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Dashboard Owner</Link>
                                        )}
                                        <button onClick={() => { setMobileMenuOpen(false); router.post('/logout'); }} className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium text-left">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href={login.url()} className="px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-all">Login</Link>
                                        <Link href={register.url()} className="mx-2 bg-primary-600 text-white px-5 py-3 rounded-xl text-center font-semibold hover:bg-primary-700 transition-all shadow-lg">Daftar</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.12)_0%,transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.3)_0%,transparent_50%)]" />
                    <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                    <div className="absolute top-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl opacity-10 animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl opacity-15" />
                    <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary-400 rounded-full blur-3xl opacity-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500 rounded-full blur-3xl opacity-20" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 md:pt-36 md:pb-28">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10">
                            <Sparkles size={16} className="text-yellow-300" />
                            Koleksi Denim Terbaru 2026
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                            Cari Denim
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white">Impianmu</span>
                        </h1>
                        <p className="text-lg text-primary-100/80 mb-10 max-w-lg mx-auto">
                            Ribuan koleksi denim premium siap menemani gaya terbaikmu
                        </p>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const q = (e.target as any).query.value?.trim();
                                if (q) {
                                    router.get('/produk', { search: q });
                                } else {
                                    router.get('/produk');
                                }
                            }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="relative flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-full shadow-2xl shadow-primary-900/30 hover:bg-white/20 transition-all group focus-within:bg-white/20 focus-within:border-white/40 focus-within:shadow-primary-500/20">
                                <Search className="absolute left-5 h-5 w-5 text-white/60 group-focus-within:text-white/90 transition-colors" />
                                <input
                                    name="query"
                                    type="text"
                                    placeholder="Cari produk denim..."
                                    className="flex-1 bg-transparent text-white placeholder-white/50 pl-14 pr-6 py-5 text-lg outline-none rounded-full"
                                />
                                <button
                                    type="submit"
                                    className="mr-2 bg-white text-primary-700 px-8 py-3 rounded-full font-bold hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Cari
                                </button>
                            </div>
                        </form>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <Link href="/produk" className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 hover:bg-white/20 hover:text-white transition-all border border-white/10">
                                Semua Produk
                            </Link>
                            <Link href="/produk?kategori_id=1" className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 hover:bg-white/20 hover:text-white transition-all border border-white/10">
                                Jeans Pria
                            </Link>
                            <Link href="/produk?kategori_id=2" className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 hover:bg-white/20 hover:text-white transition-all border border-white/10">
                                Jeans Wanita
                            </Link>
                            <Link href="/produk?kategori_id=3" className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 hover:bg-white/20 hover:text-white transition-all border border-white/10">
                                Jaket Denim
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-16 md:py-24">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(43,37,137,0.04)_0%,transparent_60%)]" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-20" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-primary-100">Keunggulan Kami</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Memilih Kami?</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Kami berkomitmen memberikan pengalaman belanja denim terbaik untukmu</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
                        {benefits.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="group relative bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative">
                                        <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200 group-hover:shadow-xl group-hover:shadow-primary-300 group-hover:scale-110 transition-all duration-300">
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Produk Terbaru</h2>
                            <p className="text-gray-500 mt-2">Koleksi denim terbaru yang siap menemani aktivitasmu</p>
                        </div>
                        <Link href={produk.index.url()} className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold group whitespace-nowrap">
                            Lihat Semua
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {featuredProducts.map((product) => {
                            const gambar = product.gambar_utama?.gambar || product.gambar_pertama?.gambar || product.gambarUtama?.gambar || product.gambarPertama?.gambar;
                            return (
                                <div key={product.id_produk} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                        {gambar ? (
                                            <img src={`/storage/${gambar}`} alt={product.nama_produk} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                        )}
                                        {product.diskon && product.diskon.nilai > 0 && (
                                            <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                                {product.diskon.tipe === 'persen' ? `-${product.diskon.nilai}%` : `Diskon ${rupiah(product.diskon.nilai)}`}
                                            </span>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                            <Link href={`/produk/${product.id_produk}`} className="bg-white text-primary-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-primary-50 transition-colors">
                                                Detail
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-5">
                                        {product.kategori && (
                                            <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-full">{product.kategori.nama_kategori || product.kategori.nama}</span>
                                        )}
                                        <Link href={`/produk/${product.id_produk}`} className="block text-gray-900 font-semibold mt-2 hover:text-primary-600 transition-colors leading-tight">
                                            {product.nama_produk}
                                        </Link>
                                        <div className="flex items-center justify-between mt-3">
                                            {product.diskon && product.diskon.nilai > 0 ? (
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
                </div>
            </section>

            {testimonials.length > 0 && (
                <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Apa Kata Pelanggan?</h2>
                        <p className="text-primary-200 text-center mb-12 max-w-xl mx-auto">Kepuasan pelanggan adalah prioritas utama kami</p>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                            {testimonials.map((t, i) => (
                                <div key={`testimonial-${t.id_comentario || i}`} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
                                    <StarRating rating={t.rating} />
                                    <p className="text-gray-200 mt-4 leading-relaxed">{t.komentar}</p>
                                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0">
                                            {(t.akun?.nama || 'A')[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">{t.akun?.nama || 'User'}</p>
                                            {t.produk && <p className="text-xs text-primary-300 mt-0.5">{t.produk.nama_produk}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Tentang Runaway Denim</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                                Runaway Denim adalah destinasi utama fashion denim di Kota Padang. Kami menghadirkan koleksi jeans, jaket, dan aksesoris denim berkualitas premium dengan harga yang terjangkau.
                            </p>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Setiap produk kami pilih dengan teliti untuk memastikan kualitas bahan, kenyamanan, dan desain yang sesuai dengan trend terkini. Kepuasan pelanggan adalah komitmen utama kami.
                            </p>
                            <Link href={tentang.url()} className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300">
                                Selengkapnya
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 to-primary-600 rounded-3xl blur-2xl opacity-20" />
                            <div className="relative bg-primary-600 rounded-2xl p-8 md:p-10 text-white shadow-2xl">
                                <ShoppingBag className="h-12 w-12 text-primary-200 mb-6" />
                                <h3 className="text-2xl font-bold mb-4">Kenapa Runaway Denim?</h3>
                                <ul className="space-y-4">
                                    {['Produk denim original berkualitas tinggi', 'Harga terjangkau dengan diskon spesial', 'Pengiriman cepat ke seluruh Indonesia', 'Pelayanan ramah dan profesional', 'Garansi kepuasan 100%'].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="bg-white/20 rounded-full p-0.5 mt-0.5 shrink-0">
                                                <ChevronRight size={14} className="text-white" />
                                            </div>
                                            <span className="text-primary-50">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kunjungi Toko Kami</h2>
                            <p className="text-gray-500 mb-8">Datang langsung dan temukan koleksi denim impianmu</p>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-600 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-200">
                                        <MapPin className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Alamat Lengkap</p>
                                        <p className="text-gray-600">Jl. Ujung Gurun No.49, Kelurahan Ujung Gurun, Kecamatan Padang Barat, Kota Padang, Sumatera Barat</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-600 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-200">
                                        <Clock className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Jam Operasional</p>
                                        <p className="text-gray-600">Senin - Minggu: 12.00 - 22.00 WIB</p>
                                        <p className="text-sm text-gray-400">*Buka setiap hari termasuk hari libur</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary-600 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-200">
                                        <Phone className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Kontak</p>
                                        <a href="https://wa.me/6282183539906" target="_blank" className="text-primary-600 hover:text-primary-700 font-medium">0821-8353-9906 (WhatsApp)</a>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link href={tentang.url()} className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300">
                                        Selengkapnya
                                        <ChevronRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.312260755637!2d100.352651!3d-0.952632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b8b3b3b3b3b3%3A0x3b3b3b3b3b3b3b3b!2sJl.%20Ujung%20Gurun%20No.49%2C%20Kota%20Padang!5e0!3m2!1sid!2sid!4v1"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Peta Lokasi Runaway Denim"
                                className="absolute inset-0"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 pb-12 border-b border-gray-800">
                        <div className="md:col-span-1">
                            <Link href={home.url()} className="flex items-center gap-2 mb-4">
                                <img src="/logo-runaway.png" alt="Runaway Denim" className="h-8 w-8 object-contain bg-white rounded-lg p-0.5" />
                                <span className="font-bold text-xl">Runaway Denim</span>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed">Toko jeans denim terpercaya di Kota Padang. Kualitas premium, harga bersahabat.</p>
                            <div className="flex gap-3 mt-6">
                                <a href="https://wa.me/6282183539906" target="_blank" className="bg-gray-800 hover:bg-green-600 p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                                    <MessageCircle size={18} />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Menu</h4>
                            <div className="flex flex-col gap-3 text-sm text-gray-400">
                                <Link href={home.url()} className="hover:text-white transition-colors">Beranda</Link>
                                <Link href={produk.index.url()} className="hover:text-white transition-colors">Produk</Link>
                                <Link href={tentang.url()} className="hover:text-white transition-colors">Tentang</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Kontak</h4>
                            <div className="flex flex-col gap-4 text-sm text-gray-400">
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="mt-0.5 shrink-0 text-primary-400" />
                                    <span>Jl. Ujung Gurun No.49, Kota Padang</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone size={16} className="mt-0.5 shrink-0 text-primary-400" />
                                    <a href="https://wa.me/6282183539906" target="_blank" className="hover:text-white transition-colors">0821-8353-9906</a>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock size={16} className="mt-0.5 shrink-0 text-primary-400" />
                                    <span>12:00 - 22:00 WIB</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Jam Toko</h4>
                            <div className="flex flex-col gap-3 text-sm text-gray-400">
                                <div className="flex justify-between">
                                    <span>Senin - Minggu</span>
                                    <span className="text-white">12:00 - 22:00</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">*Termasuk hari libur nasional</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Runaway Denim. Hak Cipta Dilindungi.
                    </div>
                </div>
            </footer>

            {auth.user && auth.user.role === 'pelanggan' ? (
                <Link
                    href="/chat"
                    className="fixed bottom-6 right-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-2xl hover:shadow-primary-500/40 hover:scale-110 transition-all duration-300 z-50 group"
                    aria-label="Chat"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                </Link>
            ) : (
                <a
                    href="https://wa.me/6282183539906"
                    target="_blank"
                    className="fixed bottom-6 right-6 bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/40 hover:scale-110 transition-all duration-300 z-50 group"
                    aria-label="Chat WhatsApp"
                >
                    <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
                </a>
            )}
        </>
    );
}
