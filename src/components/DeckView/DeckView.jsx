"use client";

import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { Box, Container, useTheme, Alert } from "@mui/material";
import NavBar from "../NavBar";
import LoadingState from "./LoadingState";
import DeckHeader from "./DeckHeader";
import FlashcardList from "./FlashCardList";
import EditFlashcardModal from "./EditFlashcardModal";
import AddFlashcardModal from "./AddFlashcardModal";
import {
  fetchDeckAndFlashcards,
  addFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "../../utils/deckApi";

const DeckView = () => {
  const { user, isAuthenticated, loading: userLoading } = useUser();
  const { deckId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

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

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const loadDeckAndFlashcards = async () => {
      if (!user) return;
      try {
        const { deckData, flashcardsData } = await fetchDeckAndFlashcards(
          deckId
        );
        setDeck(deckData);
        setFlashcards(flashcardsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load deck data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDeckAndFlashcards();
  }, [deckId, user]);

  const handleAddFlashcard = async () => {
    try {
      const newCard = await addFlashcard(deckId, newFlashcard);
      setFlashcards([...flashcards, newCard]);
      setAddModalOpen(false);
      setNewFlashcard({ front_text: "", back_text: "" });
      setError("");
    } catch (error) {
      setError("Failed to add flashcard. Please try again.");
    }
  };

  const handleEditFlashcard = async () => {
    try {
      const updatedCard = await updateFlashcard(selectedFlashcard);
      setFlashcards(
        flashcards.map((card) =>
          card.id === updatedCard.id ? updatedCard : card
        )
      );
      setModalOpen(false);
      setError("");
    } catch (error) {
      setError("Failed to update flashcard. Please try again.");
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    try {
      await deleteFlashcard(flashcardId);
      setFlashcards(flashcards.filter((card) => card.id !== flashcardId));
    } catch (error) {
      setError("Failed to delete flashcard. Please try again.");
    }
  };

  if (userLoading || loading) {
    return <LoadingState theme={theme} />;
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <DeckHeader
          deck={deck}
          onAddFlashcard={() => setAddModalOpen(true)}
          navigate={navigate}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <FlashcardList
          flashcards={flashcards}
          onEdit={(flashcard) => {
            setSelectedFlashcard(flashcard);
            setModalOpen(true);
          }}
          onDelete={handleDeleteFlashcard}
          navigate={navigate}
          deckId={deckId}
        />

        <EditFlashcardModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setError("");
          }}
          flashcard={selectedFlashcard}
          onSave={handleEditFlashcard}
          error={error}
          setError={setError}
        />

        <AddFlashcardModal
          open={addModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            setError("");
          }}
          newFlashcard={newFlashcard}
          setNewFlashcard={setNewFlashcard}
          onSave={handleAddFlashcard}
          error={error}
          setError={setError}
        />
      </Container>
    </Box>
  );
};

export default DeckView;
