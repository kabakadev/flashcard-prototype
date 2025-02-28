import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ThemeToggle from "../ThemeComponents/ThemeToggle";

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.nav",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component="h1"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "text.primary" }}
        >
          Flashlearn
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ThemeToggle />
          <Button
            variant="outlined"
            component={RouterLink}
            to="/login"
            sx={{
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                borderColor: "primary.dark",
                bgcolor: "rgba(67, 97, 238, 0.04)",
              },
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            component={RouterLink}
            to="/signup"
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
