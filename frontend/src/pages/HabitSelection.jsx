import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { habitTemplates } from "../data/habitTemplates";
import "../styles/habitSelection.css";

const HabitSelection = () => {
  const navigate = useNavigate();
  const [selectedHabits, setSelectedHabits] = useState({});

  const handleHabitCheck = (habitId) => {
    setSelectedHabits((prev) => ({
      ...prev,
      [habitId]: prev[habitId] ? null : { goalHours: "" },
    }));
  };

  const handleHoursChange = (habitId, hours) => {
    setSelectedHabits((prev) => ({
      ...prev,
      [habitId]: { ...prev[habitId], goalHours: hours },
    }));
  };

  const handleSubmit = () => {
    localStorage.setItem("userHabits", JSON.stringify(selectedHabits));
    navigate("/main");
  };

  return (
    <div className="habit-selection-container">
      <h1>Select Habits to Build</h1>
      <div className="habits-grid">
        {habitTemplates.map((habit) => (
          <div key={habit.id} className="habit-selection-card">
            <div className="habit-header">
              <input
                type="checkbox"
                checked={!!selectedHabits[habit.id]}
                onChange={() => handleHabitCheck(habit.id)}
              />
              <h3>{habit.name}</h3>
            </div>
            <p>{habit.description}</p>
            {selectedHabits[habit.id] && (
              <select
                value={selectedHabits[habit.id].goalHours}
                onChange={(e) => handleHoursChange(habit.id, e.target.value)}
                className="hours-dropdown"
              >
                <option value="">Select goal hours</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                  <option key={hour} value={hour}>
                    {hour} hours
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={Object.values(selectedHabits).some((h) => !h?.goalHours)}
      >
        Continue to Calendar
      </button>
    </div>
  );
};

export default HabitSelection;
