import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MissionLiveFeed from "../../components/MissionLiveFeed";
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import * as XLSX from "xlsx";
import { BASE_URL } from "../../const";

const MissionLiveFeedPage = () => {
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMission = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required.");
          setLoading(false);
          return;
        }
        const res = await fetch(`${BASE_URL}/missions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setError("Failed to fetch mission.");
          setMission(null);
        } else {
          const data = await res.json();
          setMission(data.mission);
          console.log("Loaded mission:", data.mission);
        }
      } catch {
        setError("Network error.");
        setMission(null);
      }
      setLoading(false);
    };
    fetchMission();
  }, [id]);

  // Mock Excel download handler
  const handleDownloadExcel = () => {
    // Mock data: replace with actual mission.sensorData if available
    const rows = (
      mission.sensorData || [
        { sensor1: 10, sensor2: 20 },
        { sensor1: 15, sensor2: 25 },
        { sensor1: 12, sensor2: 22 },
      ]
    ).map(({ sensor1, sensor2 }) => ({ sensor1, sensor2 }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SensorData");
    XLSX.writeFile(workbook, `mission_${mission._id}_sensors.xlsx`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" mt={8}>
        {error}
      </Typography>
    );
  }

  if (!mission) {
    return (
      <Typography variant="h6" color="text.secondary" align="center" mt={8}>
        Mission not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Live Mission Feed
        </Typography>
        {mission.status === "completed" && (
          <Box display="flex" mb={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadExcel}
            >
              Download Sensor Data (Excel)
            </Button>
          </Box>
        )}
        <MissionLiveFeed mission={mission} />
      </Paper>
    </Box>
  );
};

export default MissionLiveFeedPage;
