import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

export const firestoreService = {
  // Event methods
  getEvents: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        description: doc.data().description || "",
        start: doc.data().start || doc.data().start_time, // Handle both formats
        end: doc.data().end || doc.data().end_time, // Handle both formats
      }));
    } catch (error) {
      console.error("Error getting events from Firestore:", error);
      // Fall back to local storage if Firestore fails
      return JSON.parse(localStorage.getItem("localEvents") || "[]");
    }
  },

  createEvent: async (eventData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Ensure data is consistently formatted
      const newEvent = {
        title: eventData.title,
        description: eventData.description || "",
        start: eventData.start, // Make sure this is an ISO string
        end: eventData.end, // Make sure this is an ISO string
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };

      const eventsRef = collection(db, "events");
      const docRef = await addDoc(eventsRef, newEvent);

      // Return in format expected by calendar
      return {
        id: docRef.id,
        title: newEvent.title,
        description: newEvent.description,
        start: newEvent.start,
        end: newEvent.end,
      };
    } catch (error) {
      console.error("Error creating event in Firestore:", error);
      // Fall back to local storage
      const localEvent = {
        ...eventData,
        id: `local-${Date.now()}`,
      };
      const events = JSON.parse(localStorage.getItem("localEvents") || "[]");
      events.push(localEvent);
      localStorage.setItem("localEvents", JSON.stringify(events));
      return localEvent;
    }
  },

  updateEvent: async (eventId, eventData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: new Date().toISOString(),
      });

      return {
        id: eventId,
        ...eventData,
      };
    } catch (error) {
      console.error("Error updating event in Firestore:", error);
      // Fall back to local storage
      const events = JSON.parse(localStorage.getItem("localEvents") || "[]");
      const index = events.findIndex((e) => e.id === eventId);
      if (index !== -1) {
        events[index] = { ...events[index], ...eventData };
        localStorage.setItem("localEvents", JSON.stringify(events));
        return events[index];
      }
      return null;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const eventRef = doc(db, "events", eventId);
      await deleteDoc(eventRef);
      return true;
    } catch (error) {
      console.error("Error deleting event from Firestore:", error);
      // Fall back to local storage
      const events = JSON.parse(localStorage.getItem("localEvents") || "[]");
      const filteredEvents = events.filter((e) => e.id !== eventId);
      localStorage.setItem("localEvents", JSON.stringify(filteredEvents));
      return true;
    }
  },

  // User profile methods
  getUserProfile: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Create user profile if it doesn't exist
        const newProfile = {
          userId: user.uid,
          email: user.email,
          name: user.displayName || "",
          joinedDate: new Date().toISOString(),
          level: 1,
          points: 0,
          streak: 0,
        };

        const docRef = await addDoc(usersRef, newProfile);
        return {
          id: docRef.id,
          ...newProfile,
        };
      }

      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      };
    } catch (error) {
      console.error("Error getting user profile from Firestore:", error);
      return null;
    }
  },

  // Habit methods
  getUserHabits: async () => {
    try {
      const user = auth.currentUser;
      if (!user) return [];

      const habitsRef = collection(db, "habits");
      const q = query(habitsRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate,
        lastCompleted: doc.data().lastCompleted,
      }));
    } catch (error) {
      console.error("Error getting habits from Firestore:", error);
      // Fall back to local storage
      return JSON.parse(localStorage.getItem("userHabits") || "[]");
    }
  },

  saveHabit: async (habitData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const newHabit = {
        ...habitData,
        userId: user.uid,
        startDate: new Date().toISOString(),
        currentProgress: 0,
        lastCompleted: null,
        streak: 0,
        createdAt: new Date().toISOString(),
      };

      const habitsRef = collection(db, "habits");
      const docRef = await addDoc(habitsRef, newHabit);

      return {
        id: docRef.id,
        ...newHabit,
      };
    } catch (error) {
      console.error("Error saving habit to Firestore:", error);
      // Fall back to local storage
      const localHabit = {
        ...habitData,
        id: `local-habit-${Date.now()}`,
        startDate: new Date().toISOString(),
        currentProgress: 0,
        lastCompleted: null,
        streak: 0,
      };

      const habits = JSON.parse(localStorage.getItem("userHabits") || "[]");
      habits.push(localHabit);
      localStorage.setItem("userHabits", JSON.stringify(habits));

      return localHabit;
    }
  },

  updateHabitProgress: async (habitId, progressData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const habitRef = doc(db, "habits", habitId);

      // Get current habit data for streak calculation
      const habitDoc = await getDoc(habitRef);

      if (!habitDoc.exists()) {
        throw new Error("Habit not found");
      }

      const habitData = habitDoc.data();
      const lastCompletedDate = habitData.lastCompleted
        ? new Date(habitData.lastCompleted)
        : null;
      const today = new Date();

      // Calculate if streak continues or resets
      let streak = habitData.streak || 0;

      if (lastCompletedDate) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // If last completed was yesterday, streak continues
        if (lastCompletedDate.toDateString() === yesterday.toDateString()) {
          streak += 1;
        }
        // If last completed was before yesterday, streak resets
        else if (lastCompletedDate < yesterday) {
          streak = 1;
        }
        // If already completed today, streak stays the same
      } else {
        // First time completing, start streak
        streak = 1;
      }

      await updateDoc(habitRef, {
        ...progressData,
        lastCompleted: today.toISOString(),
        streak: streak,
        updatedAt: today.toISOString(),
      });

      return {
        id: habitId,
        ...habitData,
        ...progressData,
        streak: streak,
        lastCompleted: today.toISOString(),
      };
    } catch (error) {
      console.error("Error updating habit progress in Firestore:", error);

      // Fall back to local storage
      const habits = JSON.parse(localStorage.getItem("userHabits") || "[]");
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
    }
  },
};
