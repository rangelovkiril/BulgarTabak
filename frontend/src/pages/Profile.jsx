import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('User123');
  const [isEditing, setIsEditing] = useState(false);
  const email = 'user@example.com';

  const handleUsernameSubmit = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <Header />
      <div className="profile-content">
        <div className="profile-box">
          <div className="profile-info">
            {isEditing ? (
              <div className="edit-username">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="username-input"
                />
                <button onClick={handleUsernameSubmit} className="save-button">
                  Save
                </button>
              </div>
            ) : (
              <div className="username-display">
                <h1>{username}</h1>
                <button onClick={() => setIsEditing(true)} className="edit-button">
                  Edit
                </button>
              </div>
            )}
            <p className="email">{email}</p>
          </div>
        </div>

        <div className="stats-box">
          <div className="stat-item">
            <h3>Points</h3>
            <p>....</p>
          </div>
          <div className="stat-item">
            <h3>Streak</h3>
            <p>....</p>
          </div>
          <div className="stat-item">
            <h3>Habits Completed</h3>
            <p>....</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/select-habits')}
          className="edit-habits-button"
        >
          Edit Habits
        </button>
      </div>
    </div>
  );
};

export default Profile;
