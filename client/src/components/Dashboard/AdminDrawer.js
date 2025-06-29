import {
  Drawer,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Flight,
  Assignment,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const menuLinks = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin-dashboard" },
  { text: "Drones", icon: <Flight />, path: "/admin/drones" },
  { text: "Missions", icon: <Assignment />, path: "/admin/missions" },
  {},
];

const AdminDrawer = ({ open, onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 260 } }}
    >
      <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6" fontWeight={700}>
          AeroFleet Admin
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuLinks.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleMenuClick(item.path)}
          >
            <ListItemIcon sx={{ color: "primary.main" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={onLogout}>
          <ListItemIcon sx={{ color: "primary.main" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AdminDrawer;
