import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import Heading from "../../components/Heading";
import { BASE_URL } from "../../const";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "operator", label: "Operator" },
];

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "viewer",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.data?.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("username", data.data.username);
        localStorage.setItem("role", data.data.role);
        if (data.data.role === "admin") navigate("/admin-dashboard");
        else if (data.data.role === "operator") navigate("/operator-dashboard");
        else navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      alert("Network error or server is unreachable. Please try again later.");
      console.error("Signup error:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Heading />
        <Typography
          variant="h5"
          gutterBottom
          textAlign="center"
          sx={{ mt: 4, mb: 2 }}
        >
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Role"
            name="role"
            fullWidth
            margin="normal"
            value={form.role}
            onChange={handleChange}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>
        <Button
          variant="text"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Button>
      </Box>
    </Container>
  );
}
