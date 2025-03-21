import { firestoreService } from "./firestore";
import { localDataService } from "./localData";
import { auth } from "../firebase/firebase";

// Initialize localStorage if needed
if (!localStorage.getItem("userHabits")) {
  localStorage.setItem("userHabits", "[]");
}

export const habitService = {
  async getUserHabits() {
    try {
      // Always use local storage in demo mode
      if (localStorage.getItem("localMode") === "true") {
        return localDataService.getUserHabits();
      } else if (auth.currentUser) {
        try {
          return firestoreService.getUserHabits();
        } catch (error) {
          console.error(
            "Firebase auth failed, falling back to local storage:",
            error
          );
          localStorage.setItem("localMode", "true");
          return localDataService.getUserHabits();
        }
      } else {
        throw new Error("Not authenticated");
      }
    } catch (error) {
      console.error("Error in getUserHabits:", error);
      // Last resort, try local storage
      return localDataService.getUserHabits();
    }
  },

  async saveHabit(habitData) {
    try {
      // Ensure we have all required fields
      const completeHabitData = {
        ...habitData,
        startDate: habitData.startDate || new Date().toISOString(),
        currentProgress: habitData.currentProgress || 0,
        lastCompleted: habitData.lastCompleted || null,
        streak: habitData.streak || 0,
        completionHistory: habitData.completionHistory || [],
      };

      if (auth.currentUser) {
        return firestoreService.saveHabit(completeHabitData);
      } else if (localStorage.getItem("localMode") === "true") {
        return localDataService.saveHabit(completeHabitData);
      } else {
        console.log("Setting local mode for habit saving");
        localStorage.setItem("localMode", "true");
        return localDataService.saveHabit(completeHabitData);
      }
    } catch (error) {
      console.error("Error in habitService.saveHabit:", error);
      throw error;
    }
  },

  async updateHabitProgress(habitId, progress) {
    if (auth.currentUser) {
      return firestoreService.updateHabitProgress(habitId, progress);
    } else if (localStorage.getItem("localMode") === "true") {
      return localDataService.updateHabitProgress(habitId, progress);
    } else {
      throw new Error("Not authenticated");
    }
  },

  // Calculate current target duration based on gradual build-up
  calculateCurrentTarget(habit) {
    const startDate = new Date(habit.startDate);
    const now = new Date();
    const daysSinceStart = Math.floor(
      (now - startDate) / (1000 * 60 * 60 * 24)
    );
    const increasePerWeek =
      (habit.finalGoalHours - habit.initialGoalHours) /
      habit.gradualIncreaseWeeks;
    const weeksSinceStart = Math.floor(daysSinceStart / 7);

    // Cap at the final goal
    const currentTarget = Math.min(
      habit.initialGoalHours + weeksSinceStart * increasePerWeek,
      habit.finalGoalHours
    );

    return Math.max(habit.initialGoalHours, currentTarget);
  },

  // Schedule habits in available time slots
  scheduleHabits(events, habits, selectedDate = new Date()) {
    // Sort events chronologically
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    // Calculate habits for the next 4 weeks (or custom period)
    const scheduledHabits = [];
    const scheduleDays = 28; // 4 weeks

    // Track which habits have been scheduled per day to avoid duplicates
    const scheduledHabitsPerDay = new Map();

    // For each day in our scheduling window
    for (let dayOffset = 0; dayOffset < scheduleDays; dayOffset++) {
      const targetDate = new Date(selectedDate);
      targetDate.setDate(targetDate.getDate() + dayOffset);

      // Skip past dates
      if (targetDate < new Date().setHours(0, 0, 0, 0)) {
        continue;
      }

      const dateKey = targetDate.toISOString().split("T")[0];

      // Initialize tracking for this day
      if (!scheduledHabitsPerDay.has(dateKey)) {
        scheduledHabitsPerDay.set(dateKey, new Set());
      }

      // Get events for this day to find free slots
      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.start).toISOString().split("T")[0];
        return eventDate === dateKey;
      });

      // Find free time slots for this specific day
      const freeSlots = this.findFreeTimeSlots(dayEvents, targetDate);

      // Combine all habits but give priority to specific ones
      const allHabits = [...habits].sort((a, b) => {
        // Give higher priority to Training
        if (a.name === "Training") return -1;
        if (b.name === "Training") return 1;
        return 0;
      });

      // Process all habits for this day
      for (const habit of allHabits) {
        // Skip if habit is already completed fully (achieved goal for 7+ days)
        if (this.hasCompletedHabitProgression(habit)) {
          continue;
        }

        // Skip if this habit was already completed for today
        if (this.isCompletedToday(habit)) {
          continue;
        }

        // Skip if this habit is already scheduled for today
        const habitId = habit.id;
        if (scheduledHabitsPerDay.get(dateKey).has(habitId)) {
          continue;
        }

        // Check if this habit should be scheduled
        if (this.shouldScheduleHabitForDay(habit, targetDate)) {
          const suitableSlot = this.findSuitableSlotForHabit(
            habit,
            freeSlots,
            targetDate
          );

          if (suitableSlot) {
            const habitEvent = this.createHabitEvent(
              habit,
              suitableSlot,
              targetDate
            );
            scheduledHabits.push(habitEvent);

            // Mark this habit as scheduled for this day
            scheduledHabitsPerDay.get(dateKey).add(habitId);

            // Update free slots after scheduling
            this.updateFreeSlotsAfterScheduling(
              freeSlots,
              suitableSlot,
              habitEvent
            );
          }
        }
      }
    }

    return scheduledHabits;
  },

  hasCompletedHabitProgression(habit) {
    // Check if the habit has been completed at full goal level for a full week
    if (!habit.completionHistory) return false;

    // Get the last 7 completed dates at full goal level
    const fullCompletions = (habit.completionHistory || []).filter(
      (entry) => entry.completedAmount >= habit.finalGoalHours
    );

    if (fullCompletions.length < 7) return false;

    // Sort by date, newest first
    fullCompletions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get the most recent 7 completions
    const recentCompletions = fullCompletions.slice(0, 7);

    // Check if these 7 completions happened on 7 consecutive days
    const today = new Date().setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (i >= recentCompletions.length) return false;

      const completion = recentCompletions[i];
      const completionDate = new Date(completion.date).setHours(0, 0, 0, 0);

      if (completionDate !== expectedDate.getTime()) {
        return false;
      }
    }

    return true;
  },

  isCompletedToday(habit) {
    if (!habit.lastCompleted) return false;

    const today = new Date().toDateString();
    const lastCompleted = new Date(habit.lastCompleted).toDateString();

    return today === lastCompleted;
  },

  shouldScheduleHabitForDay(habit, targetDate) {
    // Check if this habit should be scheduled for the given day

    // 1. Check if the habit was already completed for this day
    const dateKey = targetDate.toISOString().split("T")[0];
    if (
      habit.completionHistory &&
      habit.completionHistory.some(
        (c) => new Date(c.date).toISOString().split("T")[0] === dateKey
      )
    ) {
      return false;
    }

    // 2. Force daily for Training or habits with forceDaily flag
    if (habit.name === "Training" || habit.forceDaily) {
      console.log(`Scheduling daily habit: ${habit.name} for ${dateKey}`);
      return true;
    }

    // 3. Check if this habit's schedule includes this day of week
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 6 = Saturday

    // Default to scheduling every day if no specific preferences
    if (!habit.timePreferences || !habit.timePreferences.length) {
      return true;
    }

    // Check if any time preference includes this day
    return habit.timePreferences.some(
      (pref) => pref.daysOfWeek && pref.daysOfWeek.includes(dayOfWeek)
    );
  },

  findSuitableSlotForHabit(habit, freeSlots, targetDate) {
    // Get current target duration based on progression
    const targetHours = this.calculateCurrentTarget(habit);
    const targetMinutes = targetHours * 60;

    // Find slots that meet the minimum duration requirement - at least 15 minutes
    const durableSlots = freeSlots.filter((slot) => slot.duration >= 15);

    if (durableSlots.length === 0) return null;

    // Filter slots based on time preferences for this habit
    let suitableSlots = [];

    if (habit.name === "Training") {
      // Training has specific time windows
      const morningWindow = durableSlots.filter((slot) => {
        const hour = slot.start.getHours();
        return hour >= 6 && hour <= 10; // Early morning 6 AM - 10 AM
      });

      const eveningWindow = durableSlots.filter((slot) => {
        const hour = slot.start.getHours();
        return hour >= 16 && hour <= 20; // Late afternoon/evening 4 PM - 8 PM
      });

      // Prefer evening slots, then morning slots
      suitableSlots = eveningWindow.length > 0 ? eveningWindow : morningWindow;
    } else if (habit.type === "SLEEP") {
      // Sleep should be scheduled in the evening or early morning
      suitableSlots = durableSlots.filter((slot) => {
        const hour = slot.start.getHours();
        return hour >= 21 || hour <= 2; // 9 PM - 2 AM
      });
    } else if (habit.type === "MEDITATION") {
      // Meditation is good early morning or before bed
      suitableSlots = durableSlots.filter((slot) => {
        const hour = slot.start.getHours();
        return (hour >= 5 && hour <= 8) || (hour >= 20 && hour <= 22);
      });
    } else if (habit.type === "STUDY") {
      // Study during productive hours
      const dayOfWeek = targetDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      suitableSlots = durableSlots.filter((slot) => {
        const hour = slot.start.getHours();
        return isWeekend
          ? hour >= 10 && hour <= 18 // Weekend hours
          : hour >= 8 && hour <= 19; // Weekday hours
      });
    } else {
      // Default suitable hours (daylight hours)
      suitableSlots = durableSlots.filter((slot) => {
        const hour = slot.start.getHours();
        return hour >= 8 && hour <= 21; // 8 AM - 9 PM
      });
    }

    // If no suitable slots based on time preferences, fall back to all durable slots
    if (suitableSlots.length === 0) {
      suitableSlots = durableSlots;
    }

    // Find slot that best matches the target duration
    suitableSlots.sort((a, b) => {
      // First sort by how well the duration matches the target
      const aDiff = Math.abs(a.duration - targetMinutes);
      const bDiff = Math.abs(b.duration - targetMinutes);

      if (Math.abs(aDiff - bDiff) > 15) {
        return aDiff - bDiff; // Significant difference in match quality
      }

      // For similar durations, prefer slots earlier in the day
      return a.start - b.start;
    });

    return suitableSlots.length > 0 ? suitableSlots[0] : null;
  },

  createHabitEvent(habit, slot, date) {
    // Calculate appropriate duration for this habit session
    const targetHours = this.calculateCurrentTarget(habit);
    // Show the actual progression in the event title
    const progressText =
      habit.finalGoalHours > targetHours
        ? `(${targetHours}/${habit.finalGoalHours} hrs)`
        : `(${targetHours} hrs)`;

    const targetMinutes = targetHours * 60;
    // Ensure the duration is reasonable (between 15 min and target, capped at 2 hours)
    const maxSessionLength = Math.min(targetMinutes, 120);
    const duration = Math.min(slot.duration, maxSessionLength);

    // Create the habit event object with improved naming
    return {
      id: `habit-${habit.id}-${date.toISOString().split("T")[0]}-${Date.now()}`,
      title: `${habit.name} ${progressText}`,
      description: habit.description,
      start: slot.start.toISOString(),
      end: new Date(slot.start.getTime() + duration * 60000).toISOString(),
      isHabit: true,
      habitId: habit.id,
      color: this.getHabitColor(habit.type),
      suggested: true,
      targetHours: targetHours,
      currentGoalText: progressText,
      habitType: habit.type,
    };
  },

  findFreeTimeSlots(events, targetDate) {
    const slots = [];

    // Set the start of the day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Set the end of the day
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Use current time as start if it's today
    const now = new Date();
    let dayStart = startOfDay;
    if (startOfDay.toDateString() === now.toDateString() && now > startOfDay) {
      dayStart = now;
      // Round to next 15 min
      dayStart.setMinutes(Math.ceil(dayStart.getMinutes() / 15) * 15, 0, 0);
    }

    let lastEnd = dayStart;

    // Sort events chronologically
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    // Get free slots between events
    for (const event of sortedEvents) {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      // Skip if event is outside of target date
      if (eventEnd <= startOfDay || eventStart >= endOfDay) {
        continue;
      }

      // If there's a gap between last event and this one
      if (lastEnd < eventStart) {
        slots.push({
          start: new Date(lastEnd),
          end: new Date(eventStart),
          duration: (eventStart - lastEnd) / (1000 * 60), // duration in minutes
        });
      }

      lastEnd = eventEnd > lastEnd ? eventEnd : lastEnd;
    }

    // Add slot from last event to end of day
    if (lastEnd < endOfDay) {
      slots.push({
        start: new Date(lastEnd),
        end: new Date(endOfDay),
        duration: (endOfDay - lastEnd) / (1000 * 60),
      });
    }

    return slots.filter((slot) => slot.duration >= 15); // Filter out slots shorter than 15 min
  },

  isTimeSlotSuitableForHabit(habit, slot) {
    const hour = slot.start.getHours();
    const day = slot.start.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekday = day >= 1 && day <= 5;
    const isWeekend = !isWeekday;

    // Special case for Training to make it more likely to appear
    if (habit.name === "Training" || habit.forceDaily) {
      // Accept any time slot if nothing else is found
      return true;
    }

    switch (habit.type) {
      case "WORKOUT":
        // Morning workout: 6-9 AM or evening workout: 4-8 PM
        return (hour >= 6 && hour <= 9) || (hour >= 16 && hour <= 20);

      // ...existing code for other habit types...
    }
  },

  async completeHabit(habitId, duration) {
    try {
      // Get current habit data
      const habits = await this.getUserHabits();
      const habit = habits.find((h) => h.id === habitId);

      if (!habit) {
        throw new Error("Habit not found");
      }

      // Calculate points based on completion percentage and progression
      const targetHours = this.calculateCurrentTarget(habit);
      const completionPercentage = Math.min(duration / targetHours, 1.0);

      // Base points (more points as you get closer to your final goal)
      const progressRatio = targetHours / habit.finalGoalHours;
      const basePoints = Math.round(50 * progressRatio);

      // Bonus points for completing 100%
      const completionBonus = completionPercentage >= 1.0 ? 20 : 0;

      // Bonus for consistency (streak)
      let streak = habit.streak || 0;
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // Check if we already completed this habit today
      const alreadyCompletedToday =
        habit.completionHistory &&
        habit.completionHistory.some(
          (entry) =>
            new Date(entry.date).toISOString().split("T")[0] === todayStr
        );

      if (!alreadyCompletedToday) {
        // Check if this completion continues a streak
        if (habit.lastCompleted) {
          const lastDate = new Date(habit.lastCompleted);
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);

          // If last completion was yesterday, increase streak
          if (
            lastDate.toISOString().split("T")[0] ===
            yesterday.toISOString().split("T")[0]
          ) {
            streak += 1;
          } else {
            // Otherwise reset streak to 1 (today)
            streak = 1;
          }
        } else {
          // First time completing, start streak at 1
          streak = 1;
        }
      }

      // Calculate streak bonus
      const streakBonus = streak ? Math.min(streak * 2, 30) : 0;

      // Calculate total points earned
      const pointsEarned = Math.round(
        (basePoints + completionBonus + streakBonus) * completionPercentage
      );

      // Update habit progress data
      const completionData = {
        habitId: habitId,
        date: new Date().toISOString(),
        targetHours: targetHours,
        completedAmount: duration,
        completionPercentage: completionPercentage,
        pointsEarned: pointsEarned,
      };

      // Initialize or update completion history
      const completionHistory = habit.completionHistory || [];

      // Only add to history if not already completed today
      if (!alreadyCompletedToday) {
        completionHistory.push(completionData);
      }

      // Update current progress and last completed
      const updateData = {
        currentProgress: (habit.currentProgress || 0) + duration,
        lastCompleted: new Date().toISOString(),
        completionHistory: completionHistory,
        streak: streak,
      };

      // Save the updated habit data
      await this.updateHabitProgress(habitId, updateData);

      // Update user profile with points and check achievements
      const userProfile = await this.updateUserProfileAfterCompletion(
        habitId,
        pointsEarned,
        completionPercentage
      );

      return {
        success: true,
        pointsEarned,
        updatedHabit: {
          ...habit,
          ...updateData,
        },
        newAchievements: userProfile.newAchievements || [],
      };
    } catch (error) {
      console.error("Error completing habit:", error);
      throw error;
    }
  },

  async updateUserProfileAfterCompletion(
    habitId,
    pointsEarned,
    completionPercentage
  ) {
    try {
      // Get current user profile or create a new one
      const userProfile = JSON.parse(
        localStorage.getItem("userProfile") ||
          '{"points":0,"level":1,"streak":0,"achievements":[]}'
      );

      // Update points
      userProfile.points = (userProfile.points || 0) + pointsEarned;

      // Update level (1 level for every 500 points)
      userProfile.level = Math.max(1, Math.floor(userProfile.points / 500) + 1);

      // Update streak if 100% completion
      if (completionPercentage >= 1.0) {
        // Check if habit was completed yesterday to continue streak
        const lastStreakDate = userProfile.lastStreakDate
          ? new Date(userProfile.lastStreakDate)
          : null;
        const today = new Date();

        // Format dates to compare just the date portion
        const todayStr = today.toISOString().split("T")[0];
        const yesterdayDate = new Date(today);
        yesterdayDate.setDate(today.getDate() - 1);
        const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

        if (
          lastStreakDate &&
          lastStreakDate.toISOString().split("T")[0] === yesterdayStr
        ) {
          // Streak continues
          userProfile.streak = (userProfile.streak || 0) + 1;
        } else if (
          !lastStreakDate ||
          lastStreakDate.toISOString().split("T")[0] !== todayStr
        ) {
          // New streak starts (only if not already logged today)
          userProfile.streak = 1;
        }

        // Update last streak date
        userProfile.lastStreakDate = new Date().toISOString();
      }

      // Check for achievements
      this.checkAndUpdateAchievements(
        userProfile,
        habitId,
        completionPercentage
      );

      // Save updated profile
      localStorage.setItem("userProfile", JSON.stringify(userProfile));

      return userProfile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return {};
    }
  },

  checkAndUpdateAchievements(userProfile, habitId, completionPercentage) {
    // Initialize achievements if not present
    if (!userProfile.achievements) {
      userProfile.achievements = [];
    }

    // Get habit data for better context
    const habits = JSON.parse(localStorage.getItem("userHabits") || "[]");
    const habit = habits.find((h) => h.id === habitId);

    if (!habit) return;

    // Check for various achievements
    const achievements = [];

    // Streak achievements
    if (
      userProfile.streak >= 7 &&
      !this.hasAchievement(userProfile, "streak_7")
    ) {
      achievements.push({
        id: "streak_7",
        title: "Streak Master",
        description: "7 day streak",
        date: new Date().toISOString(),
        icon: "⚡",
      });
    }

    if (
      userProfile.streak >= 30 &&
      !this.hasAchievement(userProfile, "streak_30")
    ) {
      achievements.push({
        id: "streak_30",
        title: "Streak Champion",
        description: "30 day streak",
        date: new Date().toISOString(),
        icon: "🏆",
      });
    }

    // Habit specific achievements
    const habitCompletions = habit.completionHistory?.length || 0;

    if (
      habitCompletions >= 5 &&
      !this.hasAchievement(userProfile, `${habit.type}_5`)
    ) {
      achievements.push({
        id: `${habit.type}_5`,
        title: `${this.getHabitTypeName(habit.type)} Enthusiast`,
        description: `Complete ${habit.name} 5 times`,
        date: new Date().toISOString(),
        icon: this.getHabitTypeIcon(habit.type),
      });
    }

    if (
      habitCompletions >= 20 &&
      !this.hasAchievement(userProfile, `${habit.type}_20`)
    ) {
      achievements.push({
        id: `${habit.type}_20`,
        title: `${this.getHabitTypeName(habit.type)} Master`,
        description: `Complete ${habit.name} 20 times`,
        date: new Date().toISOString(),
        icon: this.getHabitTypeIcon(habit.type),
      });
    }

    // Level achievements
    if (
      userProfile.level >= 5 &&
      !this.hasAchievement(userProfile, "level_5")
    ) {
      achievements.push({
        id: "level_5",
        title: "Rising Star",
        description: "Reached level 5",
        date: new Date().toISOString(),
        icon: "⭐",
      });
    }

    if (
      userProfile.level >= 10 &&
      !this.hasAchievement(userProfile, "level_10")
    ) {
      achievements.push({
        id: "level_10",
        title: "Habit Hero",
        description: "Reached level 10",
        date: new Date().toISOString(),
        icon: "🌟",
      });
    }

    // Add new achievements to user profile
    if (achievements.length > 0) {
      userProfile.achievements = [
        ...(userProfile.achievements || []),
        ...achievements,
      ];

      // Return the newly unlocked achievements
      userProfile.newAchievements = achievements;
    }
  },

  hasAchievement(userProfile, achievementId) {
    return (
      userProfile.achievements?.some((a) => a.id === achievementId) || false
    );
  },

  getHabitTypeName(type) {
    const names = {
      SLEEP: "Sleep",
      WORKOUT: "Fitness",
      STUDY: "Study",
      MEDITATION: "Mindfulness",
      READING: "Reading",
      CREATIVE: "Creativity",
      PRODUCTIVITY: "Productivity",
    };

    return names[type] || type;
  },

  getHabitTypeIcon(type) {
    const icons = {
      SLEEP: "😴",
      WORKOUT: "💪",
      STUDY: "📚",
      MEDITATION: "🧘",
      READING: "📖",
      CREATIVE: "🎨",
      PRODUCTIVITY: "⚡",
    };

    return icons[type] || "✨";
  },

  getHabitColor(habitType) {
    // Different colors for different habit types
    const colors = {
      SLEEP: "#9C27B0", // Purple
      WORKOUT: "#F44336", // Red
      STUDY: "#2196F3", // Blue
      MEDITATION: "#4CAF50", // Green
      READING: "#FF9800", // Orange
      CREATIVE: "#E91E63", // Pink
      PRODUCTIVITY: "#607D8B", // Blue-grey
    };

    return colors[habitType] || "#9C27B0"; // Default purple
  },

  // Helper method to update free slots after scheduling a habit
  updateFreeSlotsAfterScheduling(freeSlots, usedSlot, habitEvent) {
    const habitStartTime = new Date(habitEvent.start);
    const habitEndTime = new Date(habitEvent.end);
    const habitDuration = (habitEndTime - habitStartTime) / (1000 * 60); // in minutes

    // Find the index of the used slot
    const slotIndex = freeSlots.indexOf(usedSlot);
    if (slotIndex === -1) return;

    // Remove the used slot
    freeSlots.splice(slotIndex, 1);

    // Check if we need to add back smaller slots
    const slotStart = new Date(usedSlot.start);
    const slotEnd = new Date(usedSlot.end);

    // If habit starts after slot starts, add a new slot for the time before
    if (habitStartTime > slotStart) {
      const beforeDuration = (habitStartTime - slotStart) / (1000 * 60);
      if (beforeDuration >= 15) {
        // Only add if at least 15 minutes
        freeSlots.push({
          start: new Date(slotStart),
          end: new Date(habitStartTime),
          duration: beforeDuration,
        });
      }
    }

    // If habit ends before slot ends, add a new slot for the time after
    if (habitEndTime < slotEnd) {
      const afterDuration = (slotEnd - habitEndTime) / (1000 * 60);
      if (afterDuration >= 15) {
        // Only add if at least 15 minutes
        freeSlots.push({
          start: new Date(habitEndTime),
          end: new Date(slotEnd),
          duration: afterDuration,
        });
      }
    }
  },
};
