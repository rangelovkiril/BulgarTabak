import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import ChatModal from "../components/chat/ChatModal";
import "../styles/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { friendId } = useParams();
  const [userData, setUserData] = useState({
    username: "User123",
    title: "Habit Explorer",
    bio: "On a journey to build better habits",
    level: 5,
    points: 150,
    streak: 7,
    habitsCompleted: 25,
    joinedDate: new Date().toISOString(),
    status: "Online", // Online, Away, Offline
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isEditing: false,
    totalMinutesLogged: 1240,
    perfectDays: 3,
    longestStreak: 10,
  });
  const [viewingFriend, setViewingFriend] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(false);

  const achievements = [
    {
      id: 1,
      icon: "🌅",
      title: "Early Bird",
      description: "Complete 5 morning tasks",
      progress: 3,
      total: 5,
      unlocked: false,
    },
    {
      id: 2,
      icon: "⚡",
      title: "Streak Master",
      description: "7 day streak",
      progress: 7,
      total: 7,
      unlocked: true,
    },
    {
      id: 3,
      icon: "🎯",
      title: "Goal Setter",
      description: "Set 10 habits",
      progress: 8,
      total: 10,
      unlocked: false,
    },
    {
      id: 4,
      icon: "🌟",
      title: "Perfect Week",
      description: "Complete all habits for 7 days",
      progress: 5,
      total: 7,
      unlocked: false,
    },
    {
      id: 5,
      icon: "⏰",
      title: "Time Master",
      description: "Log 1000 minutes",
      progress: 1000,
      total: 1000,
      unlocked: true,
    },
    {
      id: 6,
      icon: "🎨",
      title: "Diverse Habits",
      description: "Try habits from 5 different categories",
      progress: 3,
      total: 5,
      unlocked: false,
    },
  ];

  const calculateProgress = (current, max) => (current / max) * 100;

  const generateAvatar = (username) => {
    // Use a more professional style for the avatar
    return `https://api.dicebear.com/7.x/personas/svg?seed=${username}&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear`;
  };

  const detailedStats = {
    daily: {
      averageCompletionRate: "85%",
      mostProductiveTime: "Morning",
      consistentHabits: ["Meditation", "Reading"],
    },
    weekly: {
      totalMinutesLogged: userData.totalMinutesLogged,
      perfectDays: userData.perfectDays,
      completedTasks: 28,
    },
    monthly: {
      longestStreak: userData.longestStreak,
      habitVariety: 6,
      totalPoints: userData.points,
    },
  };

  useEffect(() => {
    if (friendId) {
      // Load friend's profile
      const friends = JSON.parse(localStorage.getItem("friends") || "[]");
      const friend = friends.find((f) => f.id === Number(friendId));
      if (friend) {
        setViewingFriend(friend);
      }
    }
  }, [friendId]);

  const handleUsernameSubmit = () => {
    setUserData((prev) => ({ ...prev, isEditing: false }));
  };

  const handleRemoveFriend = () => {
    if (window.confirm("Are you sure you want to remove this friend?")) {
      const friends = JSON.parse(localStorage.getItem("friends") || "[]");
      const updatedFriends = friends.filter((f) => f.id !== Number(friendId));
      localStorage.setItem("friends", JSON.stringify(updatedFriends));
      navigate("/friends");
    }
  };

  const handleMessage = () => {
    if (viewingFriend) {
      setShowChat(true);
    }
  };

  const renderFriendActions = () => {
    if (!viewingFriend) return null;
    return (
      <div className="friend-actions">
        <button className="message-btn" onClick={handleMessage}>
          Message
        </button>
        <button className="remove-friend-btn" onClick={handleRemoveFriend}>
          Remove Friend
        </button>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <Header />
      <div className="profile-content">
        <div className="profile-box">
          <div className="profile-image-container">
            <img
              src={
                viewingFriend
                  ? viewingFriend.avatar
                  : generateAvatar(userData.username)
              }
              alt={viewingFriend ? viewingFriend.name : userData.username}
              className="profile-image"
            />
          </div>

          <div className="profile-info">
            <div className="profile-info-section">
              {viewingFriend ? (
                <div className="username-display">
                  <h1>{viewingFriend.name}</h1>
                </div>
              ) : (
                <>
                  {userData.isEditing ? (
                    <div className="edit-username">
                      <input
                        type="text"
                        value={userData.username}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="username-input"
                      />
                      <button
                        onClick={handleUsernameSubmit}
                        className="save-button"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="username-display">
                      <h1>{userData.username}</h1>
                      <button
                        onClick={() =>
                          setUserData((prev) => ({ ...prev, isEditing: true }))
                        }
                        className="edit-button"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  <div className="status-container">
                    <span
                      className={`status-indicator ${userData.status.toLowerCase()}`}
                    />
                    <span className="status-text">{userData.status}</span>
                  </div>
                </>
              )}
            </div>

            {!viewingFriend && (
              <>
                <div className="profile-info-section">
                  <span className="user-title">{userData.title}</span>
                  <p className="user-bio">{userData.bio}</p>
                </div>

                <div className="user-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span>{userData.timezone}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">⭐</span>
                    <span>Level {userData.level}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>
                      Joined{" "}
                      {new Date(userData.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          {renderFriendActions()}
        </div>

        <div className="stats-box">
          <div className="stat-item">
            <div
              className="progress-ring"
              style={{
                "--progress": `${calculateProgress(userData.points, 1000)}%`,
              }}
            ></div>
            <h3>Points</h3>
            <p>{userData.points}</p>
          </div>

          <div className="stat-item">
            <div
              className="progress-ring"
              style={{
                "--progress": `${calculateProgress(userData.streak, 30)}%`,
              }}
            ></div>
            <h3>Current Streak</h3>
            <p>{userData.streak}</p>
          </div>

          <div className="stat-item">
            <div
              className="progress-ring"
              style={{
                "--progress": `${calculateProgress(
                  userData.habitsCompleted,
                  50
                )}%`,
              }}
            ></div>
            <h3>Habits Completed</h3>
            <p>{userData.habitsCompleted}</p>
          </div>
        </div>

        <div className="achievements-section">
          <h2>Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${
                  achievement.unlocked ? "unlocked" : ""
                }`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                  <div className="achievement-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${
                          (achievement.progress / achievement.total) * 100
                        }%`,
                      }}
                    ></div>
                    <span>
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          {!viewingFriend && (
            <>
              <button
                onClick={() => navigate("/select-habits")}
                className="action-button edit-habits"
              >
                <span className="button-icon">✏️</span>
                Edit Habits
              </button>
              <button
                onClick={() => setShowDetailedStats(true)}
                className="action-button view-stats"
              >
                <span className="button-icon">📊</span>
                View Detailed Stats
              </button>
            </>
          )}
        </div>
      </div>

      {showDetailedStats && (
        <div
          className="stats-modal-overlay"
          onClick={() => setShowDetailedStats(false)}
        >
          <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setShowDetailedStats(false)}
            >
              ×
            </button>
            <h2>Detailed Statistics</h2>

            <div className="stats-sections">
              <div className="stats-section">
                <h3>Daily Overview</h3>
                <div className="stats-grid">
                  <div className="stat-detail">
                    <span className="stat-label">Completion Rate</span>
                    <span className="stat-value">
                      {detailedStats.daily.averageCompletionRate}
                    </span>
                  </div>
                  <div className="stat-detail">
                    <span className="stat-label">Peak Performance</span>
                    <span className="stat-value">
                      {detailedStats.daily.mostProductiveTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="stats-section">
                <h3>Weekly Progress</h3>
                <div className="stats-grid">
                  <div className="stat-detail">
                    <span className="stat-label">Time Logged</span>
                    <span className="stat-value">
                      {detailedStats.weekly.totalMinutesLogged} mins
                    </span>
                  </div>
                  <div className="stat-detail">
                    <span className="stat-label">Perfect Days</span>
                    <span className="stat-value">
                      {detailedStats.weekly.perfectDays}
                    </span>
                  </div>
                </div>
              </div>

              <div className="stats-section">
                <h3>Monthly Achievement</h3>
                <div className="stats-grid">
                  <div className="stat-detail">
                    <span className="stat-label">Longest Streak</span>
                    <span className="stat-value">
                      {detailedStats.monthly.longestStreak} days
                    </span>
                  </div>
                  <div className="stat-detail">
                    <span className="stat-label">Habit Variety</span>
                    <span className="stat-value">
                      {detailedStats.monthly.habitVariety} types
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showChat && viewingFriend && (
        <ChatModal friend={viewingFriend} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default Profile;
