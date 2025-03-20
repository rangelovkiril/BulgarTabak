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
  },

  // Exercise Habit
  {
    id: "workout",
    type: HabitType.WORKOUT,
    name: "Training",
    description: "Regular physical exercise and training",
    initialGoalHours: 1,
    finalGoalHours: 2,
    gradualIncreaseWeeks: 8,
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
  },
  {
    id: "programming",
    type: HabitType.STUDY,
    name: "Programming Practice",
    description: "Coding and development skills",
    initialGoalHours: 1,
    finalGoalHours: 3,
    gradualIncreaseWeeks: 8,
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
  },
  {
    id: "drawing",
    type: HabitType.CREATIVE,
    name: "Drawing/Art",
    description: "Practice artistic skills",
    initialGoalHours: 0.5,
    finalGoalHours: 1,
    gradualIncreaseWeeks: 6,
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
  },

  // Cooking Habits
  {
    id: "meal-prep",
    type: HabitType.COOKING,
    name: "Meal Preparation",
    description: "Cook healthy meals and prepare food for the week",
    initialGoalHours: 1,
    finalGoalHours: 2,
    gradualIncreaseWeeks: 4,
    preferredTimeRanges: [
      { start: "10:00", end: "14:00" },
      { start: "16:00", end: "19:00" },
    ],
  },
];
