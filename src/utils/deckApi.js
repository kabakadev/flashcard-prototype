const API_URL = "http://localhost:5000";

export const fetchDecks = async (token) => {
  const response = await fetch(`${API_URL}/decks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch decks");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createOrUpdateDeck = async (token, deck, isEditing) => {
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

export const deleteDeck = async (token, deckId) => {
  const response = await fetch(`${API_URL}/decks/${deckId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete deck");
};
