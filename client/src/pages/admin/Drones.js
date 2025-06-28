import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Drones = () => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const DUMMY_IMAGE = "https://placehold.co/320x180?text=No+Image";

  useEffect(() => {
    const fetchDrones = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5050/api/drones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDrones(data.drones || []);
      } catch (err) {
        setDrones([]);
      }
      setLoading(false);
    };
    fetchDrones();
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
          Drone Fleet
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/admin/add-drone")}
        >
          Add Drone
        </Button>
      </Stack>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : drones.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" mt={8}>
          No drones found. Click "Add Drone" to add your first drone!
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {drones.map((drone) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={drone._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    drone.image
                      ? drone.image.startsWith("http")
                        ? drone.image
                        : `http://localhost:5050/${drone.image.replace(
                            /\\/g,
                            "/"
                          )}`
                      : DUMMY_IMAGE
                  }
                  alt={drone.name}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {drone.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: <b>{drone.status}</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Battery: <b>{drone.battery}%</b>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location:{" "}
                    <b>
                      {drone.location.lat}, {drone.location.lng}
                    </b>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Drones;
