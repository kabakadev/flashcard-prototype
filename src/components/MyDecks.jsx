"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { Box, Container, Grid, useTheme, Alert } from "@mui/material";
import { motion } from "framer-motion";
import NavBar from "./NavBar";
import LoadingState from "./Dashboard/LoadingState";
import EmptyState from "./MyDecks/EmptyState";
import DeckCard from "./MyDecks/DeckCard";
import DeckModal from "./MyDecks/DeckModal";
import { fetchDecks, createOrUpdateDeck, deleteDeck } from "../utils/deckApi";
import Header from "./MyDecks/Header"; // Add this import

const MyDecks = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
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

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const loadDecks = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("authToken");
        const fetchedDecks = await fetchDecks(token);
        setDecks(fetchedDecks);
      } catch (error) {
        console.error("Error fetching decks:", error);
        setError("An error occurred while loading decks.");
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, [user]);

  const handleCreateOrUpdateDeck = async () => {
    if (!deckTitle.trim()) {
      setError("Deck title is required");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const updatedDeck = await createOrUpdateDeck(
        token,
        {
          id: editingDeck?.id,
          title: deckTitle,
          description: deckDescription,
          subject: deckSubject,
          category: deckCategory,
          difficulty: deckDifficulty,
        },
        !!editingDeck
      );

      setDecks(
        editingDeck
          ? decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d))
          : [...decks, updatedDeck]
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error saving deck:", error);
      setError("An error occurred while saving the deck.");
    }
  };

  const handleDeleteDeck = async (event, deckId) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this deck?")) return;

    try {
      const token = localStorage.getItem("authToken");
      await deleteDeck(token, deckId);
      setDecks(decks.filter((deck) => deck.id !== deckId));
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

  const handleEditDeck = (event, deck) => {
    event.stopPropagation();
    setEditingDeck(deck);
    setDeckTitle(deck.title);
    setDeckDescription(deck.description);
    setDeckSubject(deck.subject);
    setDeckCategory(deck.category);
    setDeckDifficulty(deck.difficulty);
    setModalOpen(true);
  };

  const handleStudyDeck = (event, deckId) => {
    event.stopPropagation();
    navigate(`/study/${deckId}`);
  };

  if (userLoading || loading) {
    return <LoadingState theme={theme} />;
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Header onCreateDeck={() => setModalOpen(true)} />

        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {decks.length === 0 ? (
            <EmptyState theme={theme} onCreateDeck={() => setModalOpen(true)} />
          ) : (
            <Grid container spacing={3}>
              {decks.map((deck) => (
                <Grid item xs={12} sm={6} md={4} key={deck.id}>
                  <DeckCard
                    deck={deck}
                    theme={theme}
                    onEdit={handleEditDeck}
                    onDelete={handleDeleteDeck}
                    onStudy={handleStudyDeck}
                    navigate={navigate}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </motion.div>

        <DeckModal
          open={modalOpen}
          onClose={handleCloseModal}
          editingDeck={editingDeck}
          deckTitle={deckTitle}
          setDeckTitle={setDeckTitle}
          deckDescription={deckDescription}
          setDeckDescription={setDeckDescription}
          deckSubject={deckSubject}
          setDeckSubject={setDeckSubject}
          deckCategory={deckCategory}
          setDeckCategory={setDeckCategory}
          deckDifficulty={deckDifficulty}
          setDeckDifficulty={setDeckDifficulty}
          error={error}
          onSave={handleCreateOrUpdateDeck}
        />
      </Container>
    </Box>
  );
};

export default MyDecks;
