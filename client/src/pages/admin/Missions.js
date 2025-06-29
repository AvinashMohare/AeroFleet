import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const statusColors = {
  planned: "info",
  "in-progress": "warning",
  completed: "success",
  aborted: "error",
};

const Missions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/api/missions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMissions(data.missions || []);
      } catch (err) {
        setMissions([]);
      }
      setLoading(false);
    };
    fetchMissions();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={700}>
          Missions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/admin/create-mission")}
        >
          Create Mission
        </Button>
      </Stack>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : missions.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" mt={8}>
          No missions found. Click "Create Mission" to add your first mission!
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {missions.map((mission) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={mission._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {mission.name}
                  </Typography>
                  <Chip
                    label={mission.status}
                    color={statusColors[mission.status] || "default"}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Altitude: <b>{mission.altitude} m</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Scheduled:{" "}
                    <b>
                      {mission.scheduledTime
                        ? new Date(mission.scheduledTime).toLocaleString()
                        : "N/A"}
                    </b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assigned Drone:{" "}
                    <b>
                      {mission.assignedDrone?.name ||
                        mission.assignedDrone ||
                        "N/A"}
                    </b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created By:{" "}
                    <b>
                      {mission.createdBy?.username ||
                        mission.createdBy ||
                        "N/A"}
                    </b>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate(`/admin/missions/${mission._id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Missions;
