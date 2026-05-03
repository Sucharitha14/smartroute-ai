// src/components/RouteMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons breaking in Vite/Webpack builds
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Default center of India so map loads nicely
const INDIA_CENTER = [20.5937, 78.9629];

function RouteMap({ sourceCoords, destCoords }) {
  // Decide where to center the map
  const center =
    sourceCoords && destCoords
      ? [
          (sourceCoords[0] + destCoords[0]) / 2,
          (sourceCoords[1] + destCoords[1]) / 2,
        ]
      : INDIA_CENTER;

  const zoom = sourceCoords && destCoords ? 6 : 5;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "400px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {sourceCoords && (
        <Marker position={sourceCoords}>
          <Popup>Source</Popup>
        </Marker>
      )}

      {destCoords && (
        <Marker position={destCoords}>
          <Popup>Destination</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default RouteMap;