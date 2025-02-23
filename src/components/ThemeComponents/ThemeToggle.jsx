"use client"

import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import { IconButton } from "@mui/material"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <IconButton
      onClick={() => setTheme(isDark ? "light" : "dark")}
      sx={{
        position: "relative",
        width: "56px",
        height: "32px",
        borderRadius: "16px",
        bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.700" : "background.paper"),
        p: "4px",
        "&:hover": {
          bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.600" : "background.paper"),
        },
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: "4px",
          left: "4px",
          width: "24px",
          height: "24px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? "#3b82f6" : "#ffd4f7",
        }}
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? <Moon className="h-4 w-4 text-white" /> : <Sun className="h-4 w-4 text-gray-800" />}
      </motion.div>
    </IconButton>
  )
}

