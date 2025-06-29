import { Box, Typography, Avatar, Card, CardContent } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

const StatCard = ({ icon, label, value, color, trend }) => (
  <Card
    elevation={3}
    sx={{
      height: "100%",
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}30`,
      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 6,
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight={700}
            color={color}
            sx={{ mb: 0.5 }}
          >
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
          {trend && (
            <Typography
              variant="caption"
              color="success.main"
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
            >
              <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} />
              {trend}
            </Typography>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor: color,
            width: 56,
            height: 56,
            boxShadow: `0 4px 20px ${color}40`,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
