import { Head, Link, usePage, useForm } from '@inertiajs/react'
import AddressPicker from '@/components/address-picker'
import MapPicker from '@/components/map-picker'
import { ShoppingCart, Ticket, Check, MapPin, ArrowLeft, CreditCard, Package } from 'lucide-react'
import { proses } from '@/routes/checkout'
import type { Auth } from '@/types'
import { useState } from 'react'

function rupiah(value: number): string {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value))
}

interface Variasi {
    id_produk_variasi: number
    ukuran: string
    warna: string
    stok: number
}

interface GambarUtama {
    gambar: string
}

interface Produk {
    id: number
    nama: string
    harga: number
    gambarUtama?: GambarUtama
    variasis?: Variasi[]
}

interface KeranjangItem {
    id: number
    produk_id: number
    produk_variasi_id: number | null
    jumlah: number
    produk: Produk
}

interface DiskonItem {
    id_diskon: number
    nama_diskon: string
    kode: string
    tipe: 'persen' | 'nominal'
    nilai: number
    min_belanja: number | null
    status: string
    tanggal_mulai: string
    tanggal_berakhir: string
}

export default function CheckoutIndex() {
    const { items, total, diskons, auth } = usePage<{ props: { items: KeranjangItem[]; total: number; diskons: DiskonItem[]; auth: Auth } }>().props

    const { data, setData, post, processing, errors } = useForm({
        provinsi: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
        alamat_detail: '',
        no_telp_kirim: (auth.user?.no_telp as string) ?? '',
        latitude: '',
        longitude: '',
        catatan: '',
        kode_diskon: '',
    })

    const [applyingDiskon, setApplyingDiskon] = useState(false)
    const [diskonTerapkan, setDiskonTerapkan] = useState<DiskonItem | null>(null)

    const totalHarga: number = total || items.reduce((sum, item) => sum + item.produk.harga * item.jumlah, 0)
    const potongan: number = diskonTerapkan
        ? diskonTerapkan.tipe === 'persen'
            ? totalHarga * diskonTerapkan.nilai / 100
            : Math.min(diskonTerapkan.nilai, totalHarga)
        : 0
    const grandTotal: number = totalHarga - potongan

    function applyDiskon() {
        if (!data.kode_diskon.trim()) return
        setApplyingDiskon(true)
        const ditemukan = diskons.find(
            (d) => d.kode.toLowerCase() === data.kode_diskon.trim().toLowerCase() && d.status === 'aktif'
        )
        if (ditemukan) {
            setDiskonTerapkan(ditemukan)
        } else {
            setDiskonTerapkan(null)
        }
        setApplyingDiskon(false)
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        post(proses.url(), { preserveScroll: true })
    }

    return (
        <>
            <Head title="Checkout - Runaway Denim" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/keranjang" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-6 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Kembali ke Keranjang</span>
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
                                <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                                    <MapPin size={20} className="text-primary-600" />
                                    Alamat Pengiriman
                                </h2>
                                <AddressPicker
                                    value={data}
                                    onChange={(field, value) => setData(field as keyof typeof data, value)}
                                    errors={errors}
                                />
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
                                <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                                    <MapPin size={20} className="text-primary-600" />
                                    Pilih Lokasi di Peta
                                </h2>
                                <MapPicker
                                    latitude={data.latitude}
                                    longitude={data.longitude}
                                    onChange={(field, value) => setData(field as keyof typeof data, value)}
                                />
                                {errors.latitude && <p className="text-red-500 text-sm mt-2">{errors.latitude}</p>}
                                {errors.longitude && <p className="text-red-500 text-sm mt-2">{errors.longitude}</p>}
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
                                <h2 className="font-bold text-gray-900 text-lg mb-5">Catatan (opsional)</h2>
                                <textarea
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    rows={2}
                                    placeholder="Catatan untuk penjual..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-gray-50/50"
                                />
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm">
                                <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                                    <Ticket size={20} className="text-primary-600" />
                                    Diskon
                                </h2>
                                {diskons.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2">Kode diskon tersedia:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {diskons.filter((d) => d.status === 'aktif').map((d) => (
                                                <button
                                                    key={d.id_diskon}
                                                    type="button"
                                                    onClick={() => {
                                                        setData('kode_diskon', d.kode)
                                                        setDiskonTerapkan(d)
                                                    }}
                                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${data.kode_diskon === d.kode ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary-300'}`}
                                                >
                                                    {d.kode}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={data.kode_diskon}
                                        onChange={(e) => {
                                            setData('kode_diskon', e.target.value)
                                            if (diskonTerapkan && e.target.value !== diskonTerapkan.kode) {
                                                setDiskonTerapkan(null)
                                            }
                                        }}
                                        placeholder="Masukkan kode diskon"
                                        className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-gray-50/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={applyDiskon}
                                        disabled={applyingDiskon || !data.kode_diskon}
                                        className="bg-primary-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center gap-1 shadow-md shadow-primary-200"
                                    >
                                        <Ticket size={16} /> Terapkan
                                    </button>
                                </div>
                                {diskonTerapkan && (
                                    <div className="mt-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 border border-green-100">
                                        <Check size={18} className="text-green-500" /> {diskonTerapkan.nama_diskon || 'Diskon'} — Potongan {rupiah(potongan)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-7 shadow-sm h-fit lg:sticky lg:top-24">
                            <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                                <Package size={20} className="text-primary-600" />
                                Ringkasan Pesanan
                            </h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => {
                                    const produk = item.produk
                                    const selectedVariasi = produk.variasis?.find(
                                        (v) => v.id_produk_variasi === item.produk_variasi_id
                                    )
                                    return (
                                        <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                {produk.gambarUtama?.gambar && (
                                                    <img
                                                        src={`/storage/${produk.gambarUtama.gambar}`}
                                                        alt={produk.nama}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{produk.nama}</p>
                                                {item.produk_variasi_id && selectedVariasi && (
                                                    <p className="text-xs text-gray-400">
                                                        {selectedVariasi.ukuran} / {selectedVariasi.warna}
                                                    </p>
                                                )}
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-gray-400">x{item.jumlah}</span>
                                                    <span className="text-sm font-semibold text-gray-900">{rupiah(produk.harga * item.jumlah)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-semibold">{rupiah(totalHarga)}</span>
                                </div>
                                {potongan > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Potongan</span>
                                        <span>-{rupiah(potongan)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-gray-100 mt-4 pt-4">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>Grand Total</span>
                                    <span className="text-primary-600">{rupiah(grandTotal)}</span>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={processing || items.length === 0}
                                className="mt-6 w-full bg-gradient-to-r from-primary-600 to-primary-600 text-white py-3.5 rounded-xl font-bold hover:from-primary-700 hover:to-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</span>
                                ) : (
                                    <><CreditCard size={20} /> Bayar Sekarang</>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
