import React from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";
import { Assignment } from "@mui/icons-material";

const MissionsList = ({ missions, title }) => (
  <Card elevation={3} sx={{ mt: 2 }}>
    <CardContent sx={{ p: 0 }}>
      <Box sx={{ p: 3, pb: 1 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          {title}
        </Typography>
      </Box>
      <List dense>
        {missions.map((mission, index) => (
          <React.Fragment key={mission._id}>
            <ListItem sx={{ px: 3, py: 2 }}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor:
                      mission.status === "completed"
                        ? "success.main"
                        : mission.status === "failed"
                        ? "error.main"
                        : "info.main",
                  }}
                >
                  <Assignment />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight={600}>
                    {mission.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={mission.status}
                        size="small"
                        color={
                          mission.status === "completed"
                            ? "success"
                            : mission.status === "failed"
                            ? "error"
                            : "info"
                        }
                        variant="filled"
                      />
                      <Typography variant="body2" color="text.secondary">
                        Drone:{" "}
                        <strong>{mission.assignedDrone?.name || "N/A"}</strong>
                      </Typography>
                    </Stack>
                  </Box>
                }
              />
            </ListItem>
            {index < missions.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

export default MissionsList;
