"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid, // Import Grid from @mui/material
} from "@mui/material";
import {
  X,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Rotate3D,
  Brain,
  Trophy,
  Clock,
  Target,
} from "lucide-react";
import NavBar from "./NavBar";

const API_URL = "http://localhost:5000";

const StudyMode = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [progress, setProgress] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionStats, setSessionStats] = useState({
    totalCards: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    timeSpent: 0,
    cardsLearned: 0,
  });
  const [showSummary, setShowSummary] = useState(false);
  const [deck, setDeck] = useState(null);
  const startTimeRef = useRef(Date.now());
  const sessionStartTimeRef = useRef(Date.now());

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!showAnswer) {
          setShowAnswer(true);
        }
      } else if (e.key === "ArrowRight") {
        // Next card
        if (showAnswer) {
          handleFlashcardResponse(true);
        } else if (currentFlashcardIndex < flashcards.length - 1) {
          setCurrentFlashcardIndex(currentFlashcardIndex + 1);
          setShowAnswer(false);
          startTimeRef.current = Date.now();
        }
      } else if (e.key === "ArrowLeft") {
        // Previous card
        if (showAnswer) {
          handleFlashcardResponse(false);
        } else if (currentFlashcardIndex > 0) {
          setCurrentFlashcardIndex(currentFlashcardIndex - 1);
          setShowAnswer(false);
          startTimeRef.current = Date.now();
        }
      } else if (showAnswer) {
        if (e.key === "1") {
          handleFlashcardResponse(true);
        } else if (e.key === "0") {
          handleFlashcardResponse(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showAnswer, currentFlashcardIndex, flashcards.length]);

  // Fetch deck details, flashcards, and progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Fetch deck details
        const deckResponse = await fetch(`${API_URL}/decks/${deckId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!deckResponse.ok) throw new Error("Failed to fetch deck details");
        const deckData = await deckResponse.json();
        setDeck(deckData);

        // Fetch flashcards
        const flashcardsResponse = await fetch(`${API_URL}/flashcards`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!flashcardsResponse.ok)
          throw new Error("Failed to fetch flashcards");
        const flashcardsData = await flashcardsResponse.json();
        const deckFlashcards = flashcardsData.filter(
          (card) => card.deck_id === Number.parseInt(deckId)
        );
        setFlashcards(deckFlashcards);

        // Fetch progress for this deck
        const progressResponse = await fetch(
          `${API_URL}/progress/deck/${deckId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!progressResponse.ok) throw new Error("Failed to fetch progress");
        const progressData = await progressResponse.json();
        setProgress(Array.isArray(progressData) ? progressData : []);

        setSessionStats((prev) => ({
          ...prev,
          totalCards: deckFlashcards.length,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load study session. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deckId]);

  const getCardProgress = useCallback(
    (flashcardId) => {
      return (
        progress.find((p) => p.flashcard_id === flashcardId) || {
          study_count: 0,
          correct_attempts: 0,
          incorrect_attempts: 0,
          is_learned: false,
        }
      );
    },
    [progress]
  );

  const handleFlashcardResponse = async (wasCorrect) => {
    const currentFlashcard = flashcards[currentFlashcardIndex];
    const timeSpent = (Date.now() - startTimeRef.current) / 60000; // Convert to minutes

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deck_id: Number.parseInt(deckId),
          flashcard_id: currentFlashcard.id,
          was_correct: wasCorrect,
          time_spent: timeSpent,
        }),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      // Update session stats
      setSessionStats((prev) => ({
        ...prev,
        correctAnswers: prev.correctAnswers + (wasCorrect ? 1 : 0),
        incorrectAnswers: prev.incorrectAnswers + (wasCorrect ? 0 : 1),
        timeSpent: prev.timeSpent + timeSpent,
      }));

      // Move to next card or show summary
      if (currentFlashcardIndex < flashcards.length - 1) {
        setCurrentFlashcardIndex(currentFlashcardIndex + 1);
        setShowAnswer(false);
        startTimeRef.current = Date.now(); // Reset timer for next card
      } else {
        // Calculate final session stats
        const totalTimeSpent =
          (Date.now() - sessionStartTimeRef.current) / 60000;
        setSessionStats((prev) => ({
          ...prev,
          timeSpent: totalTimeSpent,
        }));
        setShowSummary(true);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      setError("Failed to save your progress. Please try again.");
    }
  };

  const handleExitStudy = () => {
    navigate("/study");
  };

  const handleMarkAsLearned = async () => {
    const currentFlashcard = flashcards[currentFlashcardIndex];

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deck_id: Number.parseInt(deckId),
          flashcard_id: currentFlashcard.id,
          was_correct: true,
          time_spent: 0,
          is_learned: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      // Update local progress state
      setProgress((prevProgress) => {
        const updatedProgress = [...prevProgress];
        const index = updatedProgress.findIndex(
          (p) => p.flashcard_id === currentFlashcard.id
        );

        if (index !== -1) {
          updatedProgress[index] = {
            ...updatedProgress[index],
            is_learned: true,
            review_status: "mastered",
          };
        } else {
          updatedProgress.push({
            flashcard_id: currentFlashcard.id,
            deck_id: Number.parseInt(deckId),
            is_learned: true,
            review_status: "mastered",
            study_count: 1,
            correct_attempts: 1,
            incorrect_attempts: 0,
          });
        }

        return updatedProgress;
      });

      // Update session stats
      setSessionStats((prev) => ({
        ...prev,
        cardsLearned: prev.cardsLearned + 1,
      }));
    } catch (error) {
      console.error("Error marking card as learned:", error);
      setError("Failed to mark card as learned. Please try again.");
    }
  };

  if (loading) {
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
          <Brain size={40} color="primary.main" />
        </motion.div>
        <Typography variant="h6" color="text.secondary">
          Loading study session...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/study")}
            >
              Go Back
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (flashcards.length === 0) {
    return (
      <>
        <NavBar />
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Card sx={{ textAlign: "center", p: 4 }}>
            <Brain size={48} sx={{ color: "primary.main", mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              No Flashcards Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This deck doesn't have any flashcards yet. Add some flashcards to
              start studying!
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to={`/mydecks/${deckId}`}
              startIcon={<ArrowLeft size={18} />}
            >
              Back to Deck
            </Button>
          </Card>
        </Container>
      </>
    );
  }

  const currentFlashcard = flashcards[currentFlashcardIndex];
  const cardProgress = getCardProgress(currentFlashcard.id);
  const progressPercentage =
    ((currentFlashcardIndex + 1) / flashcards.length) * 100;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
            >
              {deck?.title || "Study Session"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Master your knowledge through active recall
            </Typography>
          </Box>
          <Tooltip title="Exit Study Session">
            <IconButton
              onClick={handleExitStudy}
              sx={{
                bgcolor: "error.main",
                color: "white",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
            >
              <X size={20} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Progress Section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentFlashcardIndex + 1} of {flashcards.length} cards
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "background.paper",
              "& .MuiLinearProgress-bar": {
                bgcolor: "primary.main",
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Flashcard */}
        <Box sx={{ perspective: "1000px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={
                currentFlashcardIndex + (showAnswer ? "-answer" : "-question")
              }
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  minHeight: 300,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 4,
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 0 0 2px ${theme.palette.primary.main}, 0 4px 20px rgba(0,0,0,0.1)`,
                  },
                }}
                onClick={() => !showAnswer && setShowAnswer(true)}
              >
                <CardContent sx={{ width: "100%", textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    sx={{ mb: 2, color: "text.primary" }}
                  >
                    {showAnswer ? "Answer" : "Question"}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ mb: 4, color: "text.primary", fontWeight: "medium" }}
                  >
                    {showAnswer
                      ? currentFlashcard.back_text
                      : currentFlashcard.front_text}
                  </Typography>

                  {!showAnswer && (
                    <Typography variant="body2" color="text.secondary">
                      Click to reveal answer or press Space
                    </Typography>
                  )}

                  {/* Card Stats */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      display: "flex",
                      gap: 2,
                      color: "text.secondary",
                    }}
                  >
                    <Tooltip title="Times Studied">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Brain size={16} />
                        <Typography variant="caption">
                          {cardProgress.study_count}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Correct Attempts">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <ThumbsUp size={16} />
                        <Typography variant="caption">
                          {cardProgress.correct_attempts}
                        </Typography>
                      </Box>
                    </Tooltip>
                    <Tooltip title="Incorrect Attempts">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <ThumbsDown size={16} />
                        <Typography variant="caption">
                          {cardProgress.incorrect_attempts}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </Box>

                  {/* Mastery Status */}
                  {cardProgress.is_learned && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        color: "success.main",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Trophy size={20} />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: "medium" }}
                      >
                        Mastered
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mb: 2,
            }}
          >
            <Tooltip title="Previous Card (Left Arrow)">
              <span>
                <IconButton
                  onClick={() => {
                    if (currentFlashcardIndex > 0) {
                      setCurrentFlashcardIndex(currentFlashcardIndex - 1);
                      setShowAnswer(false);
                      startTimeRef.current = Date.now();
                    }
                  }}
                  disabled={currentFlashcardIndex === 0}
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": { bgcolor: "action.hover" },
                    "&.Mui-disabled": { opacity: 0.5 },
                  }}
                >
                  <ArrowLeft size={24} />
                </IconButton>
              </span>
            </Tooltip>

            {/* Mark as Learned Button */}
            <Tooltip
              title={
                cardProgress.is_learned ? "Already Learned" : "Mark as Learned"
              }
            >
              <span>
                <Button
                  variant="outlined"
                  color={cardProgress.is_learned ? "success" : "primary"}
                  onClick={handleMarkAsLearned}
                  startIcon={<Trophy size={20} />}
                  disabled={cardProgress.is_learned}
                  sx={{ px: 2 }}
                >
                  {cardProgress.is_learned ? "Learned" : "Mark as Learned"}
                </Button>
              </span>
            </Tooltip>

            <Tooltip title="Next Card (Right Arrow)">
              <span>
                <IconButton
                  onClick={() => {
                    if (currentFlashcardIndex < flashcards.length - 1) {
                      setCurrentFlashcardIndex(currentFlashcardIndex + 1);
                      setShowAnswer(false);
                      startTimeRef.current = Date.now();
                    }
                  }}
                  disabled={currentFlashcardIndex === flashcards.length - 1}
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: 1,
                    "&:hover": { bgcolor: "action.hover" },
                    "&.Mui-disabled": { opacity: 0.5 },
                  }}
                >
                  <ArrowLeft
                    size={24}
                    style={{ transform: "rotate(180deg)" }}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {!showAnswer ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => setShowAnswer(true)}
              startIcon={<Rotate3D size={20} />}
              sx={{
                minWidth: 200,
                py: 1.5,
              }}
            >
              Show Answer
            </Button>
          ) : (
            <>
              <Tooltip title="Press Left Arrow or 0">
                <Button
                  variant="contained"
                  size="large"
                  color="error"
                  onClick={() => handleFlashcardResponse(false)}
                  startIcon={<ThumbsDown size={20} />}
                  sx={{
                    minWidth: 160,
                    py: 1.5,
                  }}
                >
                  Incorrect
                </Button>
              </Tooltip>
              <Tooltip title="Press Right Arrow or 1">
                <Button
                  variant="contained"
                  size="large"
                  color="success"
                  onClick={() => handleFlashcardResponse(true)}
                  startIcon={<ThumbsUp size={20} />}
                  sx={{
                    minWidth: 160,
                    py: 1.5,
                  }}
                >
                  Correct
                </Button>
              </Tooltip>
            </>
          )}
        </Box>

        {/* Study Session Summary Dialog */}
        <Dialog open={showSummary} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ textAlign: "center" }}>
              <Trophy
                size={48}
                style={{ color: "#4CAF50", marginBottom: 16 }}
              />
              {/* Use div instead of Typography to avoid heading nesting */}
              <div
                style={{
                  fontSize: "2.125rem",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: (theme) => theme.palette.text.primary,
                }}
              >
                Study Session Complete!
              </div>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <StatsCard
                    icon={Brain}
                    value={sessionStats.correctAnswers}
                    total={sessionStats.totalCards}
                    label="Correct Answers"
                    color="success.main"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatsCard
                    icon={Target}
                    value={Math.round(
                      (sessionStats.correctAnswers / sessionStats.totalCards) *
                        100
                    )}
                    unit="%"
                    label="Accuracy"
                    color="primary.main"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatsCard
                    icon={Clock}
                    value={Math.round(sessionStats.timeSpent)}
                    unit="min"
                    label="Time Spent"
                    color="info.main"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatsCard
                    icon={Trophy}
                    value={sessionStats.cardsLearned}
                    label="Cards Mastered"
                    color="warning.main"
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: "center" }}>
            <Button variant="outlined" onClick={handleExitStudy} sx={{ mr: 1 }}>
              Back to Study
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setShowSummary(false);
                setCurrentFlashcardIndex(0);
                setShowAnswer(false);
                startTimeRef.current = Date.now();
                setSessionStats({
                  totalCards: flashcards.length,
                  correctAnswers: 0,
                  incorrectAnswers: 0,
                  timeSpent: 0,
                  cardsLearned: 0,
                });
              }}
            >
              Study Again
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

// Stats Card Component for Summary
const StatsCard = ({ icon: Icon, value, total, unit = "", label, color }) => (
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: "background.paper",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      textAlign: "center",
    }}
  >
    <Icon size={24} style={{ color, marginBottom: 8 }} />
    <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
      {value}
      {total ? `/${total}` : unit}
    </Typography>
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>
  </Box>
);

export default StudyMode;
