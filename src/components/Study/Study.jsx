"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Box, Container, Alert } from "@mui/material";
import NavBar from "../NavBar";
import StudyHeader from "./StudyHeader";
import WeeklyProgressSection from "./WeeklyProgressSection";
import DeckSelectionSection from "./DeckSelectionSection";
import LoadingState from "./LoadingState";
import UpdateGoalModal from "./UpdateGoalModal";
import { fetchUserData, updateWeeklyGoal } from "../../utils/studyApi";

const API_URL = "http://localhost:5000";

const Study = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const navigate = useNavigate();

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

  // Initialize weekly goal from localStorage if available
  useEffect(() => {
    const savedWeeklyGoal = localStorage.getItem("weeklyGoal");
    if (savedWeeklyGoal) {
      const parsedGoal = Number.parseInt(savedWeeklyGoal, 10);
      setWeeklyGoal(parsedGoal);
      setNewWeeklyGoal(parsedGoal);
    }
  }, []);

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const data = await fetchUserData(user);
        setDecks(data.decks);
        setProgress(data.progress);
        setWeeklyGoal(data.weeklyGoal);
        setNewWeeklyGoal(data.weeklyGoal);
        setStats(data.stats);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load study data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleUpdateWeeklyGoal = async () => {
    if (newWeeklyGoal < 1) {
      setError("Weekly goal must be at least 1");
      return;
    }

    try {
      const updatedGoal = await updateWeeklyGoal(newWeeklyGoal);
      setWeeklyGoal(updatedGoal);
      localStorage.setItem("weeklyGoal", updatedGoal.toString());
      setModalOpen(false);
      setError("");
    } catch (error) {
      console.error("Error updating weekly goal:", error);
      setError("An error occurred while updating the weekly goal.");
    }
  };

  if (userLoading || loading) {
    return <LoadingState />;
  }

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

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <NavBar />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <StudyHeader />

        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <WeeklyProgressSection
          stats={stats}
          progress={progress}
          weeklyGoal={weeklyGoal}
          progressPercentage={progressPercentage}
          onUpdateGoal={() => setModalOpen(true)}
        />

        <DeckSelectionSection
          decks={decks}
          progress={progress}
          navigate={navigate}
        />

        <UpdateGoalModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setError("");
          }}
          weeklyGoal={newWeeklyGoal}
          setWeeklyGoal={setNewWeeklyGoal}
          onSave={handleUpdateWeeklyGoal}
          error={error}
          setError={setError}
        />
      </Container>
    </Box>
  );
};

export default Study;
