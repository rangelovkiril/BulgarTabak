import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/eventForm.css";

const EventForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
  });

  useEffect(() => {
    if (eventId) {
      const events = JSON.parse(localStorage.getItem("events") || "[]");
      const event = events.find((e) => e.id === Number(eventId));

      if (event) {
        const date = new Date(event.start).toISOString().split("T")[0];
        const startTime = new Date(event.start).toTimeString().slice(0, 5);
        const endTime = new Date(event.end).toTimeString().slice(0, 5);

        setEventData({
          title: event.title,
          date,
          startTime,
          endTime,
        });
      }
    }
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const events = JSON.parse(localStorage.getItem("events") || "[]");

    const newEvent = {
      id: eventId ? Number(eventId) : Date.now(),
      title: eventData.title,
      start: `${eventData.date}T${eventData.startTime}`,
      end: `${eventData.date}T${eventData.endTime}`,
    };

    if (eventId) {
      // Update existing event
      const updatedEvents = events.map((event) =>
        event.id === Number(eventId) ? newEvent : event
      );
      localStorage.setItem("events", JSON.stringify(updatedEvents));
    } else {
      // Add new event
      localStorage.setItem("events", JSON.stringify([...events, newEvent]));
    }

    navigate("/main");
  };

  return (
    <div className="event-form-container">
      <header className="event-form-header">
        <h1>{eventId ? "Edit Event" : "Create New Event"}</h1>
        <p>Schedule your time effectively</p>
      </header>

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            value={eventData.title}
            onChange={(e) =>
              setEventData({ ...eventData, title: e.target.value })
            }
            placeholder="Enter event name"
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={eventData.date}
            onChange={(e) =>
              setEventData({ ...eventData, date: e.target.value })
            }
            required
          />
        </div>

        <div className="time-range">
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              value={eventData.startTime}
              onChange={(e) =>
                setEventData({ ...eventData, startTime: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={eventData.endTime}
              onChange={(e) =>
                setEventData({ ...eventData, endTime: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/main")}
          >
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {eventId ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
