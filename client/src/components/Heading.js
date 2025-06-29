import { Typography } from "@mui/material";

const Heading = () => {
  return (
    <>
      <Typography
        variant="h3"
        fontWeight={700}
        color="#1976d2"
        sx={{ mb: 1 }}
        textAlign={"center"}
      >
        AeroFleet
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign={"center"}
      >
        Monitor and manage your drone operations
      </Typography>
    </>
  );
};

export default Heading;
