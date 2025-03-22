import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/common/Header";
import ChatModal from "../components/chat/ChatModal";
import "../styles/profile.css";

const FriendProfile = () => {
  const navigate = useNavigate();
  const { friendId } = useParams();
  const [friend, setFriend] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const friends = JSON.parse(localStorage.getItem("friends") || "[]");
    const foundFriend = friends.find((f) => f.id === Number(friendId));
    if (foundFriend) {
      setFriend(foundFriend);
    } else {
      navigate("/friends"); // Redirect if friend not found
    }
  }, [friendId, navigate]);

  const handleRemoveFriend = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const friends = JSON.parse(localStorage.getItem("friends") || "[]");
    const updatedFriends = friends.filter((f) => f.id !== Number(friendId));
    localStorage.setItem("friends", JSON.stringify(updatedFriends));
    navigate("/friends");
  };

  if (!friend) return null;

  return (
    <div className="profile-container">
      <Header />
      <div className="profile-content">
        <div className="profile-box">
          <div className="profile-image-container">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="profile-image"
            />
          </div>

          <div className="profile-info">
            <div className="profile-info-section">
              <div className="username-display">
                <h1>{friend?.name}</h1>
              </div>
              <p className="joined-date">
                Joined {new Date(friend?.joinedDate).toLocaleDateString()}
              </p>
            </div>

            <div className="friend-actions">
              <button className="message-btn" onClick={() => setShowChat(true)}>
                Message
              </button>
              <button
                className="remove-friend-btn"
                onClick={handleRemoveFriend}
              >
                Remove Friend
              </button>
            </div>
          </div>
        </div>

        {/* ... Rest of friend's stats and achievements ... */}
      </div>

      {showChat && (
        <ChatModal friend={friend} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default FriendProfile;
