import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import {
  TrendingUp,
  Warning,
  Flight,
  Assignment,
  Error,
  People,
} from "@mui/icons-material";
import StatCard from "../../components/Dashboard/StatCard";
import StatusChips from "../../components/Dashboard/StatusChips";
import DronesList from "../../components/Dashboard/DronesList";
import MissionsList from "../../components/Dashboard/MissionsList";
import AlertsList from "../../components/Dashboard/AlertsList";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5050/api/dashboard/admin-dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setDashboard(data);
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!dashboard) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Error sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h5" color="error" fontWeight={600}>
          Failed to load dashboard data
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Please try refreshing the page or contact support if the issue
          persists.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "white",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          fontWeight={700}
          color="text.primary"
          sx={{ mb: 1 }}
          textAlign={"center"}
        >
          AeroFleet
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign={"center"}
        >
          Monitor and manage your drone operations
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Flight />}
            label="Total Drones"
            value={dashboard.drones.total}
            color="#1976d2"
            trend="+5% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Assignment />}
            label="Total Missions"
            value={dashboard.missions.total}
            color="#2e7d32"
            trend="+12% this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUp />}
            label="Success Rate"
            value={`${dashboard.missions.successRate}%`}
            color="#ed6c02"
            trend="+2% improvement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Warning />}
            label="Active Alerts"
            value={dashboard.alerts.length}
            color="#d32f2f"
            trend="+2% improvement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People />}
            label="Total Operators"
            value={dashboard.operators.length}
            color="#1976d2"
            trend="+2% improvement"
          />
        </Grid>
      </Grid>

      {/* Status Overview */}
      <Grid
        container
        spacing={3}
        sx={{ mb: 3 }}
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={12} md={6}>
          <StatusChips
            statusCounts={dashboard.drones.statusCounts}
            type="Drone"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatusChips
            statusCounts={dashboard.missions.statusCounts}
            type="Mission"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        alignItems="flex-start"
        sx={{ mb: 4 }}
      >
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <DronesList drones={dashboard.drones.list} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <MissionsList
            missions={dashboard.missions.recent}
            title="Recent Missions"
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <MissionsList
            missions={dashboard.missions.active}
            title="Active Missions"
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          lg={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <MissionsList
            missions={dashboard.missions.upcoming}
            title="Upcoming Missions"
          />
        </Grid>
      </Grid>
      <Box sx={{ paddingLeft: 10, paddingRight: 10 }}>
        <AlertsList alerts={dashboard.alerts} />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
