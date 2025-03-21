import api from "./api";

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
}

export const eventService = {
  async getEvents(): Promise<Event[]> {
    const response = await api.get("/events");
    return response.data;
  },

  async createEvent(event: Omit<Event, "id">): Promise<Event> {
    const response = await api.post("/events", event);
    return response.data;
  },

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    const response = await api.put(`/events/${id}`, event);
    return response.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
};
