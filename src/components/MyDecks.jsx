"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import {
  Box,
  Container,
  Grid,
  useTheme,
  Alert,
  CircularProgress,
} from "@mui/material";
import NavBar from "./NavBar";

import EmptyState from "./MyDecks/EmptyState";
import DeckCard from "./MyDecks/DeckCard";
import DeckModal from "./MyDecks/DeckModal";
import FilterSort from "./MyDecks/FilterSort";
import { fetchDecks, createOrUpdateDeck, deleteDeck } from "../utils/deckApi";
import Header from "./MyDecks/Header";

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

  // New state for filtering and sorting
  const [filter, setFilter] = useState({
    subject: "",
    category: "",
    difficulty: "",
    search: "",
  });
  const [sortBy, setSortBy] = useState("title");

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
        setDecks(Array.isArray(fetchedDecks) ? fetchedDecks : []); // Ensure decks is always an array
      } catch (error) {
        console.error("Error fetching decks:", error);
        setError("An error occurred while loading decks.");
        setDecks([]); // Set decks to an empty array if there's an error
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, [user]);

  const handleCreateOrUpdateDeck = useCallback(async () => {
    if (!deckTitle.trim()) {
      setError("Deck title is required");
      return;
    }

    try {
      const updatedDeck = await createOrUpdateDeck(
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

      setDecks((prevDecks) =>
        editingDeck
          ? prevDecks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d))
          : [...prevDecks, updatedDeck]
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error saving deck:", error);
      setError("An error occurred while saving the deck.");
    }
  }, [
    deckTitle,
    deckDescription,
    deckSubject,
    deckCategory,
    deckDifficulty,
    editingDeck,
  ]);

  const handleDeleteDeck = useCallback(async (event, deckId) => {
    event.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this deck?")) return;

    try {
      await deleteDeck(deckId);
      setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
    } catch (error) {
      console.error("Error deleting deck:", error);
      setError("An error occurred while deleting the deck.");
    }
  }, []);

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

  const handleEditDeck = useCallback((event, deck) => {
    event.stopPropagation();
    setEditingDeck(deck);
    setDeckTitle(deck.title);
    setDeckDescription(deck.description);
    setDeckSubject(deck.subject);
    setDeckCategory(deck.category);
    setDeckDifficulty(deck.difficulty);
    setModalOpen(true);
  }, []);

  const handleStudyDeck = useCallback(
    (event, deckId) => {
      event.stopPropagation();
      navigate(`/study/${deckId}`);
    },
    [navigate]
  );

  // Memoized filtered and sorted decks
  const filteredAndSortedDecks = useMemo(() => {
    if (!Array.isArray(decks)) return [];

    // Create a filtered array first to avoid multiple iterations
    const filtered = decks.filter((deck) => {
      // Short-circuit evaluation for better performance
      if (filter.subject && deck.subject !== filter.subject) return false;
      if (filter.category && deck.category !== filter.category) return false;
      if (filter.difficulty && deck.difficulty !== Number(filter.difficulty))
        return false;
      if (
        filter.search &&
        !deck.title.toLowerCase().includes(filter.search.toLowerCase())
      )
        return false;
      return true;
    });

    // Only sort after filtering to reduce the number of comparisons
    if (sortBy === "title") {
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "lastStudied") {
      return filtered.sort((a, b) => {
        // Handle null or undefined dates
        if (!a.last_studied) return 1;
        if (!b.last_studied) return -1;
        return new Date(b.last_studied) - new Date(a.last_studied);
      });
    } else if (sortBy === "difficulty") {
      return filtered.sort((a, b) => a.difficulty - b.difficulty);
    }
    return filtered;
  }, [
    decks,
    filter.subject,
    filter.category,
    filter.difficulty,
    filter.search,
    sortBy,
  ]);

  // Extract unique subjects and categories for filter options
  const subjects = useMemo(
    () => [...new Set(decks.map((deck) => deck.subject))],
    [decks]
  );
  const categories = useMemo(
    () => [...new Set(decks.map((deck) => deck.category))],
    [decks]
  );

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
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Header onCreateDeck={() => setModalOpen(true)} />

        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <FilterSort
          subjects={subjects}
          categories={categories}
          filter={filter}
          setFilter={setFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div>
          {filteredAndSortedDecks.length === 0 ? (
            <EmptyState theme={theme} onCreateDeck={() => setModalOpen(true)} />
          ) : (
            <Grid container spacing={3}>
              {filteredAndSortedDecks.map((deck) => (
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
        </div>

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
