import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import HabitSelection from "./pages/HabitSelection";
import MainPage from "./pages/MainPage";
import EventForm from "./pages/EventForm"; // Add this line
import "./styles/auth.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/select-habits" element={<HabitSelection />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/event" element={<EventForm />} /> {/* Add this line */}
        <Route path="/event/edit/:eventId" element={<EventForm />} />
      </Routes>
    </Router>
  );
};

export default App;
