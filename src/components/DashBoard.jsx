"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import {
  Box,
  Container,
  Grid,
  useTheme,
  CircularProgress,
} from "@mui/material";
import NavBar from "./NavBar";

import WelcomeSection from "./Dashboard/WelcomeSection";
import ProgressCard from "./Dashboard/ProgressCard";
import QuickStudyCard from "./Dashboard/QuickStudyCard";
import LearningTipsCard from "./Dashboard/LeadingTipsCard";
import { calculateStudyStreak, getDeckStats } from "../utils/dashBoardutil";
import DecksSection from "./Dashboard/DeckSection";

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [decks, setDecks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({});
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("authToken");
        const decksData = await fetchDecks(token);
        const progressData = await fetchProgress(token);
        const userStats = await fetchUserStats(token);
        setDecks(decksData);
        setProgress(progressData);
        calculateStats(progressData, userStats.weekly_goal);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);
  const fetchUserStats = async (token) => {
    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return {
          weekly_goal: data.weekly_goal,
          mastery_level: data.mastery_level,
          study_streak: data.study_streak,
          focus_score: data.focus_score,
          retention_rate: data.retention_rate,
          cards_mastered: data.cards_mastered,
          minutes_per_day: data.minutes_per_day,
          accuracy: data.accuracy,
        };
      }

      throw new Error("Failed to fetch dashboard data");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // // Fallback to localStorage if there's an error
      // const savedWeeklyGoal = localStorage.getItem("weeklyGoal");
      // return {
      //   weekly_goal: savedWeeklyGoal
      //     ? Number.parseInt(savedWeeklyGoal, 10)
      //     : 10,
      //   mastery_level: 0,
      //   study_streak: 0,
      //   focus_score: 0,
      //   retention_rate: 0,
      //   cards_mastered: 0,
      //   minutes_per_day: 0,
      //   accuracy: 0,
      // };
    }
  };
  const fetchDecks = async (token) => {
    const response = await fetch(`${API_URL}/decks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch decks");
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  const fetchProgress = async (token) => {
    const response = await fetch(`${API_URL}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch progress");
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  };

  const calculateStats = (progressData, weekly_goal) => {
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
    const cardsStudiedThisWeek = getCardsStudiedThisWeek(progressData);
    const streak = calculateStudyStreak(progressData);
    const averageStudyTime = calculateAverageStudyTime(
      progressData,
      totalStudyTime
    );

    setStats({
      total_flashcards_studied: cardsStudiedThisWeek,
      weekly_goal: weekly_goal, // Use the passed weekly_goal
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
  };

  const getCardsStudiedThisWeek = (progressData) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    return progressData.filter(
      (p) => new Date(p.last_studied_at) >= startOfWeek
    ).length;
  };

  const calculateAverageStudyTime = (progressData, totalStudyTime) => {
    const uniqueDays = new Set(
      progressData
        .map((p) => p.last_studied_at)
        .filter((date) => date)
        .map((date) => new Date(date).toDateString())
    ).size;
    return uniqueDays > 0 ? Math.round(totalStudyTime / uniqueDays) : 0;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <WelcomeSection username={user?.username} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <ProgressCard stats={stats} theme={theme} isDarkMode={isDarkMode} />
            <DecksSection
              decks={decks}
              getDeckStats={(deckId) => getDeckStats(deckId, progress)}
              navigate={navigate}
              theme={theme}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <QuickStudyCard />
            <LearningTipsCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
