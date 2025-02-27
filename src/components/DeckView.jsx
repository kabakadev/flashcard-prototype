"use client";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Modal,
  TextField,
  IconButton,
  useTheme,
  Alert,
  Breadcrumbs,
  Link,
  Tooltip,
} from "@mui/material";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Brain,
  PlayCircle,
  ChevronRight,
  Repeat,
} from "lucide-react";
import NavBar from "./NavBar";

const API_URL = "http://localhost:5000";

const DeckView = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({
    front_text: "",
    back_text: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewSide, setPreviewSide] = useState({}); // Track which side is shown for each card

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchDeckAndFlashcards = async () => {
      if (!user) return;

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
        const cardsResponse = await fetch(`${API_URL}/flashcards`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cardsResponse.ok) throw new Error("Failed to fetch flashcards");
        const cardsData = await cardsResponse.json();
        const filteredCards = cardsData.filter(
          (card) => card.deck_id === Number.parseInt(deckId)
        );
        setFlashcards(filteredCards);

        // Initialize preview states
        const initialPreviewStates = {};
        filteredCards.forEach((card) => {
          initialPreviewStates[card.id] = "front";
        });
        setPreviewSide(initialPreviewStates);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load deck data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeckAndFlashcards();
  }, [deckId, user]);

  const handleEdit = (flashcard) => {
    setSelectedFlashcard(flashcard);
    setModalOpen(true);
  };

  const handleDelete = async (flashcardId) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?"))
      return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/flashcards/${flashcardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setFlashcards(flashcards.filter((card) => card.id !== flashcardId));
      } else {
        setError("Failed to delete flashcard. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      setError("An error occurred while deleting the flashcard.");
    }
  };

  const handleSaveEdit = async () => {
    if (
      !selectedFlashcard.front_text.trim() ||
      !selectedFlashcard.back_text.trim()
    ) {
      setError("Both question and answer are required.");
      return;
    }

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
        setError("");
      } else {
        setError("Failed to update flashcard. Please try again.");
      }
    } catch (error) {
      console.error("Error updating flashcard:", error);
      setError("An error occurred while updating the flashcard.");
    }
  };

  const handleAddFlashcard = async () => {
    if (!newFlashcard.front_text.trim() || !newFlashcard.back_text.trim()) {
      setError("Both question and answer are required.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deck_id: Number.parseInt(deckId),
          front_text: newFlashcard.front_text,
          back_text: newFlashcard.back_text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFlashcards([...flashcards, data]);
        setAddModalOpen(false);
        setNewFlashcard({ front_text: "", back_text: "" });
        setError("");
        setPreviewSide({ ...previewSide, [data.id]: "front" });
      } else {
        setError("Failed to add flashcard. Please try again.");
      }
    } catch (error) {
      console.error("Error adding flashcard:", error);
      setError("An error occurred while adding the flashcard.");
    }
  };

  const toggleCardSide = (cardId) => {
    setPreviewSide({
      ...previewSide,
      [cardId]: previewSide[cardId] === "front" ? "back" : "front",
    });
  };

  if (userLoading || loading) {
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
          <Brain size={40} color={theme.palette.primary.main} />
        </motion.div>
        <Typography variant="h6" color="text.secondary">
          Loading flashcards...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        pb: 8,
      }}
    >
      <NavBar />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs
              separator={<ChevronRight size={16} />}
              sx={{ mb: 2, color: "text.secondary" }}
            >
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/mydecks")}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "text.secondary",
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <BookOpen size={16} />
                My Decks
              </Link>
              <Typography color="text.primary">
                {deck?.title || `Deck ${deckId}`}
              </Typography>
            </Breadcrumbs>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
                >
                  {deck?.title || `Deck ${deckId}`}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {deck?.description || "No description available"}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setAddModalOpen(true)}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  borderRadius: 2,
                }}
              >
                Add Flashcard
              </Button>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}
          </Box>
        </motion.div>

        {/* Flashcards Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {flashcards.length === 0 ? (
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                p: 6,
                textAlign: "center",
                bgcolor: "background.paper",
              }}
            >
              <Brain
                size={48}
                color={theme.palette.primary.main}
                style={{ marginBottom: 16 }}
              />
              <Typography
                variant="h5"
                sx={{ color: "text.primary", mb: 2, fontWeight: "bold" }}
              >
                No Flashcards Yet
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 4 }}
              >
                Create your first flashcard and start learning!
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setAddModalOpen(true)}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  borderRadius: 2,
                }}
              >
                Create Your First Flashcard
              </Button>
            </Card>
          ) : (
            <>
              <Grid container spacing={3}>
                {flashcards.map((flashcard) => (
                  <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 0,
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              p: 3,
                              borderBottom: 1,
                              borderColor: "divider",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  bgcolor: "background.default",
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                }}
                              >
                                {previewSide[flashcard.id] === "front"
                                  ? "Question"
                                  : "Answer"}
                              </Typography>
                              <Tooltip title="Flip card">
                                <IconButton
                                  size="small"
                                  onClick={() => toggleCardSide(flashcard.id)}
                                  sx={{
                                    color: "primary.main",
                                    "&:hover": {
                                      bgcolor: "primary.main",
                                      color: "primary.contrastText",
                                    },
                                  }}
                                >
                                  <Repeat size={16} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{
                                color: "text.primary",
                                minHeight: "80px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {previewSide[flashcard.id] === "front"
                                ? flashcard.front_text
                                : flashcard.back_text}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              p: 2,
                              borderTop: 1,
                              borderColor: "divider",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Tooltip title="Edit flashcard">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEdit(flashcard)}
                                  sx={{
                                    mr: 1,
                                    color: "text.secondary",
                                    "&:hover": { color: "primary.main" },
                                  }}
                                >
                                  <Pencil size={18} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete flashcard">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(flashcard.id)}
                                  sx={{
                                    color: "error.main",
                                    "&:hover": { color: "error.dark" },
                                  }}
                                >
                                  <Trash2 size={18} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 6, textAlign: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayCircle size={20} />}
                  onClick={() => navigate(`/study/${deckId}`)}
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    px: 6,
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    borderRadius: 2,
                  }}
                >
                  Start Studying
                </Button>
              </Box>
            </>
          )}
        </motion.div>

        {/* Edit Flashcard Modal */}
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setError("");
          }}
          aria-labelledby="edit-flashcard-title"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 500 },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              p: 4,
            }}
          >
            <Typography
              variant="h5"
              id="edit-flashcard-title"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Edit Flashcard
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

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
              required
              error={!selectedFlashcard?.front_text.trim()}
              helperText={
                !selectedFlashcard?.front_text.trim() && "Question is required"
              }
              sx={{ mb: 3 }}
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
              required
              error={!selectedFlashcard?.back_text.trim()}
              helperText={
                !selectedFlashcard?.back_text.trim() && "Answer is required"
              }
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSaveEdit}
                sx={{
                  flex: 1,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setModalOpen(false);
                  setError("");
                }}
                sx={{
                  flex: 1,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "rgba(124, 58, 237, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Add Flashcard Modal */}
        <Modal
          open={addModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            setError("");
          }}
          aria-labelledby="add-flashcard-title"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 500 },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              p: 4,
            }}
          >
            <Typography
              variant="h5"
              id="add-flashcard-title"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Add New Flashcard
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <TextField
              label="Question"
              value={newFlashcard.front_text}
              onChange={(e) =>
                setNewFlashcard({ ...newFlashcard, front_text: e.target.value })
              }
              fullWidth
              required
              error={!newFlashcard.front_text.trim()}
              helperText={
                !newFlashcard.front_text.trim() && "Question is required"
              }
              sx={{ mb: 3 }}
            />

            <TextField
              label="Answer"
              value={newFlashcard.back_text}
              onChange={(e) =>
                setNewFlashcard({ ...newFlashcard, back_text: e.target.value })
              }
              fullWidth
              required
              error={!newFlashcard.back_text.trim()}
              helperText={
                !newFlashcard.back_text.trim() && "Answer is required"
              }
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleAddFlashcard}
                sx={{
                  flex: 1,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Add Flashcard
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setAddModalOpen(false);
                  setNewFlashcard({ front_text: "", back_text: "" });
                  setError("");
                }}
                sx={{
                  flex: 1,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "rgba(124, 58, 237, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default DeckView;
