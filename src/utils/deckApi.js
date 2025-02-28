const API_URL = "http://localhost:5000";

export const fetchDeckAndFlashcards = async (deckId) => {
  const token = localStorage.getItem("authToken");
  // Check if deckId is valid
  if (!deckId) {
    throw new Error("Deck ID is required");
  }

  const deckResponse = await fetch(`${API_URL}/decks/${deckId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!deckResponse.ok) throw new Error("Failed to fetch deck details");
  const deckData = await deckResponse.json();

  const cardsResponse = await fetch(`${API_URL}/flashcards`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!cardsResponse.ok) throw new Error("Failed to fetch flashcards");
  const cardsData = await cardsResponse.json();
  const flashcardsData = cardsData.filter(
    (card) => card.deck_id === Number.parseInt(deckId)
  );

  return { deckData, flashcardsData };
};

export const addFlashcard = async (deckId, newFlashcard) => {
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

  if (!response.ok) throw new Error("Failed to add flashcard");
  return response.json();
};

export const updateFlashcard = async (flashcard) => {
  const token = localStorage.getItem("authToken");
  console.log(flashcard);
  const response = await fetch(`${API_URL}/flashcards/${flashcard.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      front_text: flashcard.front_text,
      back_text: flashcard.back_text,
    }),
  });

  if (!response.ok) throw new Error("Failed to update flashcard");
  console.log(response);
  return response.json();
};

export const deleteFlashcard = async (flashcardId) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/flashcards/${flashcardId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete flashcard");
};

export const createOrUpdateDeck = async (deck, isEditing) => {
  const token = localStorage.getItem("authToken");
  const method = isEditing ? "PUT" : "POST";
  const url = isEditing ? `${API_URL}/decks/${deck.id}` : `${API_URL}/decks`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(deck),
  });

  if (!response.ok) throw new Error("Failed to save deck");
  return response.json();
};

// Add this function if it's not already present
export const fetchDecks = async () => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/decks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch decks");
  return response.json();
};

// Add this function if it's not already present
export const deleteDeck = async (deckId) => {
  const token = localStorage.getItem("authToken");
  console.log("this is the deck Id", deckId);
  const response = await fetch(`${API_URL}/decks/${deckId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete deck");
};
