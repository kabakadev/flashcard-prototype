import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavBar from "./NavBar";

const API_URL = "http://localhost:5000";

const StudyMode = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch flashcards for the selected deck
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/flashcards`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFlashcards(
            data.filter((card) => card.deck_id === parseInt(deckId))
          );
        } else {
          console.error("Failed to fetch flashcards");
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFlashcards();
  }, [deckId]);

  const handleFlashcardResponse = async (wasCorrect) => {
    const currentFlashcard = flashcards[currentFlashcardIndex];
    const timeSpent = 1; // Example: 1 minute spent on the flashcard

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deck_id: deckId,
          flashcard_id: currentFlashcard.id,
          was_correct: wasCorrect,
          time_spent: timeSpent,
        }),
      });

      if (response.ok) {
        // Move to the next flashcard
        if (currentFlashcardIndex < flashcards.length - 1) {
          setCurrentFlashcardIndex(currentFlashcardIndex + 1);
          setShowAnswer(false);
        } else {
          // End of deck
          alert("You've completed this deck!");
          navigate("/study");
        }
      } else {
        console.error("Failed to track progress");
      }
    } catch (error) {
      console.error("Error tracking progress:", error);
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
        }}
      >
        <CircularProgress /> {/* Show loading spinner */}
      </Box>
    );
  }

  if (flashcards.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <NavBar />
        <Typography variant="body1" color="textSecondary">
          No flashcards found for this deck.
        </Typography>
      </Box>
    );
  }

  // Calculate progress percentage
  const progress = ((currentFlashcardIndex + 1) / flashcards.length) * 100;

  return (
    <div>
      <NavBar /> {/* Add NavBar */}
      <Box sx={{ p: 4, position: "relative" }}>
        {/* Close Button */}
        <IconButton
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1,
            backgroundColor: "red", // Red background
            color: "white", // White icon
            "&:hover": {
              backgroundColor: "darkred", // Darker red on hover
            },
          }}
          onClick={() => navigate("/study")} // Navigate back to /study
        >
          <CloseIcon />
        </IconButton>

        {/* Progress Bar */}
        <Box sx={{ mb: 4 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {currentFlashcardIndex + 1} of {flashcards.length} flashcards
          </Typography>
        </Box>

        <Typography variant="h4" gutterBottom>
          Study Mode
        </Typography>

        {/* Flashcard Section */}
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

        {/* Buttons */}
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
    </div>
  );
};

export default StudyMode;
