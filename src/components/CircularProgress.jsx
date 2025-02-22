"use client"

import { motion } from "framer-motion"
import PropTypes from "prop-types"
import { useTheme } from "./ThemeProvider"

export function CircularProgress({ percentage, label, color, darkColor }) {
  const { theme } = useTheme()
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="100" height="100" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={theme === "dark" ? "#374151" : "#e2e8f0"}
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={theme === "dark" ? darkColor : color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xl font-bold text-gray-800 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      <motion.span
        className="mt-2 text-sm text-gray-600 dark:text-gray-300"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {label}
      </motion.span>
    </div>
  )
}

CircularProgress.propTypes = {
  percentage: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  darkColor: PropTypes.string.isRequired,
}

