import { createTheme } from "@mui/material/styles";

// Updated light theme colors with blue instead of purple
const lightPalette = {
  mode: "light",
  primary: {
    main: "#3b82f6", // Bright blue
    light: "#60a5fa",
    dark: "#2563eb",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#10b981", // Emerald green
    light: "#34d399",
    dark: "#059669",
    contrastText: "#ffffff",
  },
  background: {
    default: "#f8fafc", // Soft background
    paper: "#ffffff", // Clean white for cards
    nav: "#f1f5f9", // Light gray for nav
  },
  text: {
    primary: "#1e293b", // Slate-900
    secondary: "#64748b", // Slate-500
  },
  accent: {
    light: "#f1f5f9", // Slate-100
    medium: "#e2e8f0", // Slate-200
    highlight: "#3b82f6", // Blue highlight
  },
};

// Keep dark theme with purple
const darkPalette = {
  mode: "dark",
  primary: {
    main: "#7c3aed", // Vibrant purple
    light: "#9d68f2",
    dark: "#6025c0",
    contrastText: "#ffffff",
  },
  secondary: {
    main: "#10b981", // Emerald green
    light: "#34d399",
    dark: "#059669",
    contrastText: "#ffffff",
  },
  background: {
    default: "#0f172a", // Dark blue-gray background
    paper: "#1e293b", // Slightly lighter for cards
    nav: "#1e293b", // Dark nav background
  },
  text: {
    primary: "#f8fafc",
    secondary: "#cbd5e1",
  },
  accent: {
    light: "#334155", // Slate-700
    medium: "#475569", // Slate-600
    highlight: "#7c3aed", // Purple highlight
  },
};

// Common theme settings
const commonSettings = {
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          backgroundImage: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 600,
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: ({ theme }) =>
              theme.palette.mode === "dark" ? "#6025c0" : "#2563eb",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: ({ theme }) =>
              theme.palette.mode === "dark"
                ? "rgba(124, 58, 237, 0.1)"
                : "rgba(59, 130, 246, 0.1)",
          },
        },
      },
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
};

export const theme = createTheme({
  ...commonSettings,
  palette: lightPalette,
});

export const darkTheme = createTheme({
  ...commonSettings,
  palette: darkPalette,
});
