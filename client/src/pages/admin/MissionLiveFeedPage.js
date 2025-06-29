import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MissionLiveFeed from "../../components/MissionLiveFeed";
import { CircularProgress, Box, Typography } from "@mui/material";

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
        const res = await fetch(`http://localhost:5050/api/missions/${id}`, {
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

  return <MissionLiveFeed mission={mission} />;
};

export default MissionLiveFeedPage;
