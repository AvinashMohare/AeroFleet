import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../const";

const statusOptions = [
  { value: "available", label: "Available" },
  { value: "in-mission", label: "In Mission" },
  { value: "maintenance", label: "Maintenance" },
];

const AddDrone = () => {
  const [form, setForm] = useState({
    name: "",
    status: "available",
    battery: 100,
    lat: "",
    lng: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("status", form.status);
      formData.append("battery", form.battery);
      formData.append("location[lat]", form.lat);
      formData.append("location[lng]", form.lng);
      if (form.image) formData.append("image", form.image);

      const res = await fetch(`${BASE_URL}/drones`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/admin/drones");
      } else {
        alert(data.message || "Failed to add drone");
      }
    } catch (error) {
      alert("Network error or server is unreachable. Please try again later.");
      console.error("Add drone error:", error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto" }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
          Add New Drone
        </Typography>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Stack spacing={2}>
            <TextField
              label="Drone Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Battery (%)"
              name="battery"
              type="number"
              value={form.battery}
              onChange={handleChange}
              inputProps={{ min: 0, max: 100 }}
              fullWidth
              required
            />
            <TextField
              label="Latitude"
              name="lat"
              type="number"
              value={form.lat}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Longitude"
              name="lng"
              type="number"
              value={form.lng}
              onChange={handleChange}
              fullWidth
              required
            />
            <Button variant="contained" component="label">
              Upload Image
              <input
                type="file"
                name="image"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </Button>
            {form.image && (
              <Typography variant="body2" color="text.secondary">
                Selected: {form.image.name}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Add Drone"}
            </Button>
            <Button
              variant="text"
              color="secondary"
              fullWidth
              onClick={() => navigate("/admin-drones")}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddDrone;
