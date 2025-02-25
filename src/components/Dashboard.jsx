import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import NavBar from "./NavBar";
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

  if (loading || !dashboardData) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto shadow-md rounded-lg">
      <NavBar />
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="text-lg">Welcome, {user?.username}!</p>

      {/* User Statistics Section */}
      <div className="mt-4 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Your Study Stats</h3>
        <p>
          Total Flashcards Studied: {dashboardData.total_flashcards_studied}
        </p>
        <p>Most Reviewed Deck: {dashboardData.most_reviewed_deck || "None"}</p>
        <p>Weekly Goal: {dashboardData.weekly_goal} flashcards</p>
        <p>Mastery Level: {dashboardData.mastery_level}</p>
        <p>Study Streak: {dashboardData.study_streak} days</p>
        <p>Focus Score: {dashboardData.focus_score}%</p>
        <p>Retention Rate: {dashboardData.retention_rate}%</p>
        <p>Cards Mastered: {dashboardData.cards_mastered}</p>
        <p>Minutes Studied per Day: {dashboardData.minutes_per_day} mins</p>
      </div>

      {/* User Decks Section */}
      <h3 className="text-xl font-semibold mt-6">Your Decks</h3>
      <ul className="mt-2">
        {dashboardData.decks?.length > 0 ? (
          dashboardData.decks.map((deck) => (
            <li key={deck.deck_id} className="p-2 border-b">
              {deck.deck_title}
            </li>
          ))
        ) : (
          <p>No decks available.</p>
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
