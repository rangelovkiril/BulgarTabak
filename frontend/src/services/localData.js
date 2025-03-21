/**
 * LocalData service - provides data storage without requiring a backend
 * This is a temporary solution to bypass backend connection issues
 */
export const localDataService = {
  // Event methods
  getEvents: () => {
    const events = JSON.parse(localStorage.getItem("localEvents") || "[]");
    return events;
  },

  saveEvent: (event) => {
    const events = localDataService.getEvents();
    // Add ID and formatted dates if not present
    const newEvent = {
      ...event,
      id: event.id || `local-${Date.now()}`,
      start: event.start || new Date().toISOString(),
      end: event.end || new Date(Date.now() + 3600000).toISOString(),
    };

    events.push(newEvent);
    localStorage.setItem("localEvents", JSON.stringify(events));
    return newEvent;
  },

  updateEvent: (id, updatedEvent) => {
    const events = localDataService.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedEvent };
      localStorage.setItem("localEvents", JSON.stringify(events));
      return events[index];
    }
    return null;
  },

  deleteEvent: (id) => {
    const events = localDataService.getEvents();
    const filteredEvents = events.filter((e) => e.id !== id);
    localStorage.setItem("localEvents", JSON.stringify(filteredEvents));
  },

  // User methods
  getCurrentUser: () => {
    return JSON.parse(
      localStorage.getItem("user") ||
        '{"name":"Demo User","email":"demo@example.com","id":"local-user-1"}'
    );
  },

  // Habit methods
  getUserHabits: () => {
    try {
      const habitsJson = localStorage.getItem("userHabits");

      // Initialize if not exists
      if (!habitsJson) {
        localStorage.setItem("userHabits", "[]");
        return [];
      }

      try {
        const habits = JSON.parse(habitsJson);
        // Make sure it's an array
        if (!Array.isArray(habits)) {
          console.error("userHabits is not an array, resetting to empty array");
          localStorage.setItem("userHabits", "[]");
          return [];
        }
        return habits;
      } catch (parseError) {
        console.error("Error parsing habits from localStorage:", parseError);
        localStorage.setItem("userHabits", "[]");
        return [];
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return [];
    }
  },

  saveHabit: (habitData) => {
    try {
      // Get current habits, ensuring it's an array
      let habits = [];
      try {
        const existingHabits = localDataService.getUserHabits();
        if (Array.isArray(existingHabits)) {
          habits = existingHabits;
        } else {
          console.warn("Retrieved habits was not an array, creating new array");
        }
      } catch (error) {
        console.warn(
          "Error getting existing habits, creating new array",
          error
        );
      }

      // Check if habit with same name already exists (replace it if so)
      const existingIndex = habits.findIndex(h => h.name === habitData.name);
      
      // Ensure required fields
      const newHabit = {
        ...habitData,
        id: habitData.id || `habit-${Date.now()}`,
        startDate: habitData.startDate || new Date().toISOString(),
        currentProgress: habitData.currentProgress || 0,
        lastCompleted: habitData.lastCompleted || null,
        streak: habitData.streak || 0,
        completionHistory: habitData.completionHistory || [],
      };

      // Log for debugging
      console.log("Saving habit to localStorage:", newHabit);

      // Add to habits array and save (replace existing if found)
      if (existingIndex >= 0) {
        habits[existingIndex] = newHabit;
      } else {
        habits.push(newHabit);
      }
      
      localStorage.setItem("userHabits", JSON.stringify(habits));
      return newHabit;
    } catch (error) {
      console.error("Error saving habit to localStorage:", error);
      throw new Error(`Failed to save habit: ${error.message}`);
    }
  },

  updateHabitProgress: (habitId, progressData) => {
    const habits = localDataService.getUserHabits();
    const index = habits.findIndex((h) => h.id === habitId);

    if (index !== -1) {
      const today = new Date();
      const lastCompletedDate = habits[index].lastCompleted
        ? new Date(habits[index].lastCompleted)
        : null;

      // Calculate streak
      let streak = habits[index].streak || 0;

      if (lastCompletedDate) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastCompletedDate.toDateString() === yesterday.toDateString()) {
          streak += 1;
        } else if (lastCompletedDate < yesterday) {
          streak = 1;
        }
      } else {
        streak = 1;
      }

      // Update habit
      habits[index] = {
        ...habits[index],
        ...progressData,
        lastCompleted: today.toISOString(),
        streak: streak,
      };

      localStorage.setItem("userHabits", JSON.stringify(habits));
      return habits[index];
    }

    return null;
  },
};

// Initialize with some sample data if empty
if (!localStorage.getItem("localEvents")) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sampleEvents = [
    {
      id: "sample-1",
      title: "Team Meeting",
      description: "Weekly team sync",
      start: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
      end: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    },
    {
      id: "sample-2",
      title: "Lunch Break",
      description: "Lunch with colleagues",
      start: new Date(today.setHours(12, 30, 0, 0)).toISOString(),
      end: new Date(today.setHours(13, 30, 0, 0)).toISOString(),
    },
    {
      id: "sample-3",
      title: "Project Review",
      description: "Sprint review",
      start: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString(),
      end: new Date(tomorrow.setHours(15, 0, 0, 0)).toISOString(),
    },
  ];

  localStorage.setItem("localEvents", JSON.stringify(sampleEvents));
}
