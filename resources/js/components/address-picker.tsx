import { useEffect, useState } from 'react';
import SearchableSelect from './searchable-select';

interface Wilayah {
    code: string;
    name: string;
}

interface AddressPickerProps {
    value: {
        provinsi: string;
        kabupaten: string;
        kecamatan: string;
        kelurahan: string;
        alamat_detail: string;
        no_telp_kirim: string;
        latitude: string;
        longitude: string;
    };
    onChange: (field: string, value: string) => void;
    errors?: Record<string, string>;
}

export default function AddressPicker({ value, onChange, errors }: AddressPickerProps) {
    const [provinsis, setProvinsis] = useState<Wilayah[]>([]);
    const [kabupatens, setKabupatens] = useState<Wilayah[]>([]);
    const [kecamatans, setKecamatans] = useState<Wilayah[]>([]);
    const [kelurahans, setKelurahans] = useState<Wilayah[]>([]);
    const [loading, setLoading] = useState({ provinsi: false, kabupaten: false, kecamatan: false, kelurahan: false });

    useEffect(() => { fetchProvinsis(); }, []);

    const fetchProvinsis = async () => {
        setLoading(prev => ({ ...prev, provinsi: true }));
        try { const res = await fetch('/wilayah/provinsi'); setProvinsis(await res.json()); }
        finally { setLoading(prev => ({ ...prev, provinsi: false })); }
    };

    const fetchKabupatens = async (provCode: string) => {
        if (!provCode) { setKabupatens([]); return; }
        setLoading(prev => ({ ...prev, kabupaten: true }));
        try { const res = await fetch(`/wilayah/kabupaten/${provCode}`); setKabupatens(await res.json()); }
        finally { setLoading(prev => ({ ...prev, kabupaten: false })); }
    };

    const fetchKecamatans = async (kabCode: string) => {
        if (!kabCode) { setKecamatans([]); return; }
        setLoading(prev => ({ ...prev, kecamatan: true }));
        try { const res = await fetch(`/wilayah/kecamatan/${kabCode}`); setKecamatans(await res.json()); }
        finally { setLoading(prev => ({ ...prev, kecamatan: false })); }
    };

    const fetchKelurahans = async (kecCode: string) => {
        if (!kecCode) { setKelurahans([]); return; }
        setLoading(prev => ({ ...prev, kelurahan: true }));
        try { const res = await fetch(`/wilayah/kelurahan/${kecCode}`); setKelurahans(await res.json()); }
        finally { setLoading(prev => ({ ...prev, kelurahan: false })); }
    };

    const handleProvChange = (code: string) => {
        const name = provinsis.find(p => p.code === code)?.name || code;
        onChange('provinsi', name);
        onChange('kabupaten', '');
        onChange('kecamatan', '');
        onChange('kelurahan', '');
        setKabupatens([]);
        setKecamatans([]);
        setKelurahans([]);
        if (code) fetchKabupatens(code);
    };

    const handleKabChange = (code: string) => {
        const name = kabupatens.find(k => k.code === code)?.name || code;
        onChange('kabupaten', name);
        onChange('kecamatan', '');
        onChange('kelurahan', '');
        setKecamatans([]);
        setKelurahans([]);
        if (code) fetchKecamatans(code);
    };

    const handleKecChange = (code: string) => {
        const name = kecamatans.find(k => k.code === code)?.name || code;
        onChange('kecamatan', name);
        onChange('kelurahan', '');
        setKelurahans([]);
        if (code) fetchKelurahans(code);
    };

    const handleKelChange = (code: string) => {
        const name = kelurahans.find(k => k.code === code)?.name || code;
        onChange('kelurahan', name);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                    <SearchableSelect value={value.provinsi} onChange={handleProvChange} options={provinsis} placeholder="Pilih Provinsi" loading={loading.provinsi} />
                    {errors?.provinsi && <p className="text-red-500 text-sm mt-1">{errors.provinsi}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten/Kota</label>
                    <SearchableSelect value={value.kabupaten} onChange={handleKabChange} options={kabupatens} placeholder="Pilih Kabupaten/Kota" disabled={!value.provinsi} loading={loading.kabupaten} />
                    {errors?.kabupaten && <p className="text-red-500 text-sm mt-1">{errors.kabupaten}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                    <SearchableSelect value={value.kecamatan} onChange={handleKecChange} options={kecamatans} placeholder="Pilih Kecamatan" disabled={!value.kabupaten} loading={loading.kecamatan} />
                    {errors?.kecamatan && <p className="text-red-500 text-sm mt-1">{errors.kecamatan}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan/Desa</label>
                    <SearchableSelect value={value.kelurahan} onChange={handleKelChange} options={kelurahans} placeholder="Pilih Kelurahan/Desa" disabled={!value.kecamatan} loading={loading.kelurahan} />
                    {errors?.kelurahan && <p className="text-red-500 text-sm mt-1">{errors.kelurahan}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Detail</label>
                <textarea
                    value={value.alamat_detail}
                    onChange={(e) => onChange('alamat_detail', e.target.value)}
                    rows={3}
                    placeholder="Nama jalan, nomor rumah, RT/RW, patokan..."
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors?.alamat_detail && <p className="text-red-500 text-sm mt-1">{errors.alamat_detail}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon Penerima</label>
                    <input
                        type="text"
                        value={value.no_telp_kirim}
                        onChange={(e) => onChange('no_telp_kirim', e.target.value)}
                        placeholder="08xxxx"
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {errors?.no_telp_kirim && <p className="text-red-500 text-sm mt-1">{errors.no_telp_kirim}</p>}
                </div>
            </div>
        </div>
    );
}
