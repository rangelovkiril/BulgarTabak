import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import "../styles/leaderboard.css";

const calculateUserPoints = (userId) => {
  // Get user's habit completion data
  const habits = JSON.parse(localStorage.getItem(`habits_${userId}`) || "[]");
  const events = JSON.parse(localStorage.getItem("events") || "[]");
  
  let totalPoints = 0;

  // Points from completed events
  const completedEvents = events.filter(event => 
    event.userId === userId && 
    new Date(event.end) < new Date()
  );
  totalPoints += completedEvents.length * 10; // 10 points per completed event

  // Points from habit streaks
  habits.forEach(habit => {
    if (habit.streak) {
      // Bonus points for streaks
      totalPoints += habit.streak * 5; // 5 points per day of streak
    }
  });

  return totalPoints;
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const friends = JSON.parse(localStorage.getItem("friends") || "[]");
    
    // Calculate current user's points
    const user = {
      id: "current-user",
      name: "You",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=you`,
      points: calculateUserPoints("current-user"),
      joinedDate: new Date().toISOString(),
    };

    // Calculate friends' points
    const rankingsWithPoints = [
      user,
      ...friends.map((friend) => ({
        ...friend,
        points: calculateUserPoints(friend.id),
      })),
    ].sort((a, b) => b.points - a.points);

    setRankings(rankingsWithPoints);
  }, []);

  const handleUserClick = (userId) => {
    if (userId === "current-user") {
      navigate("/profile");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  const getRankLabel = (index) => {
    if (index === 0) return "1.";
    if (index === 1) return "2.";
    if (index === 2) return "3.";
    return index + 1;
  };

  return (
    <div className="leaderboard-container">
      <Header />
      <div className="leaderboard-content">
        <div className="leaderboard-header">
          <h1>Leaderboard</h1>
          <p>Compete with friends and track your progress</p>
        </div>

        <div className="rankings-container">
          {rankings.map((user, index) => (
            <div
              key={user.id}
              className={`ranking-card ${index < 3 ? "top-three" : ""}`}
              onClick={() => handleUserClick(user.id)}
            >
              <div className="rank-label">{getRankLabel(index)}</div>
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <div className="user-info">
                <h3>{user.name}</h3>
                <p className="points">{user.points} points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
