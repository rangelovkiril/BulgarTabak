import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
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
    const loadFriends = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.log("No authenticated user");
          return;
        }

        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.log("No user document found");
          return;
        }

        const friendIds = userDocSnap.data().friends || [];
        if (friendIds.length === 0) {
          setFriends([]);
          return;
        }

        // Get friend details
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where(doc.id, 'in', friendIds));
        const querySnapshot = await getDocs(q);

        const friendsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().displayName || 'Unknown User',
          avatar: doc.data().photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
          level: Math.floor((doc.data().points || 0) / 100) + 1,
          streak: doc.data().currentStreak || 0,
          status: doc.data().status || 'offline'
        }));

        setFriends(friendsData);
      } catch (error) {
        console.error("Error loading friends:", error);
      }
    };

    loadFriends();
  }, []);

  const handleAddFriend = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !newFriendName.trim()) return;

      // Search for user by email or name
      const usersRef = collection(db, 'users');
      const q = query(usersRef, 
        where('displayName', '==', newFriendName.trim())
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const friendDoc = querySnapshot.docs[0];
        
        // Add to current user's friends list
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          friends: arrayUnion(friendDoc.id)
        });

        // Add new friend to state
        setFriends(prev => [...prev, {
          id: friendDoc.id,
          name: friendDoc.data().displayName,
          avatar: friendDoc.data().photoURL,
          level: Math.floor((friendDoc.data().points || 0) / 100) + 1,
          streak: friendDoc.data().currentStreak || 0,
          status: friendDoc.data().status || 'offline'
        }]);

        setIsAddingFriend(false);
        setNewFriendName('');
      }
    } catch (error) {
      console.error("Error adding friend:", error);
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
