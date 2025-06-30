import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BASE_URL } from "../../const";

const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2738/2738953.png",
  iconSize: [40, 40],
});

const areaIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const waypointIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
});

const CreateMission = () => {
  const [form, setForm] = useState({
    name: "",
    altitude: "",
    frequency: "",
    sensors: "",
    overlap: "",
    scheduledTime: "",
  });
  const [area, setArea] = useState([]); // Polygon points
  const [waypoints, setWaypoints] = useState([]); // Polyline points
  const [drones, setDrones] = useState([]);
  const [assignedDrone, setAssignedDrone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: select area, 2: select drone, 3: waypoints, 4: review/submit
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch drones when area is selected
    if (area.length > 2) {
      const fetchDrones = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/drones`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDrones(data.drones || []);
      };
      fetchDrones();
    }
  }, [area]);

  // Map click handler for area and waypoints
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (step === 1) {
          setArea((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
        } else if (step === 3) {
          setWaypoints((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
        }
      },
    });
    return null;
  }

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSensorChange = (e) => {
    setForm((prev) => ({ ...prev, sensors: e.target.value }));
  };

  const handleDroneSelect = (droneId) => {
    setAssignedDrone(droneId);
  };

  const handleAreaDone = () => {
    if (area.length < 3) {
      alert("Select at least 3 points for area.");
      return;
    }
    setStep(2);
  };

  const handleWaypointsDone = () => {
    if (waypoints.length < 2) {
      alert("Select at least 2 waypoints.");
      return;
    }
    setStep(4); // Ready to submit
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/missions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          altitude: form.altitude,
          parameters: {
            frequency: form.frequency,
            sensors: form.sensors.split(",").map((s) => s.trim()),
            overlap: form.overlap,
          },
          area: JSON.stringify(area),
          scheduledTime: form.scheduledTime,
          assignedDrone,
          waypoints: waypoints.map(([lat, lng]) => ({ lat, lng })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/admin/missions");
      } else {
        alert(data.message || "Failed to create mission");
      }
    } catch (error) {
      alert("Network error or server is unreachable. Please try again later.");
      console.error("Create mission error:", error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          Create Mission
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Mission Name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Altitude (meters)"
              name="altitude"
              type="number"
              value={form.altitude}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Frequency"
              name="frequency"
              type="number"
              value={form.frequency}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Sensors (comma separated)"
              name="sensors"
              value={form.sensors}
              onChange={handleSensorChange}
              required
              fullWidth
            />
            <TextField
              label="Overlap (%)"
              name="overlap"
              type="number"
              value={form.overlap}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              label="Scheduled Time"
              name="scheduledTime"
              type="datetime-local"
              value={form.scheduledTime}
              onChange={handleInputChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
          <Box mt={4}>
            <Typography variant="h6" mb={2}>
              1. Select Area (Click at least 3 points on the map)
            </Typography>
            <MapContainer
              center={[28.6139, 77.209]}
              zoom={13}
              style={{ height: 400, width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MapClickHandler />
              {/* Show area polygon always if area is selected */}
              {area.length > 0 && (
                <Polygon positions={area} pathOptions={{ color: "blue" }} />
              )}
              {/* Show area points only during area selection */}
              {step === 1 &&
                area.map((point, idx) => (
                  <Marker key={idx} position={point} icon={areaIcon}>
                    <Popup>Area Point {idx + 1}</Popup>
                  </Marker>
                ))}
              {/* Show drones only after area selection */}
              {step > 1 &&
                (assignedDrone
                  ? drones
                      .filter((drone) => drone._id === assignedDrone)
                      .map((drone) => (
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
                            <br />
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ mt: 1 }}
                              disabled
                            >
                              Selected
                            </Button>
                          </Popup>
                        </Marker>
                      ))
                  : drones.map((drone) => (
                      <Marker
                        key={drone._id}
                        position={[drone.location.lat, drone.location.lng]}
                        icon={droneIcon}
                        eventHandlers={{
                          click: () => handleDroneSelect(drone._id),
                        }}
                      >
                        <Tooltip
                          direction="top"
                          offset={[0, -20]}
                          opacity={1}
                          permanent={false}
                        >
                          <div>
                            <b>{drone.name}</b>
                            <br />
                            Status: {drone.status}
                            <br />
                            Battery: {drone.battery}%
                          </div>
                        </Tooltip>
                        <Popup>
                          <b>{drone.name}</b>
                          <br />
                          Status: {drone.status}
                          <br />
                          Battery: {drone.battery}%
                          <br />
                          <Button
                            variant={
                              assignedDrone === drone._id
                                ? "contained"
                                : "outlined"
                            }
                            size="small"
                            onClick={() => handleDroneSelect(drone._id)}
                            sx={{ mt: 1 }}
                          >
                            {assignedDrone === drone._id
                              ? "Selected"
                              : "Select Drone"}
                          </Button>
                        </Popup>
                      </Marker>
                    )))}
              {/* Show waypoints and polyline after step 3 */}
              {step >= 3 && (
                <>
                  {waypoints.map((point, idx) => (
                    <Marker key={idx} position={point} icon={waypointIcon}>
                      <Popup>Waypoint {idx + 1}</Popup>
                    </Marker>
                  ))}
                  {waypoints.length > 1 && (
                    <Polyline
                      positions={waypoints}
                      pathOptions={{ color: "red" }}
                    />
                  )}
                </>
              )}
            </MapContainer>
            {step === 1 && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleAreaDone}
                disabled={area.length < 3}
              >
                Area Done
              </Button>
            )}
            {step === 2 && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, ml: 2 }}
                onClick={() => setStep(3)}
                disabled={!assignedDrone}
              >
                Drone Selected, Next: Add Waypoints
              </Button>
            )}
            {step === 3 && (
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, ml: 2 }}
                onClick={handleWaypointsDone}
                disabled={waypoints.length < 2}
              >
                Waypoints Done
              </Button>
            )}
          </Box>
          {step === 4 && (
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 4 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Mission"}
            </Button>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default CreateMission;
