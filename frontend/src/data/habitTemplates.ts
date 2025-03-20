import { HabitTemplate, HabitType } from "../types/habits";

export const habitTemplates: HabitTemplate[] = [
  {
    id: "sleep",
    type: HabitType.SLEEP,
    name: "Better Sleep Schedule",
    description: "Develop a consistent sleep schedule",
    initialGoalHours: 6,
    finalGoalHours: 8,
    gradualIncreaseWeeks: 4,
  },
  {
    id: "workout",
    type: HabitType.WORKOUT,
    name: "Regular Exercise",
    description: "Build a consistent workout routine",
    initialGoalHours: 1,
    finalGoalHours: 2,
    gradualIncreaseWeeks: 8,
  },
  {
    id: "language",
    type: HabitType.STUDY,
    name: "Language Learning",
    description: "Study a new language daily",
    initialGoalHours: 1,
    finalGoalHours: 2,
    gradualIncreaseWeeks: 6,
  },
  {
    id: "reading",
    type: HabitType.READING,
    name: "Reading",
    description: "Read books regularly",
    initialGoalHours: 0.5,
    finalGoalHours: 1,
    gradualIncreaseWeeks: 4,
  },
  {
    id: "meditation",
    type: HabitType.MEDITATION,
    name: "Meditation",
    description: "Daily mindfulness practice",
    initialGoalHours: 0.25,
    finalGoalHours: 1,
    gradualIncreaseWeeks: 8,
  },
  // Add 15 more habits here...
];
