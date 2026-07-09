export default function MapShow() {
    return (
        <div className="w-full h-72 rounded-xl overflow-hidden shadow-lg border">
            <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDummyKey&q=Jl.+Ujung+Gurun+No.49,+Kota+Padang&zoom=15"
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
