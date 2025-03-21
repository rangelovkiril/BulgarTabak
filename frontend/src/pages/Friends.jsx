import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import "../styles/friends.css"; // This import should now work
import ChatModal from "../components/chat/ChatModal";

const Friends = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [activeChatFriend, setActiveChatFriend] = useState(null);

  useEffect(() => {
    const savedFriends = JSON.parse(localStorage.getItem("friends") || "[]");
    setFriends(savedFriends);
  }, []);

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      const newFriend = {
        id: Date.now(),
        name: newFriendName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newFriendName}`,
        joinedDate: new Date().toISOString(),
      };

      const updatedFriends = [...friends, newFriend];
      localStorage.setItem("friends", JSON.stringify(updatedFriends));
      setFriends(updatedFriends);
      setNewFriendName("");
      setIsAddingFriend(false);
    }
  };

  const handleViewProfile = (friendId) => {
    const friend = friends.find((f) => f.id === friendId);
    if (friend) {
      // Store selected friend in localStorage for profile page
      localStorage.setItem("selectedFriend", JSON.stringify(friend));
      navigate(`/profile/${friendId}`);
    }
  };

  const handleMessage = (friendId) => {
    const friend = friends.find((f) => f.id === friendId);
    if (friend) {
      setActiveChatFriend(friend);
    }
  };

  const handleRemoveFriend = (e, friendId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to remove this friend?")) {
      const updatedFriends = friends.filter((f) => f.id !== friendId);
      localStorage.setItem("friends", JSON.stringify(updatedFriends));
      setFriends(updatedFriends);
    }
  };

  return (
    <div className="friends-container">
      <Header />
      <div className="friends-content">
        <div className="friends-header">
          <div className="glass-panel">
            <h1>Your Friends</h1>
            <p>{friends.length} friends connected</p>
          </div>
        </div>

        <div className="friends-grid">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-card">
              <div className="friend-card-inner">
                <div className="friend-info">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="friend-avatar"
                  />
                  <h3>{friend.name}</h3>
                  <p>
                    Joined {new Date(friend.joinedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="friend-actions">
                  <button
                    className="view-profile-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleViewProfile(friend.id);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="message-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMessage(friend.id);
                    }}
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            className="add-friend-card"
            onClick={() => setIsAddingFriend(true)}
          >
            <div className="add-friend-content">
              <span className="add-icon">+</span>
              <span>Add Friend</span>
            </div>
          </button>
        </div>
      </div>

      {isAddingFriend && (
        <div className="modal-overlay">
          <div className="add-friend-modal">
            <h2>Add New Friend</h2>
            <input
              type="text"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="Enter friend's name"
              className="friend-input"
            />
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setIsAddingFriend(false)}
              >
                Cancel
              </button>
              <button className="add-btn" onClick={handleAddFriend}>
                Add Friend
              </button>
            </div>
          </div>
        </div>
      )}

      {activeChatFriend && (
        <ChatModal
          friend={activeChatFriend}
          onClose={() => setActiveChatFriend(null)}
        />
      )}
    </div>
  );
};

export default Friends;
