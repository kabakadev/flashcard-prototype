"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
  useTheme,
  LinearProgress,
} from "@mui/material";
import {
  Brain,
  Trophy,
  Clock,
  Target,
  Plus,
  BookOpen,
  BarChart2,
  Calendar,
  PlayCircle,
} from "lucide-react";
import NavBar from "./NavBar";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [decks, setDecks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({
    total_flashcards_studied: 0,
    weekly_goal: 10,
    study_streak: 0,
    mastery_level: 0,
    cards_mastered: 0,
    retention_rate: 0,
    average_study_time: 0,
  });
  const [dataLoading, setDataLoading] = useState(true);
  const API_URL = "http://localhost:5000";

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
    if (!dataLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [dataLoading, isAuthenticated, navigate]);

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

        // Calculate weekly studied cards
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);
        const cardsStudiedThisWeek = progressData.filter((p) => {
          const studiedDate = new Date(p.last_studied_at);
          return studiedDate >= startOfWeek;
        }).length;

        // Calculate study streak
        const streak = calculateStudyStreak(progressData);

        // Calculate average study time per day
        const uniqueDays = new Set(
          progressData
            .map((p) => p.last_studied_at)
            .filter((date) => date)
            .map((date) => new Date(date).toDateString())
        ).size;

        const averageStudyTime =
          uniqueDays > 0 ? Math.round(totalStudyTime / uniqueDays) : 0;

        setStats({
          total_flashcards_studied: cardsStudiedThisWeek,
          weekly_goal: 10, // Default weekly goal
          study_streak: streak,
          mastery_level:
            totalAttempts > 0
              ? Math.round((totalCorrect / totalAttempts) * 100)
              : 0,
          cards_mastered: cardsLearned,
          retention_rate:
            totalAttempts > 0
              ? Math.round((totalCorrect / totalAttempts) * 100)
              : 0,
          average_study_time: averageStudyTime,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  const weeklyProgress = Math.round(
    (stats.total_flashcards_studied / stats.weekly_goal) * 100
  );

  if (loading || dataLoading) {
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
          Loading your dashboard...
        </Typography>
      </Box>
    );
  }

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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
            >
              Welcome back, {user?.username || "Learner"}!
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Track your progress, review your decks, and continue your learning
              journey.
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Overview */}
        <Grid container spacing={4}>
          {/* Left Column - Progress Stats */}
          <Grid item xs={12} md={8}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Progress Card */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  mb: 4,
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
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
                      <BarChart2 size={20} />
                      Learning Progress
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    {/* Weekly Progress */}
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
                          Weekly Goal Progress
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: "text.primary", fontWeight: "bold" }}
                        >
                          {stats.total_flashcards_studied} / {stats.weekly_goal}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={weeklyProgress > 100 ? 100 : weeklyProgress}
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
                          {weeklyProgress}% Complete
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
                          {stats.study_streak} day streak
                        </Typography>
                      </Box>
                    </Box>

                    {/* Stats Grid */}
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <StatsCard
                          icon={Trophy}
                          value={stats.cards_mastered}
                          label="Cards Mastered"
                          theme={theme}
                          isDarkMode={isDarkMode}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <StatsCard
                          icon={Brain}
                          value={`${stats.retention_rate}%`}
                          label="Retention Rate"
                          theme={theme}
                          isDarkMode={isDarkMode}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <StatsCard
                          icon={Clock}
                          value={`${stats.average_study_time}min`}
                          label="Avg. Study Time"
                          theme={theme}
                          isDarkMode={isDarkMode}
                        />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <StatsCard
                          icon={Target}
                          value={`${stats.mastery_level}%`}
                          label="Mastery Level"
                          theme={theme}
                          isDarkMode={isDarkMode}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>

              {/* Decks Section */}
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <BookOpen size={24} />
                  Recent Decks
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Plus size={18} />}
                  component={RouterLink}
                  to="/mydecks"
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    borderRadius: 2,
                  }}
                >
                  Create Deck
                </Button>
              </Box>

              <Grid container spacing={3}>
                {decks.length > 0 ? (
                  decks.slice(0, 4).map((deck) => {
                    const deckStats = getDeckStats(deck.id);
                    return (
                      <Grid item xs={12} sm={6} key={deck.id}>
                        <motion.div
                          variants={itemVariants}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <Card
                            sx={{
                              borderRadius: 3,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                              },
                            }}
                          >
                            <CardContent
                              sx={{
                                p: 0,
                                flexGrow: 1,
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
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
                                  }}
                                >
                                  {deck.title}
                                </Typography>
                              </Box>
                              <Box sx={{ p: 3, flexGrow: 1 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "text.secondary", mb: 2 }}
                                >
                                  {deck.description ||
                                    "No description available."}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 2,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {deckStats.cardsLearned} /{" "}
                                    {deck.card_count || 0} learned
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    Last studied:{" "}
                                    {getRelativeTime(deckStats.lastStudied)}
                                  </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
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
                                      Mastery
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: "text.primary",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {deckStats.mastery}%
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={deckStats.mastery}
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
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  p: 2,
                                  borderTop: 1,
                                  borderColor: "divider",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  fullWidth
                                  startIcon={<PlayCircle size={18} />}
                                  onClick={() => navigate(`/study/${deck.id}`)}
                                  sx={{
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    "&:hover": {
                                      bgcolor: "primary.dark",
                                    },
                                    borderRadius: 2,
                                  }}
                                >
                                  Study Now
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    );
                  })
                ) : (
                  <Grid item xs={12}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        p: 4,
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: "text.secondary", mb: 2 }}
                      >
                        You don't have any decks yet
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        component={RouterLink}
                        to="/mydecks"
                        sx={{
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                          borderRadius: 2,
                        }}
                      >
                        Create Your First Deck
                      </Button>
                    </Card>
                  </Grid>
                )}
              </Grid>

              {decks.length > 4 && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/mydecks"
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "primary.dark",
                        bgcolor: "rgba(124, 58, 237, 0.04)",
                      },
                      borderRadius: 2,
                    }}
                  >
                    View All Decks
                  </Button>
                </Box>
              )}
            </motion.div>
          </Grid>

          {/* Right Column - Quick Actions & Tips */}
          <Grid item xs={12} md={4}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Quick Study Card */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  mb: 4,
                  overflow: "hidden",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <motion.div variants={itemVariants}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          p: 1,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Clock size={20} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Quick Study
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                      Ready for a quick study session? Choose a deck to review
                      and improve your mastery.
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      component={RouterLink}
                      to="/study"
                      sx={{
                        bgcolor: "white",
                        color: "primary.main",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.9)",
                        },
                        borderRadius: 2,
                      }}
                    >
                      Start Studying
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Learning Tips */}
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
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
                      <Brain size={20} />
                      Learning Tips
                    </Typography>
                  </Box>
                  <Box sx={{ p: 3 }}>
                    <motion.div variants={itemVariants}>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "text.primary", mb: 2 }}
                      >
                        Improve your retention with these strategies:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                        {[
                          "Study in short, focused sessions rather than long marathons",
                          "Review cards right before bedtime to improve memory consolidation",
                          "Explain concepts out loud to enhance understanding",
                          "Connect new information to things you already know",
                        ].map((tip, index) => (
                          <Box
                            component="li"
                            key={index}
                            sx={{ mb: 1, color: "text.secondary" }}
                          >
                            <Typography variant="body2">{tip}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </motion.div>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, value, label, theme, isDarkMode }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
    <Box
      sx={{
        bgcolor: isDarkMode
          ? "rgba(124, 58, 237, 0.15)"
          : "rgba(124, 58, 237, 0.08)",
        p: 1,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={18} color={theme.palette.primary.main} />
    </Box>
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "text.primary", lineHeight: 1.2 }}
      >
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
    </Box>
  </Box>
);

export default Dashboard;
