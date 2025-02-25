import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import NavBar from "./NavBar";

const MyDecks = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDescription, setDeckDescription] = useState("");
  const [deckSubject, setDeckSubject] = useState("");
  const [deckCategory, setDeckCategory] = useState("");
  const [deckDifficulty, setDeckDifficulty] = useState(3);

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

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
          setDecks(data);
        } else {
          console.error("Failed to fetch decks");
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
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
          subject: deckSubject, // ✅ Add this
          category: deckCategory, // ✅ Add this
          difficulty: deckDifficulty, // ✅ Add thi
        }),
      });

      if (response.ok) {
        const newDeck = await response.json();
        setDecks(
          editingDeck
            ? decks.map((d) => (d.id === newDeck.id ? newDeck : d))
            : [...decks, newDeck]
        );
        setShowModal(false);
        setEditingDeck(null);
        setDeckTitle("");
        setDeckDescription("");
        setDeckSubject(""); // ✅ Clear input fields
        setDeckCategory(""); // ✅ Clear input fields
        setDeckDifficulty(3); // ✅ Reset to default value
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

  return (
    <div className="p-6 max-w-4xl mx-auto shadow-md rounded-lg">
      <NavBar />
      <h2 className="text-2xl font-bold mb-4">My Decks</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Create New Deck
      </button>
      <ul className="mt-4">
        {decks.map((deck) => (
          <li key={deck.id} className="p-2 border-b flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">{deck.title}</h3>
              <p>{deck.description}</p>
            </div>
            <div>
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                onClick={() => {
                  setEditingDeck(deck);
                  setDeckTitle(deck.title);
                  setDeckDescription(deck.description);
                  setShowModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDeleteDeck(deck.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-4 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-2">
              {editingDeck ? "Edit Deck" : "Create New Deck"}
            </h2>
            <input
              className="border text-blue-400 p-2 w-full mb-2"
              placeholder="Deck Title"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
            />
            <textarea
              className="border text-blue-400 p-2 w-full mb-2"
              placeholder="Deck Description"
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
            />
            <input
              className="border text-blue-400 p-2 w-full mb-2"
              placeholder="Subject"
              value={deckSubject}
              onChange={(e) => setDeckSubject(e.target.value)}
            />
            <input
              className="border text-blue-400 p-2 w-full mb-2"
              placeholder="Category"
              value={deckCategory}
              onChange={(e) => setDeckCategory(e.target.value)}
            />
            <input
              type="number"
              className="border text-blue-400 p-2 w-full mb-2"
              placeholder="Difficulty (1-5)"
              value={deckDifficulty}
              min="1"
              max="5"
              onChange={(e) =>
                setDeckDifficulty(
                  Math.min(5, Math.max(1, Number(e.target.value)))
                )
              }
            />
            <div className="flex justify-end">
              <button
                className="bg-green-500 px-4 py-2 rounded mr-2"
                onClick={handleCreateOrUpdateDeck}
              >
                Save
              </button>
              <button
                className="bg-gray-500 px-4 py-2 rounded"
                onClick={() => {
                  setShowModal(false);
                  setEditingDeck(null);
                  setDeckTitle("");
                  setDeckDescription("");
                  setDeckSubject("");
                  setDeckCategory("");
                  setDeckDifficulty(3);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDecks;
