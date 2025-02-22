"use client"

import { motion } from "framer-motion"
import { Brain, Trophy, Clock, Target } from "lucide-react"
import { Card, CardContent, Typography, useTheme } from "@mui/material"
import { CircularProgress } from "./CircularProgress"

const stats = [
  {
    icon: Brain,
    value: 85,
    label: "Retention Rate",
    description: "Average memory retention",
  },
  {
    icon: Trophy,
    value: 120,
    label: "Cards Mastered",
    description: "Successfully learned",
  },
  {
    icon: Clock,
    value: 15,
    label: "Minutes/Day",
    description: "Average study time",
  },
  {
    icon: Target,
    value: 92,
    label: "Accuracy",
    description: "Correct answers",
  },
]

export default function ProgressStats() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"

  return (
    <div className="max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Typography variant="h4" sx={{ color: "text.primary", mb: 2 }}>
          Understand Any Topic, One Flashcard at a Time
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "2xl", mx: "auto" }}>
          Create and study your own flashcards with an intuitive, distraction-free experience. Track your progress and
          retain knowledge more effectively.
        </Typography>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Circular Progress Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card
            sx={{
              height: "100%",
              bgcolor: "background.paper",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 0 0 1px rgba(59, 130, 246, 0.5)"
                    : "0 0 0 1px rgba(152, 245, 225, 0.5)",
              },
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <div className="grid grid-cols-2 gap-8 h-full items-center">
                {[
                  { value: 85, label: "Weekly Goal" },
                  { value: 92, label: "Mastery Level" },
                  { value: 78, label: "Study Streak" },
                  { value: 95, label: "Focus Score" },
                ].map((item, i) => (
                  <CircularProgress key={i} percentage={item.value} label={item.label} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
          style={{ height: "100%" }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ height: "100%" }}
            >
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 0 0 1px rgba(59, 130, 246, 0.5)"
                        : "0 0 0 1px rgba(152, 245, 225, 0.5)",
                  },
                }}
              >
                <CardContent
                  sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                >
                  <div
                    style={{
                      backgroundColor: isDarkMode ? "#3b82f6" : "#ffffff",
                      padding: "10px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      marginBottom: "16px",
                      boxShadow: isDarkMode ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <stat.icon
                      className="w-5 h-5"
                      style={{
                        color: isDarkMode ? "#ffffff" : "#3b82f6",
                        strokeWidth: 2.5,
                      }}
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <Typography variant="h4" sx={{ color: "text.primary", mb: 1, fontWeight: "bold" }}>
                      {stat.value}
                      {stat.label.includes("Rate") || stat.label.includes("Accuracy") ? "%" : ""}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: "text.primary", mb: 0.5, fontWeight: "medium" }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {stat.description}
                    </Typography>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

