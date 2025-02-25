import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import NavBar from "./NavBar";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  Button,
  Modal,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const MyDecks = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]); // Default to an empty array
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckSubject, setDeckSubject] = useState("");
  const [deckCategory, setDeckCategory] = useState("");
  const [deckDifficulty, setDeckDifficulty] = useState(3);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchDecks = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/decks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data); // Debugging: Log the API response

          // Ensure the response is an array
          if (Array.isArray(data)) {
            setDecks(data);
          } else {
            console.error("API response is not an array:", data);
            setDecks([]); // Set decks to an empty array if the response is invalid
          }
        } else {
          console.error("Failed to fetch decks");
          setDecks([]); // Set decks to an empty array if the request fails
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
        setDecks([]); // Set decks to an empty array if there's an error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchDecks();
  }, [user]);

  const handleCreateOrUpdateDeck = async () => {
    const token = localStorage.getItem("authToken");
    const method = editingDeck ? "PUT" : "POST";
    const url = editingDeck
      ? `${API_URL}/decks/${editingDeck.id}`
      : `${API_URL}/decks`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: deckTitle,
          description: deckDescription,
          subject: deckSubject,
          category: deckCategory,
          difficulty: deckDifficulty,
        }),
      });

      if (response.ok) {
        const newDeck = await response.json();
        setDecks(
          editingDeck
            ? decks.map((d) => (d.id === newDeck.id ? newDeck : d))
            : [...decks, newDeck]
        );
        setModalOpen(false);
        setEditingDeck(null);
        setDeckTitle("");
        setDeckDescription("");
        setDeckSubject("");
        setDeckCategory("");
        setDeckDifficulty(3);
      } else {
        console.error("Failed to save deck");
      }
    } catch (error) {
      console.error("Error saving deck:", error);
    }
  };

  const handleDeleteDeck = async (deckId) => {
    const token = localStorage.getItem("authToken");
    if (!window.confirm("Are you sure you want to delete this deck?")) return;

    try {
      const response = await fetch(`${API_URL}/decks/${deckId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setDecks(decks.filter((deck) => deck.id !== deckId));
      } else {
        console.error("Failed to delete deck");
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  if (userLoading || loading) {
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
    <div>
      <NavBar />
      <div className="mt-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h4" gutterBottom>
            My Decks
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Create New Deck
          </Button>
        </div>

        {decks.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No decks found. Create a new deck to get started!
          </Typography>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decks.map((deck) => (
              <Card key={deck.id}>
                <CardActionArea onClick={() => navigate(`/mydecks/${deck.id}`)}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {deck.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {deck.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <div className="flex justify-between p-2">
                  <div>
                    <IconButton
                      onClick={() => {
                        setEditingDeck(deck);
                        setDeckTitle(deck.title);
                        setDeckDescription(deck.description);
                        setDeckSubject(deck.subject);
                        setDeckCategory(deck.category);
                        setDeckDifficulty(deck.difficulty);
                        setModalOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteDeck(deck.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <IconButton onClick={() => navigate(`/mydecks/${deck.id}`)}>
                    <VisibilityIcon />
                  </IconButton>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Deck Modal */}
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
              {editingDeck ? "Edit Deck" : "Create New Deck"}
            </Typography>
            <TextField
              label="Deck Title"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Deck Description"
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Subject"
              value={deckSubject}
              onChange={(e) => setDeckSubject(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Category"
              value={deckCategory}
              onChange={(e) => setDeckCategory(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              type="number"
              label="Difficulty (1-5)"
              value={deckDifficulty}
              onChange={(e) =>
                setDeckDifficulty(
                  Math.min(5, Math.max(1, Number(e.target.value)))
                )
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <div className="flex justify-between mt-2">
              <Button variant="contained" onClick={handleCreateOrUpdateDeck}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default MyDecks;
