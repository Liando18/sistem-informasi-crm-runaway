import { useState, useRef, useEffect } from 'react';

interface Wilayah {
    code: string;
    name: string;
}

interface SearchableSelectProps {
    value: string;
    onChange: (code: string) => void;
    options: Wilayah[];
    placeholder: string;
    disabled?: boolean;
    loading?: boolean;
}

export default function SearchableSelect({ value, onChange, options, placeholder, disabled, loading }: SearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find((o) => o.code === value)?.name || options.find((o) => o.name === value)?.name || '';

    const filtered = search
        ? options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
        : options;

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    useEffect(() => {
        if (!open) setSearch('');
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => { if (!disabled) setOpen(!open); }}
                className={`w-full rounded-lg border p-2.5 text-sm flex items-center justify-between cursor-pointer transition-all ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white hover:border-gray-400'}`}
            >
                <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                    {value ? selectedLabel || placeholder : placeholder}
                </span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari..."
                            className="w-full border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                    <div className="overflow-y-auto max-h-48">
                        {loading ? (
                            <div className="p-3 text-sm text-gray-400 text-center">Memuat...</div>
                        ) : filtered.length === 0 ? (
                            <div className="p-3 text-sm text-gray-400 text-center">Tidak ditemukan</div>
                        ) : (
                            filtered.map((opt) => (
                                <div
                                    key={opt.code}
                                    onClick={() => {
                                        onChange(opt.code);
                                        setOpen(false);
                                    }}
                                    className={`px-3 py-2 text-sm cursor-pointer transition-colors ${opt.code === value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    {opt.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
