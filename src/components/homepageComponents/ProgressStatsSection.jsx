import { Box, Typography } from "@mui/material";
import ProgressStats from "./ProgressStats";

export default function ProgressStatsSection() {
  return (
    <Box sx={{ mb: 10 }}>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "text.primary",
        }}
      >
        Track Your Learning Progress
      </Typography>
      <Typography
        variant="h6"
        align="center"
        sx={{
          mb: 6,
          color: "text.secondary",
          maxWidth: "800px",
          mx: "auto",
          fontWeight: "normal",
        }}
      >
        Visualize your learning journey with detailed analytics and progress
        tracking to stay motivated.
      </Typography>

      <ProgressStats />
    </Box>
  );
}
