import { useEffect, useState } from 'react';

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

    useEffect(() => {
        fetchProvinsis();
    }, []);

    const fetchProvinsis = async () => {
        setLoading(prev => ({ ...prev, provinsi: true }));
        try {
            const res = await fetch('/wilayah/provinsi');
            const data = await res.json();
            setProvinsis(data);
        } finally {
            setLoading(prev => ({ ...prev, provinsi: false }));
        }
    };

    const fetchKabupatens = async (provCode: string) => {
        if (!provCode) { setKabupatens([]); return; }
        setLoading(prev => ({ ...prev, kabupaten: true }));
        try {
            const res = await fetch(`/wilayah/kabupaten/${provCode}`);
            const data = await res.json();
            setKabupatens(data);
        } finally {
            setLoading(prev => ({ ...prev, kabupaten: false }));
        }
    };

    const fetchKecamatans = async (kabCode: string) => {
        if (!kabCode) { setKecamatans([]); return; }
        setLoading(prev => ({ ...prev, kecamatan: true }));
        try {
            const res = await fetch(`/wilayah/kecamatan/${kabCode}`);
            const data = await res.json();
            setKecamatans(data);
        } finally {
            setLoading(prev => ({ ...prev, kecamatan: false }));
        }
    };

    const fetchKelurahans = async (kecCode: string) => {
        if (!kecCode) { setKelurahans([]); return; }
        setLoading(prev => ({ ...prev, kelurahan: true }));
        try {
            const res = await fetch(`/wilayah/kelurahan/${kecCode}`);
            const data = await res.json();
            setKelurahans(data);
        } finally {
            setLoading(prev => ({ ...prev, kelurahan: false }));
        }
    };

    const handleProvChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onChange('provinsi', val);
        onChange('kabupaten', '');
        onChange('kecamatan', '');
        onChange('kelurahan', '');
        setKabupatens([]);
        setKecamatans([]);
        setKelurahans([]);
        if (val) fetchKabupatens(val);
    };

    const handleKabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onChange('kabupaten', val);
        onChange('kecamatan', '');
        onChange('kelurahan', '');
        setKecamatans([]);
        setKelurahans([]);
        if (val) fetchKecamatans(val);
    };

    const handleKecChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        onChange('kecamatan', val);
        onChange('kelurahan', '');
        setKelurahans([]);
        if (val) fetchKelurahans(val);
    };

    const handleKelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange('kelurahan', e.target.value);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                    <select
                        value={value.provinsi}
                        onChange={handleProvChange}
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="">Pilih Provinsi</option>
                        {provinsis.map((p) => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                        ))}
                    </select>
                    {errors?.provinsi && <p className="text-red-500 text-sm mt-1">{errors.provinsi}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten/Kota</label>
                    <select
                        value={value.kabupaten}
                        onChange={handleKabChange}
                        disabled={!value.provinsi}
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                    >
                        <option value="">Pilih Kabupaten/Kota</option>
                        {kabupatens.map((k) => (
                            <option key={k.code} value={k.code}>{k.name}</option>
                        ))}
                    </select>
                    {errors?.kabupaten && <p className="text-red-500 text-sm mt-1">{errors.kabupaten}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                    <select
                        value={value.kecamatan}
                        onChange={handleKecChange}
                        disabled={!value.kabupaten}
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                    >
                        <option value="">Pilih Kecamatan</option>
                        {kecamatans.map((k) => (
                            <option key={k.code} value={k.code}>{k.name}</option>
                        ))}
                    </select>
                    {errors?.kecamatan && <p className="text-red-500 text-sm mt-1">{errors.kecamatan}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan/Desa</label>
                    <select
                        value={value.kelurahan}
                        onChange={handleKelChange}
                        disabled={!value.kecamatan}
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
                    >
                        <option value="">Pilih Kelurahan/Desa</option>
                        {kelurahans.map((k) => (
                            <option key={k.code} value={k.code}>{k.name}</option>
                        ))}
                    </select>
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
