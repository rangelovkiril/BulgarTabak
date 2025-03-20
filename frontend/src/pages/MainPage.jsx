import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/mainPage.css";

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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
    if (window.confirm(`Delete event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  };

  return (
    <div className="main-container">
      <section className="calendar-section">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          dateClick={handleDateClick}
          events={events}
          eventClick={handleEventClick}
          height="auto"
        />
      </section>

      <section className="schedule-section">
        <h2>
          Schedule for{" "}
          {selectedDate ? selectedDate.toLocaleDateString() : "Today"}
        </h2>
        <div className="events-list">
          {events
            .filter(
              (event) =>
                selectedDate &&
                new Date(event.start).toDateString() ===
                  selectedDate.toDateString()
            )
            .map((event, index) => (
              <div key={index} className="event-item">
                <h3>{event.title}</h3>
                <p>
                  {new Date(event.start).toLocaleTimeString()} -{" "}
                  {new Date(event.end).toLocaleTimeString()}
                </p>
              </div>
            ))}
        </div>
        {selectedDate && (
          <button
            className="add-event-button"
            onClick={() => {
              const title = prompt("Enter event title");
              if (title) {
                handleAddEvent({
                  title,
                  start: selectedDate,
                  end: new Date(selectedDate.getTime() + 3600000),
                });
              }
            }}
          >
            Add Event
          </button>
        )}
      </section>
    </div>
  );
};

export default MainPage;
