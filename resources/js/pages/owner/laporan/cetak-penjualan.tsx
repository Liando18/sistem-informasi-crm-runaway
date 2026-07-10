import { Head, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';

function rupiah(value: number) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

function today() {
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date());
}

export default function CetakPenjualan() {
    const { tipe, judulWaktu, orders, rows, owner } = usePage().props;

    function handlePrint() {
        window.print();
    }

    const judulLaporan = tipe === 'perhari' ? 'LAPORAN PENJUALAN PERHARI' :
        tipe === 'perbulan' ? 'LAPORAN PENJUALAN PERBULAN' : 'LAPORAN PENJUALAN PERTAHUN';

    return (
        <>
            <Head title="Cetak Laporan Penjualan" />

            <div className="no-print">
                <button onClick={handlePrint} className="print-btn">
                    <Printer size={18} />
                    Cetak / Simpan PDF
                </button>
            </div>

            <div className="print-layout">
                <div className="kop">
                    <h1>RUNAWAY DENIM</h1>
                    <p>Jl. Ujung Gurun No.49, Kelurahan Ujung Gurun, Kecamatan Padang Barat, Kota Padang, Sumatera Barat</p>
                    <p>Email: runawaydenim@gmail.com | Telp: 0821-8353-9906</p>
                </div>

                <hr className="line" />

                <h2 className="title">{judulLaporan}</h2>
                <p className="periode">{judulWaktu || ''}</p>

                {tipe === 'perhari' && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>No</th>
                                <th style={{ textAlign: 'left' }}>Pelanggan</th>
                                <th style={{ textAlign: 'left' }}>Produk</th>
                                <th style={{ width: 60, textAlign: 'center' }}>Jumlah</th>
                                <th style={{ width: 130, textAlign: 'right' }}>Total</th>
                                <th style={{ width: 90, textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(orders || []).length > 0 ? orders.map((order: any, i: number) => (
                                <tr key={order.id_pesanan || i}>
                                    <td className="text-center">{i + 1}</td>
                                    <td>{order.akun?.nama || '-'}</td>
                                    <td style={{ fontSize: '10pt' }}>
                                        {order.detail_pesanans?.map((d: any, di: number) => (
                                            <div key={di}>{d.produk?.nama_produk}{d.variasi ? ' (' + d.variasi.warna + ', ' + d.variasi.ukuran + ')' : ''} x{d.jumlah}</div>
                                        ))}
                                    </td>
                                    <td className="text-center">{order.detail_pesanans?.reduce((s: number, d: any) => s + (d.jumlah || 0), 0)}</td>
                                    <td className="text-right">{rupiah(order.grand_total)}</td>
                                    <td className="text-center">{order.status}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} className="text-center" style={{ padding: '24px 0', color: '#999' }}>Tidak ada data</td></tr>
                            )}
                        </tbody>
                    </table>
                )}

                {(tipe === 'perbulan' || tipe === 'pertahun') && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}>No</th>
                                <th style={{ textAlign: 'left' }}>{tipe === 'perbulan' ? 'Minggu Ke' : 'Bulan'}</th>
                                <th style={{ textAlign: 'center' }}>Total Barang Terjual</th>
                                <th style={{ width: 150, textAlign: 'right' }}>Total Penjualan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(rows || []).length > 0 ? rows.map((row: any, i: number) => (
                                <tr key={i}>
                                    <td className="text-center">{i + 1}</td>
                                    <td>{row.minggu_ke || row.bulan}</td>
                                    <td className="text-center">{row.total_barang}</td>
                                    <td className="text-right">{rupiah(row.total_penjualan)}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="text-center" style={{ padding: '24px 0', color: '#999' }}>Tidak ada data</td></tr>
                            )}
                        </tbody>
                    </table>
                )}

                <div className="ttd">
                    <p>Padang, {today()}</p>
                    <br /><br /><br />
                    <p className="ttd-nama">{owner?.nama || '______________________'}</p>
                    <p className="ttd-jabatan">Owner</p>
                </div>
            </div>

            <style>{`
                @page {
                    size: A4 landscape;
                    margin: 20mm 25mm;
                }

                * { margin: 0; padding: 0; box-sizing: border-box; }

                body {
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 12pt;
                    color: #000;
                    line-height: 1.5;
                }

                .print-layout {
                    max-width: 100%;
                }

                .kop {
                    text-align: center;
                    margin-bottom: 4px;
                }

                .kop h1 {
                    font-size: 22pt;
                    font-weight: bold;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-bottom: 2px;
                }

                .kop p {
                    font-size: 11pt;
                    margin-bottom: 1px;
                }

                .line {
                    border: none;
                    border-top: 2px solid #000;
                    margin: 8px 0;
                }

                .title {
                    text-align: center;
                    font-size: 14pt;
                    font-weight: bold;
                    text-decoration: underline;
                    margin: 4px 0 2px;
                }

                .periode {
                    text-align: center;
                    font-size: 11pt;
                    margin-bottom: 12px;
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11pt;
                }

                .table th, .table td {
                    border: 1px solid #000;
                    padding: 5px 7px;
                }

                .table th {
                    background: #f0f0f0;
                    font-weight: bold;
                    text-align: center;
                }

                .text-center { text-align: center; }
                .text-right { text-align: right; }

                .ttd {
                    text-align: right;
                    margin-top: 40px;
                    font-size: 11pt;
                }

                .ttd-nama {
                    font-weight: bold;
                    text-decoration: underline;
                    font-size: 12pt;
                }

                .ttd-jabatan {
                    font-size: 11pt;
                }

                .no-print {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .print-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 24px;
                    background: #7c3aed;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    font-family: 'Times New Roman', Times, serif;
                }

                .print-btn:hover {
                    background: #6d28d9;
                }

                @media print {
                    .no-print { display: none; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>
        </>
    );
}

CetakPenjualan.layout = null;
