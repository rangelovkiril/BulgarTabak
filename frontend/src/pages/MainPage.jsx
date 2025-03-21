import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/mainPage.css";
import Header from "../components/common/Header";

const MainPage = () => {
  const [events, setEvents] = useState([]);

  // Load events from localStorage when component mounts
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    setEvents(savedEvents);
  }, []);

  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
  };

  const handleAddEvent = (event) => {
    setEvents([
      ...events,
      {
        title: event.title,
        start: event.start,
        end: event.end,
      },
    ]);
  };

  const handleEventClick = (clickInfo) => {
    const updatedEvents = events.filter(
      (event) => event.id !== clickInfo.event.id
    );
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleDelete = (e, eventId) => {
    e.stopPropagation();
    const updatedEvents = events.filter((event) => event.id !== eventId);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const sortedEvents = events.sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    selectable: true,
    dateClick: handleDateClick,
    events: events,
    eventClick: handleEventClick,
    height: "auto",
    eventContent: renderEventContent,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek",
    },
    eventTimeFormat: {
      hour: undefined,
      minute: undefined,
      meridiem: false,
    },
    dayMaxEvents: 3,
    moreLinkContent: (args) => `+${args.num} more`,
    eventDisplay: "block",
    nowIndicator: true,
    views: {
      dayGridMonth: {
        titleFormat: { year: "numeric", month: "long" },
      },
    },
  };

  return (
    <div className="main-container">
      <Header />
      <section className="calendar-section">
        <FullCalendar {...calendarOptions} />
      </section>

      <section className="schedule-section">
        <h2>Your Schedule</h2>
        <div className="events-list">
          {sortedEvents.map((event, index) => (
            <div
              key={index}
              className="event-item"
              onClick={() => navigate(`/event/edit/${event.id}`)}
            >
              <div className="event-item-content">
                <h3>{event.title}</h3>
                <p className="event-time">
                  {new Date(event.start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(event.end).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="event-date">
                  {new Date(event.start).toLocaleDateString()}
                </p>
              </div>
              <div className="event-actions">
                <button
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/event/edit/${event.id}`);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={(e) => handleDelete(e, event.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        className="floating-action-button"
        onClick={() => navigate("/event")}
      >
        +
      </button>
    </div>
  );
};

// Add this function to customize event rendering
const renderEventContent = (eventInfo) => {
  return (
    <div className="calendar-event">
      <div className="event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default MainPage;
