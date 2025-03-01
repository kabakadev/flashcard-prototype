"use client";

import { motion } from "framer-motion";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Target,
  Settings,
  Trophy,
  Clock,
  TrendingUp,
  BarChart2,
  Calendar,
} from "lucide-react";
import { CircularProgress } from "../homepageComponents/CircularProgress";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const WeeklyProgressSection = ({
  stats,
  progress,
  weeklyGoal,
  progressPercentage,
  onUpdateGoal,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Weekly Progress Card */}
        <Grid item xs={12} md={8}>
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: "text.primary",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Target size={20} />
                      Weekly Progress
                    </Typography>
                    <Tooltip title="Update weekly goal">
                      <IconButton
                        onClick={onUpdateGoal}
                        sx={{
                          color: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                          },
                        }}
                      >
                        <Settings size={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box sx={{ p: 4 }}>
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.secondary" }}
                      >
                        Progress towards weekly goal
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.primary", fontWeight: "bold" }}
                      >
                        {progress.length} / {weeklyGoal} cards
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progressPercentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                        "& .MuiLinearProgress-bar": {
                          bgcolor: "primary.main",
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {progressPercentage}% Complete
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        <Calendar
                          size={14}
                          style={{
                            verticalAlign: "text-bottom",
                            marginRight: 4,
                          }}
                        />
                        Study streak: {stats.study_streak} days
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    {[
                      {
                        icon: Trophy,
                        value: `${Math.round(stats.retention_rate)}%`,
                        label: "Retention Rate",
                      },
                      {
                        icon: Clock,
                        value: `${Math.round(stats.minutes_per_day)}min`,
                        label: "Avg. Study Time",
                      },
                      {
                        icon: TrendingUp,
                        value: Math.round(stats.cards_mastered),
                        label: "Cards Mastered",
                      },
                      {
                        icon: BarChart2,
                        value: `${Math.round(stats.accuracy)}%`,
                        label: "Accuracy",
                      },
                    ].map((stat, index) => (
                      <Grid item xs={6} sm={3} key={index}>
                        <Box sx={{ textAlign: "center" }}>
                          <Box
                            sx={{
                              bgcolor: isDarkMode
                                ? "rgba(124, 58, 237, 0.15)"
                                : "rgba(124, 58, 237, 0.08)",
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mx: "auto",
                              mb: 1,
                            }}
                          >
                            <stat.icon
                              size={24}
                              color={theme.palette.primary.main}
                            />
                          </Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: "text.primary",
                            }}
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Circular Progress Card */}
        <Grid item xs={12} md={4}>
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                height: "100%",
              }}
            >
              <CardContent
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <CircularProgress
                  percentage={progressPercentage}
                  label="Weekly Goal Progress"
                  size={160}
                />
                <CircularProgress
                  percentage={stats.mastery_level}
                  label="Overall Mastery"
                  size={160}
                />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default WeeklyProgressSection;
