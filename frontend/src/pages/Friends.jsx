import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import "../styles/friends.css"; // This import should now work

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);

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
    // For now just show an alert, later can navigate to profile page
    alert("Profile view coming soon!");
  };

  const handleMessage = (friendId) => {
    // For now just show an alert, later can open chat
    alert("Chat feature coming soon!");
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
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="friend-avatar"
                />
                <h3>{friend.name}</h3>
                <p>Joined {new Date(friend.joinedDate).toLocaleDateString()}</p>
                <div className="friend-actions">
                  <button
                    className="view-profile-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(friend.id);
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="message-btn"
                    onClick={(e) => {
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
    </div>
  );
};

export default Friends;
