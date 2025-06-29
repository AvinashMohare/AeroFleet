import { Typography, Stack, Alert, Card, CardContent } from "@mui/material";
import { Warning } from "@mui/icons-material";

const AlertsList = ({ alerts }) =>
  alerts.length ? (
    <Card elevation={3} sx={{ mt: 2 }}>
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 2 }}
        >
          Alerts & Warnings
        </Typography>
        <Stack spacing={2}>
          {alerts.map((alert, idx) => (
            <Alert
              key={idx}
              severity="warning"
              icon={<Warning />}
              sx={{
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  fontSize: 20,
                },
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {alert.message}
              </Typography>
            </Alert>
          ))}
        </Stack>
      </CardContent>
    </Card>
  ) : null;

export default AlertsList;
