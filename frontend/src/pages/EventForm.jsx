import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/eventForm.css";
import { eventService } from "../services/events"; // Missing import
import LoadingSpinner from "../components/common/LoadingSpinner";

const EventForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Get the date from URL parameters
  const urlDate = new URLSearchParams(location.search).get("date");
  const today = new Date().toISOString().split("T")[0];

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: urlDate || today,
    startTime: "09:00",
    endTime: "10:00",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        try {
          // Get events from service instead of localStorage
          const events = await eventService.getEvents();
          const event = events.find((e) => e.id === eventId);

          if (event) {
            const date = new Date(event.start).toISOString().split("T")[0];
            const startTime = new Date(event.start).toTimeString().slice(0, 5);
            const endTime = new Date(event.end).toTimeString().slice(0, 5);

            setEventData({
              title: event.title,
              description: event.description || "",
              date,
              startTime,
              endTime,
            });
          }
        } catch (error) {
          console.error("Error fetching event:", error);
          setError("Failed to load event details");
        }
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Format the data for the service
      const formattedEvent = {
        title: eventData.title,
        description: eventData.description,
        start: `${eventData.date}T${eventData.startTime}:00`,
        end: `${eventData.date}T${eventData.endTime}:00`,
      };

      console.log("Submitting event:", formattedEvent);

      if (eventId) {
        // Update existing event
        await eventService.updateEvent(eventId, formattedEvent);
      } else {
        // Create new event
        await eventService.createEvent(formattedEvent);
      }

      // Navigate back to main page
      navigate("/main");
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Failed to save event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingSpinner />;
  }

  return (
    <div className="event-form-container">
      <header className="event-form-header">
        <h1>{eventId ? "Edit Event" : "Create New Event"}</h1>
        <p>Schedule your time effectively</p>
      </header>

      {error && <div className="error-message">{error}</div>}

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
          <label>Description</label>
          <textarea
            value={eventData.description}
            onChange={(e) =>
              setEventData({ ...eventData, description: e.target.value })
            }
            placeholder="Enter event description"
            rows={3}
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
            min={today} // Restrict to today and future dates
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
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {eventId ? "Update Event" : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
