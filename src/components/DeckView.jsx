import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://localhost:5000";

const DeckView = () => {
  const { user, isAuthenticated, loading } = useUser();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/flashcards`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch flashcards, status: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Debugging

        if (!Array.isArray(data)) {
          console.warn("API did not return an array:", data);
          setFlashcards([]);
          return;
        }

        // Debugging the deckId type
        console.log("deckId from useParams:", deckId, typeof deckId);

        // Ensure deckId is a number
        const parsedDeckId = Number(deckId);
        if (isNaN(parsedDeckId)) {
          console.error("Invalid deckId:", deckId);
          setFlashcards([]);
          return;
        }

        // Filter flashcards based on deck_id
        const filteredFlashcards = data.filter(
          (flashcard) => Number(flashcard.deck_id) === parsedDeckId
        );
        console.log("Filtered flashcards:", filteredFlashcards);

        setFlashcards(filteredFlashcards);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        setFlashcards([]);
      }
    };

    fetchFlashcards();
  }, [deckId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (flashcards.length === 0)
    return <Typography>No flashcards found for this deck.</Typography>;

  return (
    <div className="mt-4">
      <Typography variant="h4" gutterBottom>
        Deck {deckId}
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flashcards.map((flashcard) => (
          <Card key={flashcard.id} className="relative">
            <CardContent>
              <Typography variant="h6" className="mb-2">
                {flashcard.question}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {flashcard.answer}
              </Typography>
            </CardContent>
            <div className="flex justify-between p-2">
              <IconButton onClick={() => console.log("Edit", flashcard.id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => console.log("Delete", flashcard.id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="contained" onClick={() => navigate("/mydecks")}>
          Go Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/study/${deckId}`)}
        >
          Start Studying
        </Button>
      </div>
    </div>
  );
};

export default DeckView;
