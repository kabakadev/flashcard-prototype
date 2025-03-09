"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NavBar from "../NavBar";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import StatsOverview from "./StatsOverview";
import DecksList from "./DecksList";
import WeeklyGoalDialog from "./WeeklyGoalDialog";
import NotificationSnackbar from "./NotificationSnackbar";

const Study = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();

  // State variables
  const [decks, setDecks] = useState([]);
  const [userStats, setUserStats] = useState({
    weekly_goal: 50,
    mastery_level: 0,
    study_streak: 0,
    retention_rate: 0,
    cards_mastered: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(50);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Protect route
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  // Fetch decks and user stats
  useEffect(() => {
    if (isAuthenticated) {
      fetchDecks();
      fetchUserStats();
    }
  }, [isAuthenticated]);

  const fetchDecks = async () => {
    try {
      const response = await fetch("http://localhost:5000/decks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDecks(data);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch decks");
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        "https://flashlearn-backend-2.onrender.com/dashboard",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserStats({
          weekly_goal: data.weekly_goal || 50,
          mastery_level: data.mastery_level || 0,
          study_streak: data.study_streak || 0,
          retention_rate: data.retention_rate || 0,
          cards_mastered: data.cards_mastered || 0,
        });
        setNewWeeklyGoal(data.weekly_goal || 50);
      } else {
        console.error("Failed to fetch user stats");
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const updateWeeklyGoal = async () => {
    try {
      const response = await fetch(
        "https://flashlearn-backend-2.onrender.com/user/stats",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            weekly_goal: newWeeklyGoal,
          }),
        }
      );

      if (response.ok) {
        setUserStats({
          ...userStats,
          weekly_goal: newWeeklyGoal,
        });
        setGoalDialogOpen(false);
        setSnackbar({
          open: true,
          message: "Weekly goal updated successfully!",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update weekly goal",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating weekly goal:", error);
      setSnackbar({
        open: true,
        message: "Error updating weekly goal",
        severity: "error",
      });
    }
  };

  const handleDeckClick = (deckId) => {
    navigate(`/study/${deckId}`);
  };

  if (loading || isLoading) {
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
    <>
      <NavBar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 4, fontWeight: "bold" }}
        >
          Study Dashboard
        </Typography>

        {/* Stats Overview */}
        <StatsOverview
          userStats={userStats}
          onUpdateGoalClick={() => setGoalDialogOpen(true)}
        />

        {/* Decks to Study */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
          Your Decks
        </Typography>

        <DecksList
          decks={decks}
          onDeckClick={handleDeckClick}
          onCreateDeckClick={() => navigate("/mydecks")}
        />

        {/* Weekly Goal Dialog */}
        <WeeklyGoalDialog
          open={goalDialogOpen}
          onClose={() => setGoalDialogOpen(false)}
          weeklyGoal={newWeeklyGoal}
          onWeeklyGoalChange={(newValue) => setNewWeeklyGoal(newValue)}
          onSave={updateWeeklyGoal}
        />

        {/* Snackbar for notifications */}
        <NotificationSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Container>
    </>
  );
};

export default Study;
