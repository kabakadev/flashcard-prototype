import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  LinearProgress,
  Modal,
  TextField,
} from "@mui/material";
import NavBar from "./NavBar";

const API_URL = "http://localhost:5000";

const Study = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyProgress, setStudyProgress] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState(50); // Default weekly goal
  const [modalOpen, setModalOpen] = useState(false);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(weeklyGoal);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/decks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setDecks(data);
        } else {
          console.error("Failed to fetch decks");
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    };

    fetchDecks();
  }, [user]);

  useEffect(() => {
    if (selectedDeck) {
      const fetchFlashcards = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`${API_URL}/flashcards`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setFlashcards(
              data.filter((card) => card.deck_id === selectedDeck.id)
            );
          } else {
            console.error("Failed to fetch flashcards");
          }
        } catch (error) {
          console.error("Error fetching flashcards:", error);
        }
      };

      fetchFlashcards();
    }
  }, [selectedDeck]);

  const handleDeckSelection = (deck) => {
    setSelectedDeck(deck);
    setCurrentFlashcardIndex(0);
    setShowAnswer(false);
  };

  const handleFlashcardResponse = async (wasCorrect) => {
    const currentFlashcard = flashcards[currentFlashcardIndex];
    const timeSpent = 30; // Example: 30 seconds spent on the flashcard

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deck_id: selectedDeck.id,
          flashcard_id: currentFlashcard.id,
          was_correct: wasCorrect,
          time_spent: timeSpent,
        }),
      });

      if (response.ok) {
        const progressData = await response.json();
        setStudyProgress([...studyProgress, progressData]);

        // Move to the next flashcard
        if (currentFlashcardIndex < flashcards.length - 1) {
          setCurrentFlashcardIndex(currentFlashcardIndex + 1);
          setShowAnswer(false);
        } else {
          // End of deck
          alert("You've completed this deck!");
          setSelectedDeck(null);
        }
      } else {
        console.error("Failed to track progress");
      }
    } catch (error) {
      console.error("Error tracking progress:", error);
    }
  };

  const handleUpdateWeeklyGoal = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/user/weekly-goal`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekly_goal: newWeeklyGoal }),
      });

      if (response.ok) {
        setWeeklyGoal(newWeeklyGoal);
        setModalOpen(false);
      } else {
        console.error("Failed to update weekly goal");
      }
    } catch (error) {
      console.error("Error updating weekly goal:", error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <NavBar />
      <div className="mt-4 p-4">
        <Typography variant="h4" gutterBottom>
          Study
        </Typography>

        {/* Weekly Goal Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Weekly Goal: {weeklyGoal} flashcards
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(studyProgress.length / weeklyGoal) * 100}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setModalOpen(true)}
            sx={{ mt: 2 }}
          >
            Update Weekly Goal
          </Button>
        </Box>

        {/* Deck Selection Section */}
        {!selectedDeck && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Choose a Deck to Study
            </Typography>
            <Grid container spacing={3}>
              {decks.map((deck) => (
                <Grid item xs={12} sm={6} md={4} key={deck.id}>
                  <Card onClick={() => handleDeckSelection(deck)}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {deck.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {deck.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Flashcard Study Section */}
        {selectedDeck && flashcards.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Studying: {selectedDeck.title}
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {flashcards[currentFlashcardIndex].front_text}
                </Typography>
                {showAnswer && (
                  <Typography variant="body1" color="textSecondary">
                    {flashcards[currentFlashcardIndex].back_text}
                  </Typography>
                )}
              </CardContent>
            </Card>
            <Box sx={{ mt: 2 }}>
              {!showAnswer ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowAnswer(true)}
                >
                  Show Answer
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleFlashcardResponse(true)}
                    sx={{ mr: 2 }}
                  >
                    Correct
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleFlashcardResponse(false)}
                  >
                    Incorrect
                  </Button>
                </>
              )}
            </Box>
          </Box>
        )}

        {/* Update Weekly Goal Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Update Weekly Goal
            </Typography>
            <TextField
              label="New Weekly Goal"
              type="number"
              value={newWeeklyGoal}
              onChange={(e) => setNewWeeklyGoal(Number(e.target.value))}
              fullWidth
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateWeeklyGoal}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setModalOpen(false)}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Study;
