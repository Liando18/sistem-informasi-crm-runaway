import { Head, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';

function rupiah(value: number) {
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(value));
}

export default function CetakInvoice() {
    const { pesanan } = usePage().props;
    const items = pesanan?.detail_pesanans || [];

    function handlePrint() {
        window.print();
    }

    return (
        <>
            <Head title="Invoice" />

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

                <div className="invoice-header">
                    <div>
                        <h2 className="title">INVOICE</h2>
                        <p className="invoice-no">No. {pesanan.id_pesanan}</p>
                    </div>
                    <div className="invoice-date">
                        <p>Padang, {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(pesanan.tgl_pesanan))}</p>
                    </div>
                </div>

                <div className="customer-info">
                    <table>
                        <tbody>
                            <tr><td className="label">Pelanggan</td><td>: {pesanan.akun?.nama || '-'}</td></tr>
                            <tr><td className="label">Alamat</td><td>: {[pesanan.alamat_detail, pesanan.kelurahan, pesanan.kecamatan, pesanan.kabupaten, pesanan.provinsi].filter(Boolean).join(', ') || '-'}</td></tr>
                            <tr><td className="label">No. Telp</td><td>: {pesanan.no_telp_kirim || '-'}</td></tr>
                        </tbody>
                    </table>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>No</th>
                            <th style={{ textAlign: 'left' }}>Produk</th>
                            <th style={{ textAlign: 'center', width: 60 }}>Qty</th>
                            <th style={{ textAlign: 'right', width: 120 }}>Harga</th>
                            <th style={{ textAlign: 'right', width: 130 }}>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? items.map((d: any, i: number) => (
                            <tr key={d.id_detail || i}>
                                <td className="text-center">{i + 1}</td>
                                <td>
                                    {d.produk?.nama_produk}
                                    {d.variasi ? <span className="varian"> ({d.variasi.warna}, {d.variasi.ukuran})</span> : ''}
                                </td>
                                <td className="text-center">{d.jumlah}</td>
                                <td className="text-right">{rupiah(d.harga)}</td>
                                <td className="text-right">{rupiah(d.subtotal)}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="text-center" style={{ padding: '24px 0', color: '#999' }}>Tidak ada data</td></tr>
                        )}
                    </tbody>
                </table>

                <div className="total-section">
                    <table className="total-table">
                        <tbody>
                            <tr><td className="label">Total Harga</td><td className="value">{rupiah(pesanan.total_harga)}</td></tr>
                            {parseFloat(pesanan.potongan || 0) > 0 && (
                                <tr><td className="label">Potongan</td><td className="value">-{rupiah(pesanan.potongan)}</td></tr>
                            )}
                            {pesanan.diskon && (
                                <tr><td className="label">Voucher Ongkir</td><td className="value">-{rupiah(pesanan.diskon?.nilai || 0)}</td></tr>
                            )}
                            <tr className="grand-total"><td className="label">Grand Total</td><td className="value">{rupiah(pesanan.grand_total)}</td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="status-section">
                    <p>Status: <strong>{pesanan.status}</strong></p>
                </div>
            </div>

            <style>{`
                @page {
                    size: A4 portrait;
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

                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 16px;
                }

                .title {
                    font-size: 18pt;
                    font-weight: bold;
                    text-align: left;
                }

                .invoice-no {
                    font-size: 11pt;
                    color: #555;
                }

                .invoice-date {
                    font-size: 11pt;
                    text-align: right;
                }

                .customer-info {
                    margin-bottom: 16px;
                    font-size: 11pt;
                }

                .customer-info .label {
                    font-weight: bold;
                    padding-right: 8px;
                    white-space: nowrap;
                    vertical-align: top;
                }

                .table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11pt;
                    margin-bottom: 16px;
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

                .varian {
                    font-weight: normal;
                    font-size: 10pt;
                    color: #555;
                }

                .text-center { text-align: center; }
                .text-right { text-align: right; }

                .total-section {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 12px;
                }

                .total-table {
                    border-collapse: collapse;
                    font-size: 11pt;
                    width: 300px;
                }

                .total-table td {
                    padding: 3px 8px;
                    border: none;
                }

                .total-table .label {
                    text-align: left;
                    font-weight: normal;
                }

                .total-table .value {
                    text-align: right;
                    font-weight: bold;
                }

                .grand-total td {
                    font-size: 13pt;
                    font-weight: bold;
                    border-top: 2px solid #000;
                    padding-top: 6px;
                }

                .status-section {
                    text-align: center;
                    font-size: 11pt;
                    margin-top: 8px;
                    font-style: italic;
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

CetakInvoice.layout = null;
