import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import NavBar from "./NavBar";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  TrendingUp,
  LibraryBooks,
  EmojiEvents,
  Timer,
  School,
  Star,
  BarChart,
} from "@mui/icons-material";

const Dashboard = () => {
  const { user, isAuthenticated, loading, logout } = useUser();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading || !dashboardData) return <Typography>Loading...</Typography>;

  return (
    <div>
      <NavBar />
      <div className="mt-4 p-4">
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Welcome, {user?.username}!
        </Typography>

        {/* User Statistics Section */}
        <Grid container spacing={3} className="mt-4">
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TrendingUp sx={{ verticalAlign: "middle", mr: 1 }} />
                  Study Progress
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    Total Flashcards Studied:{" "}
                    {dashboardData.total_flashcards_studied}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={dashboardData.total_flashcards_studied}
                    sx={{ height: 10, borderRadius: 5, mt: 1 }}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    Weekly Goal: {dashboardData.weekly_goal} flashcards
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (dashboardData.total_flashcards_studied /
                        dashboardData.weekly_goal) *
                      100
                    }
                    sx={{ height: 10, borderRadius: 5, mt: 1 }}
                  />
                </Box>
                <Typography variant="body1">
                  Study Streak: {dashboardData.study_streak} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <EmojiEvents sx={{ verticalAlign: "middle", mr: 1 }} />
                  Achievements
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">
                  Mastery Level: {dashboardData.mastery_level}
                </Typography>
                <Typography variant="body1">
                  Cards Mastered: {dashboardData.cards_mastered}
                </Typography>
                <Typography variant="body1">
                  Retention Rate: {dashboardData.retention_rate}%
                </Typography>
                <Typography variant="body1">
                  Focus Score: {dashboardData.focus_score}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Timer sx={{ verticalAlign: "middle", mr: 1 }} />
                  Study Habits
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1">
                  Minutes Studied per Day: {dashboardData.minutes_per_day} mins
                </Typography>
                <Typography variant="body1">
                  Most Reviewed Deck:{" "}
                  {dashboardData.most_reviewed_deck || "None"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User Decks Section */}
        <Typography variant="h5" gutterBottom className="mt-6">
          <LibraryBooks sx={{ verticalAlign: "middle", mr: 1 }} />
          Your Decks
        </Typography>
        <Grid container spacing={3}>
          {dashboardData.decks?.length > 0 ? (
            dashboardData.decks.map((deck) => (
              <Grid item xs={12} sm={6} md={4} key={deck.deck_id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {deck.deck_title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {deck.deck_description || "No description available."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1">No decks available.</Typography>
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
