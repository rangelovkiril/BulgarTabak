import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Initialize local mode and empty habits array if not already set
localStorage.setItem("localMode", "true");

// Initialize empty habits array if doesn't exist or is invalid
try {
  const habitsJson = localStorage.getItem("userHabits");
  if (!habitsJson) {
    localStorage.setItem("userHabits", "[]");
  } else {
    try {
      const parsed = JSON.parse(habitsJson);
      if (!Array.isArray(parsed)) {
        console.warn("userHabits was not an array, resetting");
        localStorage.setItem("userHabits", "[]");
      }
    } catch (e) {
      console.warn("Invalid userHabits JSON, resetting");
      localStorage.setItem("userHabits", "[]");
    }
  }
} catch (e) {
  console.error("Error initializing localStorage:", e);
}

// Create a sample Training habit if none exists
try {
  const habits = JSON.parse(localStorage.getItem("userHabits") || "[]");
  if (!habits.some((h) => h.name === "Training")) {
    // Add a default Training habit
    habits.push({
      id: `workout-${Date.now()}`,
      type: "WORKOUT",
      name: "Training",
      description: "Regular physical exercise and training",
      finalGoalHours: 1.5,
      initialGoalHours: 0.5,
      gradualIncreaseWeeks: 4,
      currentProgress: 0,
      streak: 0,
      forceDaily: true,
      startDate: new Date().toISOString(),
      completionHistory: [],
      timePreferences: [
        {
          startTime: "06:00",
          endTime: "10:00",
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        },
        {
          startTime: "16:00",
          endTime: "20:00",
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        },
      ],
    });
    localStorage.setItem("userHabits", JSON.stringify(habits));
    console.log("Added default Training habit");
  }
} catch (e) {
  console.error("Error setting up default Training habit:", e);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
