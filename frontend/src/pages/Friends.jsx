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
  const [searchTerm, setSearchTerm] = useState("");

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
    navigate(`/friendProfile/${friendId}`); // Make sure this matches the route path
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="friends-container">
      <Header />
      <div className="friends-content">
        <div className="friends-header">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search friends..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="add-friend-btn"
            onClick={() => setIsAddingFriend(true)}
          >
            <span>+</span> Add Friend
          </button>
        </div>

        {filteredFriends.length > 0 ? (
          <div className="friends-grid">
            {filteredFriends.map((friend) => (
              <div
                key={friend.id}
                className="friend-card"
                onClick={() => handleViewProfile(friend.id)}
              >
                <div className="friend-header">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="friend-avatar"
                  />
                  <div className="friend-info">
                    <h3 className="friend-name">{friend.name}</h3>
                    <div className="friend-status">
                      <span className={`status-dot ${friend.status}`}></span>
                      <span>{friend.status}</span>
                    </div>
                  </div>
                </div>

                <div className="friend-stats">
                  <div className="stat">
                    <div className="stat-label">Current Streak</div>
                    <div className="stat-value">{friend.streak} days</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">Level</div>
                    <div className="stat-value">{friend.level}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h2>No friends found</h2>
            <p>Try adjusting your search or add some new friends!</p>
          </div>
        )}
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
