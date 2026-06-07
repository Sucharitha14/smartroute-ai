import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getCityCoords } from "../utils/tripLogic";


// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ─────────────────────────────────────────────
// Distance calculator (Haversine formula)
// ─────────────────────────────────────────────
function getDistance(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;

  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);

  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const aVal =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
}

// ─────────────────────────────────────────────
// Nearest Neighbour Algorithm
// ─────────────────────────────────────────────
function optimizeRoute(start, places) {
  if (!start || places.length === 0) return places;

  const remaining = [...places];
  const ordered = [];
  let current = start;

  while (remaining.length) {
    let nearestIndex = 0;
    let minDist = Infinity;

    remaining.forEach((p, i) => {
      const dist = getDistance(current, [p.lat, p.lng]);
      if (dist < minDist) {
        minDist = dist;
        nearestIndex = i;
      }
    });

    const next = remaining.splice(nearestIndex, 1)[0];
    ordered.push(next);
    current = [next.lat, next.lng];
  }

  return ordered;
}

// ─────────────────────────────────────────────

export default function RouteMap({ source, destination, places = [] }) {
  const sourceCoords = getCityCoords(source);
  const destCoords = getCityCoords(destination);

  const center = destCoords || sourceCoords || [12.9716, 77.5946];

  // 🔥 SMART ORDERING
  const orderedPlaces = optimizeRoute(sourceCoords, places);

  const routePoints = [
    ...(sourceCoords ? [sourceCoords] : []),
    ...orderedPlaces.map((p) => [p.lat, p.lng]),
    ...(destCoords ? [destCoords] : [])
  ];

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{
        height: "420px",
        width: "100%",
        borderRadius: "14px"
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Source */}
      {sourceCoords && (
        <Marker position={sourceCoords}>
          <Popup>
            <strong>Start</strong><br />
            {source}
          </Popup>
        </Marker>
      )}

      {/* Destination */}
      {destCoords && (
        <Marker position={destCoords}>
          <Popup>
            <strong>Destination</strong><br />
            {destination}
          </Popup>
        </Marker>
      )}

      {/* Ordered Places */}
      {orderedPlaces.map((place, index) => (
        <Marker key={index} position={[place.lat, place.lng]}>
          <Popup>
            <strong>{index + 1}. {place.name}</strong><br />
            {place.type}<br />
            ₹{place.estimated_cost}
          </Popup>
        </Marker>
      ))}

      {/* Smart Route Line */}
      {routePoints.length > 1 && (
        <Polyline positions={routePoints} />
      )}
    </MapContainer>
  );
}