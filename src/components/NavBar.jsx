"use client";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { LogOut, LayoutDashboard, BookOpen, GraduationCap } from "lucide-react";
import ThemeToggle from "./ThemeComponents/ThemeToggle";
import { useState } from "react";

const NavBar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/mydecks", label: "My Decks", icon: BookOpen },
    { path: "/study", label: "Study", icon: GraduationCap },
  ];

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
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/dashboard"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <BookOpen size={24} />
            Flashlearn
          </Typography>

          <Box sx={{ flexGrow: 1, display: "flex", gap: 2, ml: 6 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: isActive ? "primary.main" : "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                    },
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: isActive ? 600 : 400,
                  }}
                  startIcon={<Icon size={20} />}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ThemeToggle />
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  width: 36,
                  height: 36,
                  fontWeight: "bold",
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </Avatar>
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                mt: 1,
                width: 200,
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                "& .MuiMenuItem-root": {
                  py: 1.5,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                Signed in as
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user?.username || "User"}
              </Typography>
            </Box>
            <Divider />
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <LogOut size={18} color={theme.palette.error.main} />
              </ListItemIcon>
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;
