"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { Box, Container, Grid, useTheme } from "@mui/material";
import NavBar from "./NavBar";
import LoadingState from "./Dashboard/LoadingState";
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
        const decksData = await fetchDecks(token);
        const progressData = await fetchProgress(token);
        setDecks(decksData);
        setProgress(progressData);
        calculateStats(progressData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  const calculateStats = (progressData) => {
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
      weekly_goal: 10,
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

  if (loading || dataLoading) {
    return <LoadingState theme={theme} />;
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
