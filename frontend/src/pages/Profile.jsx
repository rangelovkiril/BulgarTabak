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
    points: 0,
    streak: 0,
    habitsCompleted: 0,
    joinedDate: new Date().toISOString(),
    isEditing: false,
  });
  const [viewingFriend, setViewingFriend] = useState(null);
  const [showChat, setShowChat] = useState(false);

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

  return (
    <div className="profile-container">
      <Header />
      <div className="profile-content">
        <div className="profile-box">
          <div className="profile-image-container">
            {viewingFriend ? (
              <img
                src={viewingFriend.avatar}
                alt={viewingFriend.name}
                className="profile-image"
              />
            ) : (
              <div className="default-avatar" />
            )}
          </div>

          <div className="profile-info">
            {viewingFriend ? (
              // Friend's profile view
              <>
                <div className="username-display">
                  <h1>{viewingFriend.name}</h1>
                </div>
                <p className="joined-date">
                  Joined{" "}
                  {new Date(viewingFriend.joinedDate).toLocaleDateString()}
                </p>
                <div className="friend-actions">
                  <button className="message-btn" onClick={handleMessage}>
                    Message
                  </button>
                  <button
                    className="remove-friend-btn"
                    onClick={handleRemoveFriend}
                  >
                    Remove Friend
                  </button>
                </div>
              </>
            ) : (
              // User's own profile view
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
              </>
            )}
          </div>
        </div>

        <div className="stats-box">
          <div className="stat-item">
            <h3>Points</h3>
            <p>{userData.points}</p>
          </div>
          <div className="stat-item">
            <h3>Current Streak</h3>
            <p>{userData.streak} days</p>
          </div>
          <div className="stat-item">
            <h3>Habits Completed</h3>
            <p>{userData.habitsCompleted}</p>
          </div>
        </div>

        {!viewingFriend && (
          <button
            onClick={() => navigate("/select-habits")}
            className="edit-habits-button"
          >
            Edit Habits
          </button>
        )}
      </div>

      {showChat && viewingFriend && (
        <ChatModal friend={viewingFriend} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default Profile;
