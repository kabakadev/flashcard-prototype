import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
} from "@mui/material";

const API_URL = "http://localhost:5000";

const StudyMode = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyProgress, setStudyProgress] = useState([]);
  const [masteryLevel, setMasteryLevel] = useState(0);
  const [cardsMastered, setCardsMastered] = useState(0);
  const [retentionRate, setRetentionRate] = useState(0);
  const [focusScore, setFocusScore] = useState(0);
  const [minutesStudied, setMinutesStudied] = useState(0);

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
        const progressData = await response.json();
        setStudyProgress([...studyProgress, progressData]);

        // Update metrics
        setMasteryLevel(progressData.mastery_level || 0);
        setCardsMastered(progressData.cards_mastered || 0);
        setRetentionRate(progressData.retention_rate || 0);
        setFocusScore(progressData.focus_score || 0);
        setMinutesStudied((prev) => prev + timeSpent);

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

  if (flashcards.length === 0) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Study Mode
      </Typography>

      {/* Metrics Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Metrics</Typography>
        <Typography>Mastery Level: {masteryLevel}</Typography>
        <Typography>Cards Mastered: {cardsMastered}</Typography>
        <Typography>Retention Rate: {retentionRate}%</Typography>
        <Typography>Focus Score: {focusScore}%</Typography>
        <Typography>Minutes Studied Today: {minutesStudied}</Typography>
      </Box>

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
  );
};

export default StudyMode;
