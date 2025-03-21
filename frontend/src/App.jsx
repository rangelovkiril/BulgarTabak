import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import HabitSelection from "./pages/HabitSelection";
import MainPage from "./pages/MainPage";
import EventForm from "./pages/EventForm";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Leaderboard from "./pages/Leaderboard";
import FriendProfile from "./pages/FriendProfile";
import "./styles/auth.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/select-habits" element={<HabitSelection />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/event" element={<EventForm />} />
        <Route path="/event/edit/:eventId" element={<EventForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:friendId" element={<Profile />} />
        <Route
          path="/friendProfile/:friendId"
          element={<FriendProfile />}
        />{" "}
        {/* Make sure this route exists */}
        <Route path="/friends" element={<Friends />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default App;
