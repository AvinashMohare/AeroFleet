import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Alert,
} from "@mui/material";
import {
  TrendingUp,
  Warning,
  Flight,
  Assignment,
  Group,
} from "@mui/icons-material";

const StatCard = ({ icon, label, value, color }) => (
  <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
    <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
    <Box>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  </Paper>
);

const StatusChips = ({ statusCounts }) => (
  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
    {Object.entries(statusCounts).map(([status, count]) => (
      <Chip
        key={status}
        label={`${status}: ${count}`}
        color="primary"
        variant="outlined"
      />
    ))}
  </Stack>
);

const DronesList = ({ drones }) => (
  <Paper sx={{ p: 2, mt: 2 }}>
    <Typography variant="h6" mb={1}>
      Drones Overview
    </Typography>
    <List dense>
      {drones.slice(0, 5).map((drone) => (
        <ListItem key={drone._id}>
          <ListItemAvatar>
            <Avatar>
              <Flight />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={drone.name}
            secondary={
              <>
                Status: <b>{drone.status}</b> | Battery: <b>{drone.battery}%</b>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
    {drones.length > 5 && (
      <Typography variant="caption" color="text.secondary">
        +{drones.length - 5} more drones
      </Typography>
    )}
  </Paper>
);

const MissionsList = ({ missions, title }) => (
  <Paper sx={{ p: 2, mt: 2 }}>
    <Typography variant="h6" mb={1}>
      {title}
    </Typography>
    <List dense>
      {missions.map((mission) => (
        <ListItem key={mission._id}>
          <ListItemAvatar>
            <Avatar>
              <Assignment />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={mission.name}
            secondary={
              <>
                Status: <b>{mission.status}</b> | Drone:{" "}
                <b>{mission.assignedDrone?.name || "N/A"}</b>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);

const AlertsList = ({ alerts }) =>
  alerts.length ? (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" mb={1}>
        Alerts & Warnings
      </Typography>
      <Stack spacing={1}>
        {alerts.map((alert, idx) => (
          <Alert key={idx} severity="warning" icon={<Warning />}>
            {alert.message}
          </Alert>
        ))}
      </Stack>
    </Paper>
  ) : null;

const OperatorsList = ({ operators }) => (
  <Paper sx={{ p: 2, mt: 2 }}>
    <Typography variant="h6" mb={1}>
      Operators
    </Typography>
    <List dense>
      {operators.map((op) => (
        <ListItem key={op._id}>
          <ListItemAvatar>
            <Avatar>
              <Group />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={op.username}
            secondary={
              <>
                Missions: <b>{op.missions}</b> | Success Rate:{" "}
                <b>{op.successRate}%</b>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);

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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!dashboard) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Failed to load dashboard data.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={2}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<Flight />}
            label="Total Drones"
            value={dashboard.drones.total}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<Assignment />}
            label="Total Missions"
            value={dashboard.missions.total}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<TrendingUp />}
            label="Mission Success Rate"
            value={`${dashboard.missions.successRate}%`}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            icon={<Warning />}
            label="Active Alerts"
            value={dashboard.alerts.length}
            color="warning.main"
          />
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="subtitle1" fontWeight={600}>
          Drone Status
        </Typography>
        <StatusChips statusCounts={dashboard.drones.statusCounts} />
      </Box>
      <Box mt={2}>
        <Typography variant="subtitle1" fontWeight={600}>
          Mission Status
        </Typography>
        <StatusChips statusCounts={dashboard.missions.statusCounts} />
      </Box>

      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6}>
          <DronesList drones={dashboard.drones.list} />
          <OperatorsList operators={dashboard.operators} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MissionsList
            missions={dashboard.missions.recent}
            title="Recent Missions"
          />
          <MissionsList
            missions={dashboard.missions.active}
            title="Active Missions"
          />
          <MissionsList
            missions={dashboard.missions.upcoming}
            title="Upcoming Missions"
          />
          <AlertsList alerts={dashboard.alerts} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
