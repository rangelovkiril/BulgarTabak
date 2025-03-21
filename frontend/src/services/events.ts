import { firestoreService } from "./firestore";
import { localDataService } from "./localData";
import { auth } from "../firebase/firebase";

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
}

export const eventService = {
  async getEvents(): Promise<Event[]> {
    // Check if user is authenticated with Firebase
    if (auth.currentUser) {
      return firestoreService.getEvents();
    } else if (localStorage.getItem("localMode") === "true") {
      // Use local storage in demo mode
      return localDataService.getEvents();
    } else {
      throw new Error("Not authenticated");
    }
  },

  async createEvent(event: Omit<Event, "id">): Promise<Event> {
    if (auth.currentUser) {
      return firestoreService.createEvent(event);
    } else if (localStorage.getItem("localMode") === "true") {
      return localDataService.saveEvent(event);
    } else {
      throw new Error("Not authenticated");
    }
  },

  async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    if (auth.currentUser) {
      return firestoreService.updateEvent(id, event);
    } else if (localStorage.getItem("localMode") === "true") {
      return localDataService.updateEvent(id, event);
    } else {
      throw new Error("Not authenticated");
    }
  },

  async deleteEvent(id: string): Promise<void> {
    if (auth.currentUser) {
      await firestoreService.deleteEvent(id);
    } else if (localStorage.getItem("localMode") === "true") {
      localDataService.deleteEvent(id);
    } else {
      throw new Error("Not authenticated");
    }
  },
};
