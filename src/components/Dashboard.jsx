import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
        navigate("/login"); // Redirect if not logged in
      return;
    }

    fetch("http://localhost:5000/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach token
      },
    })
      .then((res) => {
        console.log("Response received:",res)
        return res.json()
      })
      .then((data) => {
        console.log(data)
        setUser(data.username)
      })
      .catch(() => {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token]);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? <p>Welcome, {user}!</p> : <p>Loading...</p>}
    </div>
  );
};

export default Dashboard;
