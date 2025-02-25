import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Modal,
  TextField,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavBar from "./NavBar";

const API_URL = "http://localhost:5000";

const DeckView = () => {
  const { user, isAuthenticated, loading } = useUser();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({
    front_text: "",
    back_text: "",
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/flashcards`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch flashcards");
        }

        const data = await response.json();
        setFlashcards(
          data.filter((flashcard) => flashcard.deck_id === parseInt(deckId))
        );
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    fetchFlashcards();
  }, [deckId, user]);

  const handleEdit = (flashcard) => {
    setSelectedFlashcard(flashcard);
    setModalOpen(true);
  };

  const handleDelete = async (flashcardId) => {
    if (window.confirm("Are you sure you want to delete this flashcard?")) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/flashcards/${flashcardId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          setFlashcards(flashcards.filter((card) => card.id !== flashcardId));
        } else {
          console.error("Failed to delete flashcard");
        }
      } catch (error) {
        console.error("Error deleting flashcard:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/flashcards/${selectedFlashcard.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedFlashcard),
        }
      );

      if (response.ok) {
        setFlashcards(
          flashcards.map((card) =>
            card.id === selectedFlashcard.id ? selectedFlashcard : card
          )
        );
        setModalOpen(false);
      } else {
        console.error("Failed to update flashcard");
      }
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  const handleAddFlashcard = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deck_id: parseInt(deckId),
          front_text: newFlashcard.front_text,
          back_text: newFlashcard.back_text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFlashcards([...flashcards, data]);
        setAddModalOpen(false);
        setNewFlashcard({ front_text: "", back_text: "" }); // Reset form
      } else {
        console.error("Failed to add flashcard");
      }
    } catch (error) {
      console.error("Error adding flashcard:", error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <NavBar />
      <div className="mt-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/mydecks")}
          >
            Go Back
          </Button>
          <Typography variant="h4" gutterBottom>
            Deck {deckId}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddModalOpen(true)}
          >
            Add Flashcard
          </Button>
        </div>

        {flashcards.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              No flashcards found for this deck.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setAddModalOpen(true)}
            >
              Create Your First Flashcard
            </Button>
          </Box>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards.map((flashcard) => (
                <Card key={flashcard.id} className="relative">
                  <CardContent>
                    <Typography variant="h6" className="mb-2">
                      {flashcard.front_text}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {flashcard.back_text}
                    </Typography>
                  </CardContent>
                  <div className="flex justify-between p-2">
                    <IconButton onClick={() => handleEdit(flashcard)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(flashcard.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Card>
              ))}
            </div>

            {/* Start Studying Button */}
            <div className="flex justify-center mt-6">
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate(`/study/${deckId}`)}
                disabled={flashcards.length === 0}
              >
                Start Studying
              </Button>
            </div>
          </>
        )}

        {/* Edit Flashcard Modal */}
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
              backgroundColor: "#0a192f",
              color: "white",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Edit Flashcard
            </Typography>
            <TextField
              label="Question"
              value={selectedFlashcard?.front_text || ""}
              onChange={(e) =>
                setSelectedFlashcard({
                  ...selectedFlashcard,
                  front_text: e.target.value,
                })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Answer"
              value={selectedFlashcard?.back_text || ""}
              onChange={(e) =>
                setSelectedFlashcard({
                  ...selectedFlashcard,
                  back_text: e.target.value,
                })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <div className="flex justify-between mt-2">
              <Button variant="contained" onClick={handleSaveEdit}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>

        {/* Add Flashcard Modal */}
        <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
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
              backgroundColor: "#0a192f",
              color: "white",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Add Flashcard
            </Typography>
            <TextField
              label="Question"
              value={newFlashcard.front_text}
              onChange={(e) =>
                setNewFlashcard({ ...newFlashcard, front_text: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Answer"
              value={newFlashcard.back_text}
              onChange={(e) =>
                setNewFlashcard({ ...newFlashcard, back_text: e.target.value })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <div className="flex justify-between mt-2">
              <Button variant="contained" onClick={handleAddFlashcard}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default DeckView;
