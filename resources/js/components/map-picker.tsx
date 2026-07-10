import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const STORE_LOCATION = { lat: -0.9342817421812004, lng: 100.3598192134916 };

interface MapPickerProps {
    latitude: string;
    longitude: string;
    onChange: (field: string, value: string) => void;
    readOnly?: boolean;
}

export default function MapPicker({ latitude, longitude, onChange, readOnly }: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const userMarkerRef = useRef<L.Marker | null>(null);
    const routeRef = useRef<L.Polyline | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const defaultLat = parseFloat(latitude) || STORE_LOCATION.lat;
        const defaultLng = parseFloat(longitude) || STORE_LOCATION.lng;

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const map = L.map(mapRef.current, { scrollWheelZoom: true }).setView([defaultLat, defaultLng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const storeIcon = L.divIcon({
            html: '<div style="background:#E11D48;color:white;padding:4px 8px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.2);">🏪 Toko</div>',
            className: '',
            iconSize: [60, 30],
            iconAnchor: [30, 15],
        });
        L.marker([STORE_LOCATION.lat, STORE_LOCATION.lng], { icon: storeIcon }).addTo(map);

        const userLat = parseFloat(latitude) || STORE_LOCATION.lat;
        const userLng = parseFloat(longitude) || STORE_LOCATION.lng;
        const userMarker = L.marker([userLat, userLng], { draggable: !readOnly }).addTo(map);

        if (!readOnly) {
            userMarker.on('dragend', () => {
                const pos = userMarker.getLatLng();
                onChange('latitude', pos.lat.toFixed(6));
                onChange('longitude', pos.lng.toFixed(6));
                fetchRoute(map, pos);
            });
            map.on('click', (e: L.LeafletMouseEvent) => {
                userMarker.setLatLng(e.latlng);
                onChange('latitude', e.latlng.lat.toFixed(6));
                onChange('longitude', e.latlng.lng.toFixed(6));
                fetchRoute(map, e.latlng);
            });
        }

        mapInstance.current = map;
        userMarkerRef.current = userMarker;

        if (latitude && longitude && !readOnly) {
            setTimeout(() => fetchRoute(map, L.latLng(userLat, userLng)), 500);
        }

        return () => { map.remove(); mapInstance.current = null; userMarkerRef.current = null; };
    }, []);

    async function fetchRoute(map: L.Map, dest: L.LatLng) {
        const src = STORE_LOCATION;
        try {
            const res = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${src.lng},${src.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson`
            );
            const data = await res.json();
            if (routeRef.current) map.removeLayer(routeRef.current);
            if (data.code === 'Ok' && data.routes.length > 0) {
                const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
                const polyline = L.polyline(coords, { color: '#E11D48', weight: 4, opacity: 0.7 }).addTo(map);
                routeRef.current = polyline;
                map.fitBounds(polyline.getBounds().pad(0.2));
            }
        } catch {
            const straightLine = L.polyline([[src.lat, src.lng], [dest.lat, dest.lng]], { color: '#E11D48', weight: 3, dashArray: '8 8', opacity: 0.5 }).addTo(map);
            routeRef.current = straightLine;
            map.fitBounds(straightLine.getBounds().pad(0.2));
        }
    }

    return (
        <div ref={mapRef} className="w-full h-80 rounded-lg border z-0" />
    );
}

export { STORE_LOCATION };
