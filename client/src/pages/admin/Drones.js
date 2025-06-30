import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DroneCard from "../../components/DroneCard";
import DroneMap from "../../components/DroneMap";
import { BASE_URL } from "../../const";

const Drones = () => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrones = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/drones`, {
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
              <DroneCard drone={drone} />
            </Grid>
          ))}
          <DroneMap drones={drones} />
        </Grid>
      )}
    </Box>
  );
};

export default Drones;
