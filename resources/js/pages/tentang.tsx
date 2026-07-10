import { Head, Link } from '@inertiajs/react'
import { home, tentang } from '@/routes'
import produk from '@/routes/produk'
import { MapPin, Clock, Phone, MessageCircle, Star, Shield, Sparkles, Truck, Award, Users, ThumbsUp, Send, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const benefitsData = [
    { icon: Truck, title: 'Gratis Ongkir', desc: 'Min. belanja Rp150rb', color: 'from-primary-500 to-primary-600' },
    { icon: Shield, title: 'Garansi Kualitas', desc: '100% denim original premium', color: 'from-green-500 to-green-600' },
    { icon: Sparkles, title: 'Produk Premium', desc: 'Bahan terbaik & nyaman dipakai', color: 'from-purple-500 to-purple-600' },
    { icon: Award, title: 'Bergaransi', desc: 'Garansi kepuasan 100%', color: 'from-amber-500 to-amber-600' },
    { icon: Users, title: 'Terpercaya', desc: 'Ribuan pelanggan setia', color: 'from-rose-500 to-rose-600' },
    { icon: ThumbsUp, title: 'Pelayanan Terbaik', desc: 'CS ramah & responsif', color: 'from-cyan-500 to-cyan-600' },
]

export default function Tentang() {
    const [formData, setFormData] = useState({ nama: '', email: '', pesan: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const contactInfo = [
        { icon: MapPin, title: 'Alamat Lengkap', desc: 'Jl. Ujung Gurun No.49, Kelurahan Ujung Gurun, Kecamatan Padang Barat, Kota Padang, Sumatera Barat' },
        { icon: Clock, title: 'Jam Operasional', desc: 'Senin - Minggu: 12.00 - 22.00 WIB', note: '*Termasuk hari libur nasional' },
        { icon: Phone, title: 'WhatsApp', desc: '0821-8353-9906', isLink: true, linkHref: 'https://wa.me/6282183539906' },
    ]

    return (
        <>
            <Head title="Tentang Kami - Runaway Denim" />

            <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                    <div className="absolute top-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl opacity-10" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300 rounded-full blur-3xl opacity-15" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500 rounded-full blur-3xl opacity-20" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10">
                        <Sparkles size={16} className="text-yellow-300" />
                        Cerita Di Balik Denim
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                        Tentang
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white">Runaway Denim</span>
                    </h1>
                    <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
                        Destinasi utama fashion denim di Kota Padang. Kualitas premium, harga terjangkau, dan pelayanan terbaik.
                    </p>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                        <div>
                            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Tentang Kami</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">Cerita Kami</h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-6">
                                Runaway Denim lahir dari kecintaan terhadap fashion denim dan keinginan untuk menghadirkan produk berkualitas tinggi dengan harga yang terjangkau bagi masyarakat Indonesia, khususnya di Kota Padang.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Berawal dari sebuah toko kecil, kami terus berkembang menjadi destinasi utama fashion denim di Sumatera Barat. Setiap produk yang kami jual telah melalui proses seleksi ketat untuk memastikan kualitas bahan, kenyamanan, dan desain yang sesuai dengan trend terkini.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Kami percaya bahwa fashion adalah bentuk ekspresi diri. Itulah mengapa kami selalu berusaha menghadirkan koleksi denim terbaik yang mencerminkan kepribadian dan gaya hidup setiap pelanggan.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 to-primary-600 rounded-3xl blur-2xl opacity-20" />
                            <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-10 text-white shadow-2xl text-center">
                                <img src="/logo-runaway.png" alt="Runaway Denim" className="mx-auto mb-6 h-24 w-24 object-contain bg-white rounded-2xl p-3" />
                                <h3 className="text-2xl font-bold mb-2">Runaway Denim</h3>
                                <p className="text-primary-200">Sejak 2020 • Terpercaya • Berkualitas</p>
                                <div className="mt-6 pt-6 border-t border-white/20">
                                    <p className="text-primary-100 text-sm">"Fashion denim terbaik untuk gaya hidup modern"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Mengapa Kami</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">Mengapa Memilih Runaway Denim?</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Kami berkomitmen memberikan pengalaman belanja denim terbaik untukmu</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {benefitsData.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <div key={i} className="group bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className={`bg-gradient-to-br ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div>
                            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Kunjungi</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">Temukan Kami</h2>
                            <p className="text-gray-500 mb-8">Datang langsung dan temukan koleksi denim impianmu</p>
                            <div className="space-y-5">
                                {contactInfo.map((item, i) => {
                                    const Icon = item.icon
                                    return (
                                        <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                            <div className="bg-primary-600 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-200">
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{item.title}</p>
                                                {item.isLink ? (
                                                    <a href={item.linkHref} target="_blank" className="text-primary-600 hover:text-primary-700 font-medium">{item.desc}</a>
                                                ) : (
                                                    <>
                                                        <p className="text-gray-600">{item.desc}</p>
                                                        {item.note && <p className="text-sm text-gray-400">{item.note}</p>}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div>
                            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Kirim Pesan</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">Hubungi Kami</h2>
                            <p className="text-gray-500 mb-8">Punya pertanyaan atau butuh bantuan? Kami siap membantu.</p>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                                    <input
                                        type="text"
                                        name="nama"
                                        value={formData.nama}
                                        onChange={handleChange}
                                        placeholder="Masukkan nama"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
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
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                                    <textarea
                                        name="pesan"
                                        rows={4}
                                        value={formData.pesan}
                                        onChange={handleChange}
                                        placeholder="Tulis pesan..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
                                >
                                    <Send size={18} />
                                    Kirim Pesan
                                </button>
                                <p className="text-xs text-gray-400">Atau hubungi kami langsung via <a href="https://wa.me/6282183539906" target="_blank" className="text-primary-600 font-medium">WhatsApp</a></p>
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
                    <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
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


        </>
    )
}
