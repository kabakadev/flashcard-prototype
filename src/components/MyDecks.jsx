"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Brain,
  GraduationCap,
  PlayCircle,
} from "lucide-react";
import NavBar from "./NavBar";

const MyDecks = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [decks, setDecks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckSubject, setDeckSubject] = useState("");
  const [deckCategory, setDeckCategory] = useState("");
  const [deckDifficulty, setDeckDifficulty] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000";

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
    const fetchDecks = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/decks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setDecks(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch decks");
          setError("Failed to load decks. Please try again later.");
          setDecks([]);
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
        setError("An error occurred while loading decks.");
        setDecks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [user]);

  const handleCreateOrUpdateDeck = async () => {
    if (!deckTitle.trim()) {
      setError("Deck title is required");
      return;
    }

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
        handleCloseModal();
      } else {
        setError("Failed to save deck. Please try again.");
      }
    } catch (error) {
      console.error("Error saving deck:", error);
      setError("An error occurred while saving the deck.");
    }
  };

  const handleDeleteDeck = async (deckId, event) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this deck?")) return;

    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_URL}/decks/${deckId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setDecks(decks.filter((deck) => deck.id !== deckId));
      } else {
        setError("Failed to delete deck. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting deck:", error);
      setError("An error occurred while deleting the deck.");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDeck(null);
    setDeckTitle("");
    setDeckDescription("");
    setDeckSubject("");
    setDeckCategory("");
    setDeckDifficulty(3);
    setError("");
  };

  const handleEditDeck = (deck, event) => {
    event.stopPropagation();
    setEditingDeck(deck);
    setDeckTitle(deck.title);
    setDeckDescription(deck.description);
    setDeckSubject(deck.subject);
    setDeckCategory(deck.category);
    setDeckDifficulty(deck.difficulty);
    setModalOpen(true);
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
          Loading your decks...
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BookOpen size={32} />
                My Flashcard Decks
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setModalOpen(true)}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  borderRadius: 2,
                }}
              >
                Create New Deck
              </Button>
            </Box>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              Manage your flashcard decks and track your learning progress
            </Typography>
          </Box>
        </motion.div>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Decks Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {decks.length === 0 ? (
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                p: 6,
                textAlign: "center",
                bgcolor: "background.paper",
              }}
            >
              <GraduationCap
                size={48}
                color={theme.palette.primary.main}
                style={{ marginBottom: 16 }}
              />
              <Typography
                variant="h5"
                sx={{ color: "text.primary", mb: 2, fontWeight: "bold" }}
              >
                Start Your Learning Journey
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mb: 4 }}
              >
                Create your first flashcard deck and begin mastering new
                subjects.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={() => setModalOpen(true)}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  borderRadius: 2,
                }}
              >
                Create Your First Deck
              </Button>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {decks.map((deck) => (
                <Grid item xs={12} sm={6} md={4} key={deck.id}>
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
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        },
                      }}
                      onClick={() => navigate(`/mydecks/${deck.id}`)}
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
                          sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: "text.primary",
                              mb: 1,
                            }}
                          >
                            {deck.title}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
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
                              {deck.subject || "No Subject"}
                            </Typography>
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
                              Difficulty: {deck.difficulty}/5
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ p: 3, flexGrow: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", mb: 3 }}
                          >
                            {deck.description || "No description available."}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {deck.card_count || 0} cards
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              Last studied: {deck.last_studied || "Never"}
                            </Typography>
                          </Box>
                          {deck.mastery !== undefined && (
                            <Box sx={{ mb: 2 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{ color: "text.secondary" }}
                                >
                                  Mastery
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "text.primary",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {deck.mastery}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={deck.mastery}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(255,255,255,0.1)"
                                      : "rgba(0,0,0,0.1)",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor: "primary.main",
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                          )}
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
                            <IconButton
                              size="small"
                              onClick={(e) => handleEditDeck(deck, e)}
                              sx={{
                                mr: 1,
                                color: "text.secondary",
                                "&:hover": { color: "primary.main" },
                              }}
                            >
                              <Pencil size={18} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => handleDeleteDeck(deck.id, e)}
                              sx={{
                                color: "error.main",
                                "&:hover": { color: "error.dark" },
                              }}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </Box>
                          <Button
                            variant="contained"
                            startIcon={<PlayCircle size={18} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/study/${deck.id}`);
                            }}
                            sx={{
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              "&:hover": {
                                bgcolor: "primary.dark",
                              },
                              borderRadius: 2,
                            }}
                          >
                            Study Now
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>

        {/* Create/Edit Deck Modal */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="deck-modal-title"
          aria-describedby="deck-modal-description"
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
              id="deck-modal-title"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              {editingDeck ? "Edit Deck" : "Create New Deck"}
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

            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                label="Deck Title"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                fullWidth
                required
                error={!deckTitle.trim()}
                helperText={!deckTitle.trim() && "Title is required"}
              />

              <TextField
                label="Description"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Subject"
                    value={deckSubject}
                    onChange={(e) => setDeckSubject(e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    value={deckCategory}
                    onChange={(e) => setDeckCategory(e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={deckDifficulty}
                  onChange={(e) => setDeckDifficulty(Number(e.target.value))}
                  label="Difficulty Level"
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <MenuItem key={level} value={level}>
                      {level} -{" "}
                      {level === 1
                        ? "Beginner"
                        : level === 5
                        ? "Expert"
                        : `Level ${level}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleCreateOrUpdateDeck}
                  sx={{
                    flex: 1,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  {editingDeck ? "Save Changes" : "Create Deck"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
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
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default MyDecks;
