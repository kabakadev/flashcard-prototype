import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ThemeToggle from "../ThemeComponents/ThemeToggle";
import MenuIcon from "@mui/icons-material/Menu"; // Import the menu icon
import { useState } from "react";

export default function Navbar() {
  // Use the useMediaQuery hook to detect mobile screens
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

        {/* Mobile View */}
        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {/* Add ThemeToggle to the mobile menu */}
              <MenuItem
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ThemeToggle />
              </MenuItem>
              <MenuItem
                onClick={handleMenuClose}
                component={RouterLink}
                to="/login"
              >
                Sign In
              </MenuItem>
              <MenuItem
                onClick={handleMenuClose}
                component={RouterLink}
                to="/signup"
              >
                Get Started
              </MenuItem>
            </Menu>
          </>
        ) : (
          // Desktop View
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
            >
              Get Started
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
