export enum HabitType {
  SLEEP = "sleep",
  WORKOUT = "workout",
  STUDY = "study",
  MEDITATION = "meditation",
  READING = "reading",
  CREATIVE = "creative",
  PRODUCTIVITY = "productivity",
}

export interface TimePreference {
  startTime: string;
  endTime: string;
  daysOfWeek: number[]; // 0-6, where 0 is Sunday
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
  timePreferences: TimePreference[];
  minimumDuration: number; // in minutes
  idealDuration: number; // in minutes
  flexibility: "strict" | "moderate" | "flexible";
}

export interface UserHabit extends HabitTemplate {
  userId: string;
  currentGoalHours: number;
  startDate: Date;
  progress: {
    date: Date;
    completedHours: number;
  }[];
  lastCompleted?: Date;
  nextScheduled?: Date;
  completionRate: number;
}
