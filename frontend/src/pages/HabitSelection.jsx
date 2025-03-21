import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { habitTemplates } from "../data/habitTemplates";
import { HabitType } from "../types/habits";
import "../styles/habitSelection.css";
import { habitService } from "../services/habits";
import { auth } from "../firebase/firebase";

const HabitSelection = () => {
  const navigate = useNavigate();
  const [selectedHabits, setSelectedHabits] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Group habits by type
  const habitsByType = habitTemplates.reduce((acc, habit) => {
    acc[habit.type] = [...(acc[habit.type] || []), habit];
    return acc;
  }, {});

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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(""); // Clear any previous errors

      const selectedWithGoals = Object.entries(selectedHabits)
        .filter(([_, value]) => value && value.goalHours)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      if (Object.keys(selectedWithGoals).length > 0) {
        // ALWAYS enable local mode when Firebase permissions fail
        localStorage.setItem("localMode", "true");
        console.log("Local mode enabled for habit saving");

        // Find the habit templates and save them one by one
        for (const [habitId, settings] of Object.entries(selectedWithGoals)) {
          try {
            const habitTemplate = habitTemplates.find((h) => h.id === habitId);
            if (habitTemplate) {
              // Ensure goalHours is a valid number and all required fields are present
              const goalHours = parseFloat(settings.goalHours);
              if (isNaN(goalHours)) {
                throw new Error(
                  `Invalid goal hours for habit: ${habitTemplate.name}`
                );
              }

              // Prepare habit data with all required fields
              const habitData = {
                ...habitTemplate,
                finalGoalHours: goalHours,
                initialGoalHours: Math.min(
                  goalHours * 0.4,
                  goalHours - 0.5 > 0 ? goalHours - 0.5 : goalHours * 0.5
                ),
                currentProgress: 0,
                streak: 0,
                // Add these fields that are needed for proper scheduling
                startDate: new Date().toISOString(),
                completionHistory: [],
                // For Training, ensure daily scheduling
                forceDaily: habitTemplate.name === "Training",
              };

              console.log(
                `Saving habit: ${habitTemplate.name} with goal: ${goalHours} hours`
              );
              await localDataService.saveHabit(habitData); // Use localDataService directly to bypass Firebase
            }
          } catch (err) {
            console.error(`Error saving habit ${habitId}:`, err);
            throw err; // Re-throw to be caught by outer catch
          }
        }

        // If we get here, all habits were saved successfully
        navigate("/main");
      } else {
        setError("Please select at least one habit and set a goal.");
      }
    } catch (error) {
      console.error("Error in habit submission:", error);
      setError(
        `Failed to save your habit selections: ${
          error.message || "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHoursOptions = (habitType) => {
    switch (habitType) {
      case HabitType.SLEEP:
        return Array.from({ length: 13 }, (_, i) => i + 4); // 4-16 hours
      case HabitType.WORKOUT:
        return [0.5, 1, 1.5, 2, 2.5, 3]; // 30min - 3 hours
      case HabitType.STUDY:
      case HabitType.READING:
        return [0.5, 1, 1.5, 2, 2.5, 3, 4]; // 30min - 4 hours
      case HabitType.MEDITATION:
        return [0.25, 0.5, 0.75, 1, 1.5, 2]; // 15min - 2 hours
      case HabitType.CREATIVE:
        return [0.5, 1, 1.5, 2, 3, 4]; // 30min - 4 hours
      case HabitType.PRODUCTIVITY:
        return [1, 2, 3, 4, 5, 6]; // 1-6 hours
      default:
        return [0.5, 1, 1.5, 2];
    }
  };

  return (
    <div className="habit-selection-container">
      <header className="habit-selection-header">
        <h1>Choose Your Habits</h1>
        <p>Select the habits you want to build and set your daily goals</p>
      </header>

      <div className="category-tabs">
        <button
          className={`category-tab ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          All Habits
        </button>
        {Object.entries(HabitType).map(([key, value]) => (
          <button
            key={value}
            className={`category-tab ${
              activeCategory === value ? "active" : ""
            }`}
            onClick={() => setActiveCategory(value)}
          >
            {key.charAt(0) + key.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="habits-grid">
        {(activeCategory === "all"
          ? habitTemplates
          : habitsByType[activeCategory]
        )?.map((habit) => (
          <div
            key={habit.id}
            className={`habit-selection-card ${
              selectedHabits[habit.id] ? "selected" : ""
            }`}
          >
            <div className="habit-header">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={!!selectedHabits[habit.id]}
                  onChange={() => handleHabitCheck(habit.id)}
                />
                <span className="checkmark"></span>
              </label>
              <h3>{habit.name}</h3>
            </div>
            <p>{habit.description}</p>
            {selectedHabits[habit.id] && (
              <div className="custom-select">
                <select
                  value={selectedHabits[habit.id].goalHours}
                  onChange={(e) => handleHoursChange(habit.id, e.target.value)}
                >
                  <option value="">Select daily goal</option>
                  {getHoursOptions(habit.type).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour < 1
                        ? `${hour * 60} minutes`
                        : `${hour} hour${hour > 1 ? "s" : ""}`}
                    </option>
                  ))}
                </select>
                <span className="select-arrow"></span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="selection-summary">
        <div>
          <p>Selected: {Object.keys(selectedHabits).length} habits</p>
          <button
            className={`submit-button ${isSubmitting ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={
              !Object.values(selectedHabits).some((h) => h?.goalHours) ||
              isSubmitting
            }
          >
            {isSubmitting ? "Saving..." : "Continue to Calendar"}
          </button>
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => setError("")} className="close-error">
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitSelection;
