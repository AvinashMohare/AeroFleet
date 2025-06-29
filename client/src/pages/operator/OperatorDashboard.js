import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DUMMY_IMAGE = "https://placehold.co/320x180?text=No+Image";

const OperatorDashboard = () => {
  const [assignedDrone, setAssignedDrone] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      // Fetch assigned drone for this operator
      const droneRes = await fetch(
        "http://localhost:5050/api/drones/assigned-drone",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const droneData = await droneRes.json();
      setAssignedDrone(droneData.drone || null);

      // Fetch missions for this drone
      if (droneData.drone && droneData.drone._id) {
        const missionsRes = await fetch(
          `http://localhost:5050/api/missions?droneId=${droneData.drone._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const missionsData = await missionsRes.json();
        setMissions(missionsData.missions || []);
      } else {
        setMissions([]);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
        Operator Dashboard
      </Typography>
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" mb={2}>
          Assigned Drone
        </Typography>
        {assignedDrone ? (
          <Stack direction="row" spacing={3} alignItems="center">
            <CardMedia
              component="img"
              height="100"
              image={
                assignedDrone.image && assignedDrone.image.trim() !== ""
                  ? assignedDrone.image.startsWith("http")
                    ? assignedDrone.image
                    : `http://localhost:5050/${assignedDrone.image.replace(
                        /\\/g,
                        "/"
                      )}`
                  : DUMMY_IMAGE
              }
              alt={assignedDrone.name}
              sx={{ width: 160, borderRadius: 2, objectFit: "cover" }}
            />
            <Box>
              <Typography variant="h6">{assignedDrone.name}</Typography>
              <Typography>
                Status: <b>{assignedDrone.status}</b>
              </Typography>
              <Typography>
                Battery: <b>{Math.round(assignedDrone.battery)}%</b>
              </Typography>
              <Typography>
                Location:{" "}
                <b>
                  {assignedDrone.location.lat}, {assignedDrone.location.lng}
                </b>
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Typography color="text.secondary">No drone assigned.</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" mb={2}>
          Missions for Assigned Drone
        </Typography>
        {missions.length === 0 ? (
          <Typography color="text.secondary">
            No missions assigned to this drone.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {missions.map((mission) => (
              <Paper
                key={mission._id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 4, bgcolor: "#f5f5f5" },
                }}
                onClick={() =>
                  navigate(`/operator/missions/${mission._id}/live`)
                }
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  {mission.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: <b>{mission.status}</b>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sensors:{" "}
                  <b>
                    {Array.isArray(mission.parameters.sensors)
                      ? mission.parameters.sensors.join(", ")
                      : mission.parameters.sensors}
                  </b>
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default OperatorDashboard;
