import api from "./api";
import { HabitTemplate, UserHabit } from "../types/habits";

export const habitService = {
  async getHabitTemplates(): Promise<HabitTemplate[]> {
    const response = await api.get("/habits/templates");
    return response.data;
  },

  async getUserHabits(): Promise<UserHabit[]> {
    const response = await api.get("/habits/user");
    return response.data;
  },

  async scheduleHabit(
    habitId: string,
    timeSlot: { date: Date; startTime: string; endTime: string }
  ) {
    const response = await api.post(`/habits/${habitId}/schedule`, timeSlot);
    return response.data;
  },

  async completeHabit(habitId: string, duration: number) {
    const response = await api.post(`/habits/${habitId}/complete`, {
      duration,
    });
    return response.data;
  },
};
