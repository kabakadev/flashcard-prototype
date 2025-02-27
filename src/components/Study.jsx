"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Modal,
  TextField,
  useTheme,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Brain,
  Target,
  Trophy,
  Clock,
  PlayCircle,
  Settings,
  TrendingUp,
  Calendar,
  BarChart2,
  BookOpen,
} from "lucide-react";
import NavBar from "./NavBar";
import { CircularProgress } from "./homepageComponents/CircularProgress";

const API_URL = "http://localhost:5000";

const Study = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [decks, setDecks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState(10);
  const [stats, setStats] = useState({
    mastery_level: 0,
    study_streak: 0,
    focus_score: 0,
    retention_rate: 0,
    cards_mastered: 0,
    minutes_per_day: 0,
    accuracy: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("authToken");

        // Fetch decks
        const decksResponse = await fetch(`${API_URL}/decks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!decksResponse.ok) throw new Error("Failed to fetch decks");
        const decksData = await decksResponse.json();
        setDecks(Array.isArray(decksData) ? decksData : []);

        // Fetch all progress data
        const progressResponse = await fetch(`${API_URL}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!progressResponse.ok) throw new Error("Failed to fetch progress");
        const progressData = await progressResponse.json();
        setProgress(Array.isArray(progressData) ? progressData : []);

        // Calculate stats based on progress data
        const totalAttempts = progressData.reduce(
          (sum, p) => sum + p.study_count,
          0
        );
        const totalCorrect = progressData.reduce(
          (sum, p) => sum + p.correct_attempts,
          0
        );
        const totalStudyTime = progressData.reduce(
          (sum, p) => sum + p.total_study_time,
          0
        );
        const cardsLearned = progressData.filter((p) => p.is_learned).length;

        // Calculate stats
        const calculatedStats = {
          mastery_level:
            totalAttempts > 0
              ? Math.round((totalCorrect / totalAttempts) * 100)
              : 0,
          study_streak: calculateStudyStreak(progressData),
          focus_score: calculateFocusScore(progressData),
          retention_rate:
            totalAttempts > 0
              ? Math.round((totalCorrect / totalAttempts) * 100)
              : 0,
          cards_mastered: cardsLearned,
          minutes_per_day: calculateAverageStudyTime(progressData),
          accuracy:
            totalAttempts > 0
              ? Math.round((totalCorrect / totalAttempts) * 100)
              : 0,
        };

        setStats(calculatedStats);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load study data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleUpdateWeeklyGoal = async () => {
    if (newWeeklyGoal < 1) {
      setError("Weekly goal must be at least 1");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/user/stats`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekly_goal: newWeeklyGoal }),
      });

      if (response.ok) {
        const data = await response.json();
        setWeeklyGoal(data.weekly_goal);
        setModalOpen(false);
        setError("");
      } else {
        setError("Failed to update weekly goal. Please try again.");
      }
    } catch (error) {
      console.error("Error updating weekly goal:", error);
      setError("An error occurred while updating the weekly goal.");
    }
  };

  // Calculate progress percentage based on cards studied this week
  const calculateWeeklyProgress = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const cardsStudiedThisWeek = progress.filter((p) => {
      const studiedDate = new Date(p.last_studied_at);
      return studiedDate >= startOfWeek;
    }).length;

    return Math.min(Math.round((cardsStudiedThisWeek / weeklyGoal) * 100), 100);
  };

  const progressPercentage = calculateWeeklyProgress();

  const calculateStudyStreak = (progressData) => {
    if (!progressData.length) return 0;

    const dates = progressData
      .map((p) => p.last_studied_at)
      .filter((date) => date)
      .map((date) => new Date(date).toDateString())
      .sort()
      .reverse();

    if (dates.length === 0) return 0;

    let streak = 1;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Check if studied today or yesterday to maintain streak
    if (dates[0] !== today && dates[0] !== yesterday) return 0;

    for (let i = 0; i < dates.length - 1; i++) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diffDays = Math.floor((curr - prev) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) streak++;
      else break;
    }

    return streak;
  };

  const calculateFocusScore = (progressData) => {
    if (!progressData.length) return 0;

    const totalTime = progressData.reduce(
      (sum, p) => sum + p.total_study_time,
      0
    );
    const avgTimePerCard = totalTime / progressData.length;
    const targetTime = 1; // 1 minute per card is target
    return Math.min(Math.round((avgTimePerCard / targetTime) * 100), 100);
  };

  const calculateAverageStudyTime = (progressData) => {
    if (!progressData.length) return 0;

    const totalTime = progressData.reduce(
      (sum, p) => sum + p.total_study_time,
      0
    );
    const uniqueDays = new Set(
      progressData
        .map((p) => p.last_studied_at)
        .filter((date) => date)
        .map((date) => new Date(date).toDateString())
    ).size;

    return uniqueDays > 0 ? Math.round(totalTime / uniqueDays) : 0;
  };

  if (userLoading || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Brain size={40} color={theme.palette.primary.main} />
        </motion.div>
        <Typography variant="h6" color="text.secondary">
          Loading study data...
        </Typography>
      </Box>
    );
  }

  // Calculate deck-specific stats
  const getDeckStats = (deckId) => {
    const deckProgress = progress.filter((p) => p.deck_id === deckId);
    const totalAttempts = deckProgress.reduce(
      (sum, p) => sum + p.study_count,
      0
    );
    const correctAttempts = deckProgress.reduce(
      (sum, p) => sum + p.correct_attempts,
      0
    );
    const mastery =
      totalAttempts > 0
        ? Math.round((correctAttempts / totalAttempts) * 100)
        : 0;
    const cardsLearned = deckProgress.filter((p) => p.is_learned).length;
    const lastStudied =
      deckProgress.length > 0
        ? new Date(
            Math.max(...deckProgress.map((p) => new Date(p.last_studied_at)))
          )
        : null;

    return {
      mastery,
      cardsLearned,
      lastStudied,
    };
  };

  // Format relative time
  const getRelativeTime = (date) => {
    if (!date) return "Never";

    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        pb: 8,
      }}
    >
      <NavBar />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Brain size={32} />
              Study Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Track your progress and choose a deck to study
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
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
                            onClick={() => setModalOpen(true)}
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
                            value: `${stats.retention_rate}%`,
                            label: "Retention Rate",
                          },
                          {
                            icon: Clock,
                            value: `${stats.minutes_per_day}min`,
                            label: "Avg. Study Time",
                          },
                          {
                            icon: TrendingUp,
                            value: stats.cards_mastered,
                            label: "Cards Mastered",
                          },
                          {
                            icon: BarChart2,
                            value: `${stats.accuracy}%`,
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

          {/* Deck Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 3,
              }}
            >
              <BookOpen size={24} />
              Choose a Deck to Study
            </Typography>

            {decks.length === 0 ? (
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  p: 6,
                  textAlign: "center",
                }}
              >
                <Brain
                  size={48}
                  color={theme.palette.primary.main}
                  style={{ marginBottom: 16 }}
                />
                <Typography
                  variant="h5"
                  sx={{ color: "text.primary", mb: 2, fontWeight: "bold" }}
                >
                  No Decks Available
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mb: 4 }}
                >
                  Create your first deck to start studying!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/mydecks")}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  Create New Deck
                </Button>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {decks.map((deck) => {
                  const stats = getDeckStats(deck.id);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={deck.id}>
                      <motion.div
                        variants={itemVariants}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card
                          sx={{
                            borderRadius: 3,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            height: "100%",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            },
                          }}
                          onClick={() => navigate(`/study/${deck.id}`)}
                        >
                          <CardContent sx={{ p: 0 }}>
                            <Box
                              sx={{
                                p: 3,
                                borderBottom: 1,
                                borderColor: "divider",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: "bold",
                                  color: "text.primary",
                                  mb: 1,
                                }}
                              >
                                {deck.title}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    bgcolor: "background.default",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                  }}
                                >
                                  {deck.subject || "No Subject"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    bgcolor: "background.default",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                  }}
                                >
                                  {stats.cardsLearned} / {deck.card_count || 0}{" "}
                                  learned
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ p: 3 }}>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary", mb: 3 }}
                              >
                                {deck.description ||
                                  "No description available."}
                              </Typography>
                              <Box sx={{ mb: 3 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    Mastery Level
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.primary",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {stats.mastery}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={stats.mastery}
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor:
                                      theme.palette.mode === "dark"
                                        ? "rgba(255,255,255,0.1)"
                                        : "rgba(0,0,0,0.1)",
                                    "& .MuiLinearProgress-bar": {
                                      bgcolor: "primary.main",
                                      borderRadius: 3,
                                    },
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.secondary",
                                    mt: 1,
                                    display: "block",
                                  }}
                                >
                                  Last studied:{" "}
                                  {getRelativeTime(stats.lastStudied)}
                                </Typography>
                              </Box>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<PlayCircle size={18} />}
                                sx={{
                                  bgcolor: "primary.main",
                                  color: "primary.contrastText",
                                  "&:hover": {
                                    bgcolor: "primary.dark",
                                  },
                                }}
                              >
                                Start Studying
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        </motion.div>

        {/* Update Weekly Goal Modal */}
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setError("");
          }}
          aria-labelledby="update-goal-title"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 500 },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              p: 4,
            }}
          >
            <Typography
              variant="h5"
              id="update-goal-title"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Update Weekly Goal
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <TextField
              label="New Weekly Goal"
              type="number"
              value={newWeeklyGoal}
              onChange={(e) =>
                setNewWeeklyGoal(Math.max(1, Number(e.target.value)))
              }
              fullWidth
              required
              error={newWeeklyGoal < 1}
              helperText={newWeeklyGoal < 1 && "Weekly goal must be at least 1"}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleUpdateWeeklyGoal}
                sx={{
                  flex: 1,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setModalOpen(false);
                  setError("");
                }}
                sx={{
                  flex: 1,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "rgba(124, 58, 237, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default Study;
