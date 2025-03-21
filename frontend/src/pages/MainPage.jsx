import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/mainPage.css";
import Header from "../components/common/Header";

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    setEvents(savedEvents);
  }, []);

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
    // Store the complete ISO date string
    setSelectedDate(clickedDate);
  };

  const handleAddEvent = () => {
    const formattedDate =
      selectedDate instanceof Date
        ? selectedDate.toISOString().slice(0, 10)
        : new Date(selectedDate).toISOString().slice(0, 10);
    navigate(`/event?date=${formattedDate}`); // Changed to match route in App.jsx
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

  const getEventsForSelectedDate = () => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.start).toDateString();
        const selected = new Date(selectedDate).toDateString();
        return eventDate === selected;
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className="calendar-event">
        <div className="event-title">{eventInfo.event.title}</div>
      </div>
    );
  };

  const formatEventTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    });
  };

  const renderDayCellContent = (arg) => {
    const date = arg.date;
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });

    const eventCount = dayEvents.length;

    return (
      <div className="day-cell-content">
        <span className="day-number">{arg.dayNumberText}</span>
        {eventCount > 0 && <div className="event-indicator">{eventCount}</div>}
      </div>
    );
  };

  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    selectable: true,
    selectConstraint: {
      start: new Date().setHours(0, 0, 0, 0), // Today
    },
    validRange: null, // Remove the date restriction
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
      // Remove time display from calendar cells
      hour: undefined,
      minute: undefined,
      meridiem: false,
    },
    dayMaxEvents: true, // When too many events, show the "+more" link
    moreLinkContent: (args) => `+${args.num} more`,
    eventDisplay: "none", // Hide the actual events
    dayMaxEvents: false, // Disable the more link
    nowIndicator: true,
    views: {
      dayGridMonth: {
        titleFormat: { year: "numeric", month: "long" },
      },
    },
    dayCellContent: renderDayCellContent,
  };

  return (
    <div className="main-container">
      <Header />
      <section className="calendar-section">
        <FullCalendar {...calendarOptions} />
      </section>

      <section className="schedule-section">
        <h2>Schedule for {new Date(selectedDate).toLocaleDateString()}</h2>
        <div className="events-list">
          {getEventsForSelectedDate().length > 0 ? (
            getEventsForSelectedDate().map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-item-content">
                  <h3>{event.title}</h3>
                  <div className="event-details">
                    <span className="event-time">
                      {formatEventTime(event.start)} -{" "}
                      {formatEventTime(event.end)}
                    </span>
                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}
                  </div>
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
            ))
          ) : (
            <div className="no-events">
              <p>No events scheduled for this day</p>
            </div>
          )}
        </div>
      </section>

      <button
        className="floating-action-button"
        style={{
          display:
            new Date(selectedDate) < new Date().setHours(0, 0, 0, 0)
              ? "none"
              : "flex",
        }}
        onClick={handleAddEvent}
      >
        +
      </button>
    </div>
  );
};

export default MainPage;
