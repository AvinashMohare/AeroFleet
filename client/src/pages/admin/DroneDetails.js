import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  CardMedia,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL, SERVER_URL } from "../../const";

const DUMMY_IMAGE = "https://placehold.co/320x180?text=No+Image";

const DroneDetails = () => {
  const { droneId } = useParams();
  const [drone, setDrone] = useState(null);
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrone = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/drones/${droneId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDrone(data.drone || null);
      setSelectedOperator(data.drone?.assignedOperator?._id || "");
      setLoading(false);
    };
    const fetchOperators = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/users?role=operator`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOperators(data.users || []);
    };
    fetchDrone();
    fetchOperators();
  }, [droneId]);

  const handleAssign = async () => {
    setAssigning(true);
    const token = localStorage.getItem("token");
    await fetch(`${BASE_URL}/drones/${droneId}/assign-operator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ operatorId: selectedOperator }),
    });
    setAssigning(false);
    // Refresh drone details
    const res = await fetch(`${BASE_URL}/drones/${droneId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setDrone(data.drone || null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!drone) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          Drone not found.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  // Determine image URL
  const imageUrl =
    drone.image && drone.image.trim() !== ""
      ? drone.image.startsWith("http")
        ? drone.image
        : `${SERVER_URL}/${drone.image.replace(/\\/g, "/")}`
      : DUMMY_IMAGE;

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={drone.name}
          sx={{ borderRadius: 2, mb: 2, objectFit: "cover" }}
        />
        <Typography variant="h4" fontWeight={700} mb={2}>
          {drone.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2}>
          <Typography>
            <b>Status:</b> {drone.status}
          </Typography>
          <Typography>
            <b>Battery:</b> {drone.battery}%
          </Typography>
          <Typography>
            <b>Location:</b> Lat {drone.location.lat}, Lng {drone.location.lng}
          </Typography>
          <Typography>
            <b>Last Active:</b>{" "}
            {drone.lastActive
              ? new Date(drone.lastActive).toLocaleString()
              : "-"}
          </Typography>
          <Typography>
            <b>Assigned Operator:</b>{" "}
            {drone.assignedOperator ? (
              drone.assignedOperator.username
            ) : (
              <i>None</i>
            )}
          </Typography>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" mb={1}>
          Assign to Operator
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            displayEmpty
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {operators.map((op) => (
              <MenuItem key={op._id} value={op._id}>
                {op.username}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={!selectedOperator || assigning}
          >
            {assigning ? "Assigning..." : "Assign"}
          </Button>
        </Stack>
        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate(-1)}>
          Back to Drones
        </Button>
      </Paper>
    </Box>
  );
};

export default DroneDetails;
