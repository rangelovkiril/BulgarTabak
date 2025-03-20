export enum HabitType {
  SLEEP = "sleep",
  WORKOUT = "workout",
  STUDY = "study",
  MEDITATION = "meditation",
  READING = "reading",
  CREATIVE = "creative",
  PRODUCTIVITY = "productivity",
}

export interface HabitTemplate {
  id: string;
  type: HabitType;
  name: string;
  description: string;
  initialGoalHours: number;
  finalGoalHours: number;
  gradualIncreaseWeeks: number;
  preferredTimeRanges?: {
    start: string;
    end: string;
  }[];
}

export interface UserHabit extends HabitTemplate {
  userId: string;
  currentGoalHours: number;
  startDate: Date;
  progress: {
    date: Date;
    completedHours: number;
  }[];
}
