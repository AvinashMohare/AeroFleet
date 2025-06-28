import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const DUMMY_IMAGE = "https://placehold.co/320x180?text=No+Image";

const DroneCard = ({ drone }) => (
  <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
    <CardMedia
      component="img"
      height="180"
      image={
        drone.image && drone.image.trim() !== ""
          ? drone.image.startsWith("http")
            ? drone.image
            : `http://localhost:5050/${drone.image.replace(/\\/g, "/")}`
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
);

export default DroneCard;
