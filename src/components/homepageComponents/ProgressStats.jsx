"use client";

import { motion } from "framer-motion";
import { Brain, Trophy, Clock, Target } from "lucide-react";
import {
  Card,
  CardContent,
  Typography,
  useTheme,
  Grid,
  Box,
} from "@mui/material";
import { CircularProgress } from "./CircularProgress";

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
];

export default function ProgressStats() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Custom icon background colors based on theme
  const iconBgColor = isDarkMode
    ? "rgba(124, 58, 237, 0.15)" // Subtle purple in dark mode
    : "rgba(124, 58, 237, 0.08)"; // Very light purple in light mode

  const iconColor = theme.palette.primary.main;

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}>
      <Grid container spacing={4}>
        {/* Circular Progress Card */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card
              sx={{
                height: "100%",
                bgcolor: "background.paper",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4}>
                  {[
                    { value: 85, label: "Weekly Goal" },
                    { value: 92, label: "Mastery Level" },
                    { value: 78, label: "Study Streak" },
                    { value: 95, label: "Focus Score" },
                  ].map((item, i) => (
                    <Grid item xs={6} key={i}>
                      <CircularProgress
                        percentage={item.value}
                        label={item.label}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      bgcolor: "background.paper",
                      borderRadius: "16px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          backgroundColor: iconBgColor,
                          padding: "12px",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "48px",
                          height: "48px",
                          mb: 2,
                          boxShadow: isDarkMode
                            ? "none"
                            : "0 4px 8px rgba(124, 58, 237, 0.1)",
                        }}
                      >
                        <stat.icon
                          style={{
                            color: iconColor,
                            strokeWidth: 2.5,
                          }}
                        />
                      </Box>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            color: "text.primary",
                            mb: 1,
                            fontWeight: "bold",
                          }}
                        >
                          {stat.value}
                          {stat.label.includes("Rate") ||
                          stat.label.includes("Accuracy")
                            ? "%"
                            : ""}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "text.primary",
                            mb: 0.5,
                            fontWeight: "medium",
                          }}
                        >
                          {stat.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          {stat.description}
                        </Typography>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
