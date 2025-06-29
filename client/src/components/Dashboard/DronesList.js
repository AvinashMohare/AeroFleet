import React from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { Flight, Battery3Bar } from "@mui/icons-material";

const DronesList = ({ drones }) => (
  <Card elevation={3} sx={{ mt: 2 }}>
    <CardContent sx={{ p: 0 }}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Drones Overview
        </Typography>
      </Box>
      <List dense>
        {drones.slice(0, 5).map((drone, index) => (
          <React.Fragment key={drone._id}>
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor:
                      drone.status === "active" ? "success.main" : "grey.400",
                  }}
                >
                  <Flight />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    {drone.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={drone.status}
                        size="small"
                        color={
                          drone.status === "active" ? "success" : "default"
                        }
                        variant="filled"
                      />
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Battery3Bar
                          sx={{
                            fontSize: 16,
                            color:
                              drone.battery > 50
                                ? "success.main"
                                : "warning.main",
                          }}
                        />
                        <Typography variant="body2" fontWeight={500}>
                          {Math.round(drone.battery)}%
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={drone.battery}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "grey.200",
                        "& .MuiLinearProgress-bar": {
                          bgcolor:
                            drone.battery > 50
                              ? "success.main"
                              : "warning.main",
                        },
                      }}
                    />
                  </Box>
                }
              />
            </ListItem>
            {index < Math.min(drones.length, 5) - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      {drones.length > 5 && (
        <Box sx={{ p: 2, pt: 0, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            +{drones.length - 5} more drones
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);
export default DronesList;
