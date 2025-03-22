import { HabitTemplate, HabitType } from "../types/habits";

export const habitTemplates: HabitTemplate[] = [
  // Sleep Habit
  {
    id: "sleep-schedule",
    type: HabitType.SLEEP,
    name: "Better Sleep Schedule",
    description: "Develop a consistent sleep schedule for better rest",
    initialGoalHours: 6,
    finalGoalHours: 8,
    gradualIncreaseWeeks: 4,
    preferredTimeRanges: [{ start: "22:00", end: "08:00" }],
    // Add missing properties
    timePreferences: [
      {
        startTime: "22:00",
        endTime: "08:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    minimumDuration: 360, // 6 hours in minutes
    idealDuration: 480, // 8 hours in minutes
    flexibility: "moderate",
  },

  // Exercise Habit - Updated for better time windows
  {
    id: "workout",
    type: HabitType.WORKOUT,
    name: "Training",
    description: "Regular physical exercise and training",
    initialGoalHours: 0.5, // Start with an easier goal
    finalGoalHours: 1.5, // Build up to 1.5 hours
    gradualIncreaseWeeks: 3, // Faster progression
    timePreferences: [
      // Morning option (every day)
      {
        startTime: "06:00",
        endTime: "10:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
      // Afternoon option (every day)
      {
        startTime: "16:00",
        endTime: "20:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    minimumDuration: 30, // 30 minutes
    idealDuration: 60, // 1 hour in minutes
    flexibility: "flexible",
  },

  // Study Habits
  {
    id: "language-learning",
    type: HabitType.STUDY,
    name: "Language Learning",
    description: "Study a new language daily",
    initialGoalHours: 0.5,
    finalGoalHours: 2,
    gradualIncreaseWeeks: 8,
    // Add missing properties
    timePreferences: [
      {
        startTime: "10:00",
        endTime: "20:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    minimumDuration: 15, // 15 minutes
    idealDuration: 60, // 1 hour in minutes
    flexibility: "flexible",
  },
  {
    id: "programming",
    type: HabitType.STUDY,
    name: "Programming Practice",
    description: "Coding and development skills",
    initialGoalHours: 1,
    finalGoalHours: 3,
    gradualIncreaseWeeks: 8,
    // Add missing properties
    timePreferences: [
      {
        startTime: "09:00",
        endTime: "21:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    minimumDuration: 30, // 30 minutes
    idealDuration: 120, // 2 hours in minutes
    flexibility: "flexible",
  },

  // Reading Habit
  {
    id: "reading",
    type: HabitType.READING,
    name: "Reading",
    description: "Regular reading practice",
    initialGoalHours: 0.5,
    finalGoalHours: 2,
    gradualIncreaseWeeks: 4,
    // Add missing properties
    timePreferences: [
      {
        startTime: "08:00",
        endTime: "22:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    minimumDuration: 15, // 15 minutes
    idealDuration: 60, // 1 hour in minutes
    flexibility: "flexible",
  },

  // Mindfulness Habits
  {
    id: "meditation",
    type: HabitType.MEDITATION,
    name: "Meditation",
    description: "Daily mindfulness practice",
    initialGoalHours: 0.25,
    finalGoalHours: 1,
    gradualIncreaseWeeks: 8,
    // Add missing properties
    timePreferences: [
      {
        startTime: "06:00",
        endTime: "09:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        startTime: "20:00",
        endTime: "23:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    minimumDuration: 10, // 10 minutes
    idealDuration: 30, // 30 minutes
    flexibility: "strict",
  },

  // Creative Habits
  {
    id: "music-practice",
    type: HabitType.CREATIVE,
    name: "Music Practice",
    description: "Learn or practice an instrument",
    initialGoalHours: 0.5,
    finalGoalHours: 1.5,
    gradualIncreaseWeeks: 8,
    // Add missing properties
    timePreferences: [
      {
        startTime: "10:00",
        endTime: "22:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    minimumDuration: 20, // 20 minutes
    idealDuration: 60, // 1 hour in minutes
    flexibility: "moderate",
  },
  {
    id: "drawing",
    type: HabitType.CREATIVE,
    name: "Drawing/Art",
    description: "Practice artistic skills",
    initialGoalHours: 0.5,
    finalGoalHours: 1,
    gradualIncreaseWeeks: 6,
    // Add missing properties
    timePreferences: [
      {
        startTime: "10:00",
        endTime: "22:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    minimumDuration: 15, // 15 minutes
    idealDuration: 45, // 45 minutes
    flexibility: "flexible",
  },

  // Productivity Habits
  {
    id: "deep-work",
    type: HabitType.PRODUCTIVITY,
    name: "Deep Work",
    description: "Focused work sessions",
    initialGoalHours: 1,
    finalGoalHours: 4,
    gradualIncreaseWeeks: 8,
    // Add missing properties
    timePreferences: [
      { startTime: "08:00", endTime: "18:00", daysOfWeek: [1, 2, 3, 4, 5] },
    ],
    minimumDuration: 45, // 45 minutes
    idealDuration: 120, // 2 hours in minutes
    flexibility: "strict",
  },
];
