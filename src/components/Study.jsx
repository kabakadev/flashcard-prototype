import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import NavBar from "./NavBar";

const API_URL = "http://localhost:5000";

const Study = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [studyProgress, setStudyProgress] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [newWeeklyGoal, setNewWeeklyGoal] = useState(weeklyGoal);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchDecks = async () => {
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

  const handleUpdateWeeklyGoal = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_URL}/user/stats`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ weekly_goal: newWeeklyGoal }),
      });

      if (response.ok) {
        const data = await response.json();
        setWeeklyGoal(data.weekly_goal);
        setModalOpen(false);
      } else {
        console.error("Failed to update weekly goal");
      }
    } catch (error) {
      console.error("Error updating weekly goal:", error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <div>
      <NavBar />
      <div className="mt-4 p-4">
        <Typography variant="h4" gutterBottom>
          Study
        </Typography>

        {/* Weekly Goal Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Weekly Goal: {weeklyGoal} flashcards
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(studyProgress.length / weeklyGoal) * 100}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setModalOpen(true)}
            sx={{ mt: 2 }}
          >
            Update Weekly Goal
          </Button>
        </Box>

        {/* Deck Selection Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Choose a Deck to Study
          </Typography>
          <Grid container spacing={3}>
            {decks.map((deck) => (
              <Grid item xs={12} sm={6} md={4} key={deck.id}>
                <Card onClick={() => navigate(`/study/${deck.id}`)}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {deck.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {deck.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Update Weekly Goal Modal */}
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
            }}
          >
            <Typography variant="h6" gutterBottom>
              Update Weekly Goal
            </Typography>
            <TextField
              label="New Weekly Goal"
              type="number"
              value={newWeeklyGoal}
              onChange={(e) => setNewWeeklyGoal(Number(e.target.value))}
              fullWidth
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateWeeklyGoal}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => setModalOpen(false)}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Study;
