import { Head, Link } from '@inertiajs/react'
import produk from '@/routes/produk'
import { MapPin, Clock, Phone, MessageCircle, Star, Shield, Sparkles, Truck, ChevronRight, Mail, Send, Instagram, Facebook, Youtube } from 'lucide-react'
import { useState } from 'react'

export default function Kontak() {
    const [formData, setFormData] = useState({ nama: '', email: '', pesan: '' })

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    return (
        <>
            <Head title="Kontak - Runaway Denim" />

            <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                    <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl opacity-10" />
                    <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary-300 rounded-full blur-3xl opacity-10" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10">
                        <MessageCircle size={16} className="text-green-300" />
                        Hubungi Kami
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                        Hubungi
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white">Kami</span>
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
                        Punya pertanyaan atau butuh bantuan? Tim kami siap membantu kamu.
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </section>

            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Informasi</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">Hubungi Kami</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Kami siap membantu Anda 7 hari seminggu</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <div className="group bg-gradient-to-br from-white to-primary-50 rounded-2xl p-6 md:p-8 text-center border border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Alamat</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Jl. Ujung Gurun No.49<br />Kota Padang</p>
                        </div>
                        <div className="group bg-gradient-to-br from-white to-primary-50 rounded-2xl p-6 md:p-8 text-center border border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                                <Phone className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Telepon</h3>
                            <a href="https://wa.me/6282183539906" target="_blank" className="text-primary-600 hover:text-primary-700 text-sm font-medium">0821-8353-9906</a>
                        </div>
                        <div className="group bg-gradient-to-br from-white to-primary-50 rounded-2xl p-6 md:p-8 text-center border border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-primary-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200 group-hover:scale-110 transition-transform duration-300">
                                <Clock className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Jam Operasional</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">Senin - Minggu<br />12:00 - 22:00 WIB</p>
                        </div>
                        <div className="group bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 md:p-8 text-center border border-green-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="bg-green-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform duration-300">
                                <MessageCircle className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
                            <a href="https://wa.me/6282183539906" target="_blank" className="text-green-600 hover:text-green-700 text-sm font-medium">Chat Sekarang</a>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="nama"
                                        value={formData.nama}
                                        onChange={handleChange}
                                        placeholder="Masukkan nama lengkap"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Masukkan email"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-700 placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                                    <textarea
                                        name="pesan"
                                        rows={5}
                                        value={formData.pesan}
                                        onChange={handleChange}
                                        placeholder="Tulis pesan Anda di sini..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-gray-700 placeholder-gray-400 resize-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 hover:-translate-y-0.5"
                                >
                                    <Send size={18} />
                                    Kirim Pesan
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Media Sosial</h3>
                            <p className="text-gray-500 mb-8">Ikuti kami di media sosial untuk mendapatkan info terbaru dan promo spesial</p>
                            <div className="space-y-5">
                                <a href="https://instagram.com/runawaydenim" target="_blank" className="flex items-center gap-5 p-5 bg-gradient-to-br from-pink-50 to-white rounded-xl border border-pink-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                                    <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Instagram className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Instagram</p>
                                        <p className="text-sm text-gray-500">@runawaydenim</p>
                                    </div>
                                    <ChevronRight size={20} className="ml-auto text-pink-400 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a href="https://facebook.com/runawaydenim" target="_blank" className="flex items-center gap-5 p-5 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                                    <div className="bg-primary-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Facebook className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Facebook</p>
                                        <p className="text-sm text-gray-500">Runaway Denim</p>
                                    </div>
                                    <ChevronRight size={20} className="ml-auto text-primary-400 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a href="https://youtube.com/@runawaydenim" target="_blank" className="flex items-center gap-5 p-5 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
                                    <div className="bg-gradient-to-br from-red-500 to-red-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Youtube className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">YouTube</p>
                                        <p className="text-sm text-gray-500">Runaway Denim</p>
                                    </div>
                                    <ChevronRight size={20} className="ml-auto text-red-400 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Lokasi</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">Temukan Kami di Peta</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Kunjungi toko kami di Jl. Ujung Gurun No.49, Kota Padang</p>
                    </div>
                    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
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
            </section>

            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 pb-12 border-b border-gray-800">
                        <div className="md:col-span-1">
                            <Link href={home()} className="flex items-center gap-2 mb-4">
                                <img src="/logo-runaway.png" alt="Runaway Denim" className="h-8 w-8 object-contain" />
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
                                <Link href={home()} className="hover:text-white transition-colors">Beranda</Link>
                                <Link href={produk.index.url()} className="hover:text-white transition-colors">Produk</Link>
                                <Link href="/tentang" className="hover:text-white transition-colors">Tentang</Link>
                                <Link href="/kontak" className="hover:text-white transition-colors">Kontak</Link>
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

            <a
                href="https://wa.me/6282183539906"
                target="_blank"
                className="fixed bottom-6 right-6 bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/40 hover:scale-110 transition-all duration-300 z-50 group"
                aria-label="Chat WhatsApp"
            >
                <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
            </a>
        </>
    )
}
