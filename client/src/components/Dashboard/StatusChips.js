import { Typography, Chip, Stack, Card } from "@mui/material";

const StatusChips = ({ statusCounts, type }) => {
  const getStatusColor = (status) => {
    const statusColors = {
      active: "success",
      available: "info",
      maintenance: "warning",
      offline: "error",
      completed: "success",
      pending: "warning",
      failed: "error",
      "in-progress": "info",
      scheduled: "default",
    };
    return statusColors[status.toLowerCase()] || "default";
  };

  return (
    <Card elevation={2} sx={{ p: 2, mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
      >
        {type} Status Distribution
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <Chip
            key={status}
            label={`${status}: ${count}`}
            color={getStatusColor(status)}
            variant="filled"
            sx={{
              fontWeight: 600,
              textTransform: "capitalize",
              boxShadow: 1,
            }}
          />
        ))}
      </Stack>
    </Card>
  );
};
export default StatusChips;
