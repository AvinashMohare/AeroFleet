import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";

const droneIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2738/2738953.png",
  iconSize: [40, 40],
});

const MissionLiveFeed = ({ mission }) => {
  const [liveData, setLiveData] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!mission || !mission._id) return;

    // Disconnect previous socket if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io("http://localhost:5050");
    socketRef.current = socket;

    // Listen for mission-live events
    socket.on("mission-live", (data) => {
      console.log(
        "Received mission-live event:",
        data,
        "Expected missionId:",
        mission._id
      );

      if (
        data.missionId === mission._id ||
        data.missionId === String(mission._id)
      ) {
        setLiveData(data);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [mission?._id]);

  // Parse area from mission (if stored as string)
  let area = [];
  try {
    area =
      typeof mission.area === "string"
        ? JSON.parse(mission.area)
        : mission.area;
  } catch {
    area = [];
  }

  const waypoints = (mission.waypoints || []).map((wp) =>
    Array.isArray(wp) ? wp : [wp.lat, wp.lng]
  );

  // Determine marker position
  let markerPosition = null;
  if (liveData && liveData.location) {
    markerPosition = [liveData.location.lat, liveData.location.lng];
  } else {
    markerPosition = mission.assignedDrone.location;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Chip label={liveData?.status || mission.status} color="primary" />
          <Typography>
            Drone: <b>{mission.assignedDrone.name} </b>
          </Typography>
          <Typography>
            Battery:{" "}
            <b>
              {liveData
                ? Math.round(liveData.battery)
                : Math.round(mission.assignedDrone.battery)}
              %
            </b>
          </Typography>
          <Typography>
            Altitude: <b>{mission.altitude} m</b>
          </Typography>
          <Typography>
            Waypoint:{" "}
            <b>
              {liveData
                ? `${liveData.waypointIndex + 1} / ${liveData.totalWaypoints}`
                : "-"}
            </b>
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={liveData ? liveData.battery : mission.assignedDrone.battery}
          sx={{ mb: 2, height: 8, borderRadius: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          Sensors: {mission.parameters?.sensors?.join(", ") || "-"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Frequency: {mission.parameters?.frequency || "-"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overlap: {mission.parameters?.overlap || "-"}
        </Typography>
      </Paper>
      <MapContainer
        center={area && area.length > 0 ? area[0] : [28.6139, 77.209]}
        zoom={15}
        style={{ height: 400, width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {area && area.length > 0 && (
          <Polygon positions={area} pathOptions={{ color: "blue" }} />
        )}
        {waypoints.length > 1 && (
          <Polyline
            positions={waypoints}
            pathOptions={{ color: "red", weight: 3 }}
          />
        )}

        {markerPosition && (
          <Marker position={markerPosition} icon={droneIcon}>
            <Popup>
              <b>Drone</b>
              <br />
              {liveData ? (
                <>
                  Battery: {Math.round(liveData.battery)}%<br />
                  Status: {liveData.status}
                </>
              ) : (
                "Not in mission"
              )}
            </Popup>
          </Marker>
        )}
      </MapContainer>
      {!liveData && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mt={2}
        >
          Waiting for live mission data...
        </Typography>
      )}
      {liveData && liveData.status !== "completed" && (
        <Box mt={3} display="flex" justifyContent="center">
          <video
            width="100%"
            height="400"
            controls
            autoPlay
            loop
            muted
            style={{
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              objectFit: "cover",
              maxWidth: "100%",
            }}
          >
            <source
              src="https://cdn.videvo.net/videvo_files/video/free/2013-08/large_watermarked/Drone_Drop_preview.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </Box>
      )}
    </Box>
  );
};

export default MissionLiveFeed;
