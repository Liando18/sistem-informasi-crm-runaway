import { useEffect, useRef, useState } from 'react';

interface MapPickerProps {
    latitude: string;
    longitude: string;
    onChange: (field: string, value: string) => void;
    readOnly?: boolean;
}

export default function MapPicker({ latitude, longitude, onChange, readOnly }: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!window.google && !readOnly) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDummyKey&callback=initMap`;
            script.async = true;
            script.defer = true;
            script.onerror = () => setError('Gagal memuat peta');
            window.document.body.appendChild(script);
        }
    }, []);

    if (readOnly) {
        const src = latitude && longitude
            ? `https://www.google.com/maps/embed/v1/view?key=AIzaSyDummyKey&center=${latitude},${longitude}&zoom=15`
            : `https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKey&q=Jl.+Ujung+Gurun+No.49,+Kota+Padang`;

        return (
            <div className="w-full h-64 rounded-lg overflow-hidden border">
                <iframe
                    src={src}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Klik di peta untuk memilih lokasi
            </label>
            <div ref={mapRef} className="w-full h-64 rounded-lg border bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-sm">
                    {error || 'Peta akan muncul jika API key Google Maps tersedia'}
                </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500">Latitude</label>
                    <input
                        type="text"
                        value={latitude}
                        onChange={(e) => onChange('latitude', e.target.value)}
                        placeholder="-0.9554"
                        className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500">Longitude</label>
                    <input
                        type="text"
                        value={longitude}
                        onChange={(e) => onChange('longitude', e.target.value)}
                        placeholder="100.3521"
                        className="w-full rounded-lg border-gray-300 border p-2 text-sm focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>
        </div>
    );
}
