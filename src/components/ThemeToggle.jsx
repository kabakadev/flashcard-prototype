"use client"

import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative h-8 w-14 rounded-full bg-[#98f5e1] dark:bg-gray-700 p-1 transition-colors duration-300"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 left-1 h-6 w-6 rounded-full bg-[#ffd4f7] dark:bg-blue-500 flex items-center justify-center"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? <Moon className="h-4 w-4 text-white" /> : <Sun className="h-4 w-4 text-gray-800" />}
      </motion.div>
    </motion.button>
  )
}

