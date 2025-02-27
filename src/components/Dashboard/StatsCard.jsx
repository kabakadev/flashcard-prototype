import { Box, Typography } from "@mui/material";

const StatsCard = ({ icon: Icon, value, label, theme, isDarkMode }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
    <Box
      sx={{
        bgcolor: isDarkMode
          ? "rgba(124, 58, 237, 0.15)"
          : "rgba(124, 58, 237, 0.08)",
        p: 1,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={18} color={theme.palette.primary.main} />
    </Box>
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "text.primary", lineHeight: 1.2 }}
      >
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
    </Box>
  </Box>
);

export default StatsCard;
