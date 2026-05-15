import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapView({ products, userLocation }) {
  return (
    <MapContainer
      center={
        userLocation
          ? [userLocation.lat, userLocation.lng]
          : [31.2536, 75.7033] // ✅ LPU Punjab
      }
      zoom={13}
      style={{ height: "400px", width: "100%", marginTop: "20px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {products.map((p) =>
        p.latitude && p.longitude ? (
          <Marker key={p.id} position={[p.latitude, p.longitude]}>
            <Popup>
              <strong>{p.name}</strong> <br />
              ₹{p.price} <br />
              {p.distance && `📍 ${p.distance.toFixed(2)} km`}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}

export default MapView;