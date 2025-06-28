import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2738/2738953.png",
  iconSize: [50, 50],
});

const DroneMap = ({ drones }) => {
  // Center map on first drone or default location
  const center = drones.length
    ? [drones[0].location.lat, drones[0].location.lng]
    : [28.6139, 77.209]; // Default: Delhi

  return (
    <MapContainer
      center={center}
      zoom={20}
      style={{ height: 400, width: "100%", marginBottom: 32 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {drones.map((drone) => (
        <Marker
          key={drone._id}
          position={[drone.location.lat, drone.location.lng]}
          icon={droneIcon}
        >
          <Popup>
            <b>{drone.name}</b>
            <br />
            Status: {drone.status}
            <br />
            Battery: {drone.battery}%
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DroneMap;
