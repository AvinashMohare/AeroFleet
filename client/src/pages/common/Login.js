import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/Heading";
import { BASE_URL } from "../../const";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.data?.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("username", data.data.username);
        localStorage.setItem("role", data.data.role);

        // Redirect based on role
        if (data.data.role === "admin") navigate("/admin-dashboard");
        else if (data.data.role === "operator") navigate("/operator-dashboard");
        else navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Network error or server is unreachable. Please try again later.");
      console.error("Login error:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Heading />
        <Typography
          variant="h5"
          gutterBottom
          textAlign={"center"}
          sx={{ mt: 4, mb: 2 }}
        >
          Login
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Button
          variant="text"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/")}
        >
          Don't have an account? Sign Up
        </Button>
      </Box>
    </Container>
  );
}
