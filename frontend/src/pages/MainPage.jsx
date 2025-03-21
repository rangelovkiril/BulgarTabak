import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/mainPage.css";
import Header from "../components/common/Header";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { eventService } from "../services/events";
import { habitService } from "../services/habits";
import { auth } from "../firebase/firebase";

const MainPage = () => {
  // State declarations
  const [events, setEvents] = useState([]);
  const [habits, setHabits] = useState([]);
  const [suggestedHabits, setSuggestedHabits] = useState([]);
  const [showSuggestedHabits, setShowSuggestedHabits] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionFeedback, setCompletionFeedback] = useState({
    show: false,
    points: 0,
    habitName: "",
    newAchievements: [],
  });
  const [debugMode, setDebugMode] = useState(false);
  const navigate = useNavigate();

  // Function to fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch events and habits
      try {
        const [fetchedEvents, fetchedHabits] = await Promise.all([
          eventService.getEvents(),
          habitService.getUserHabits(),
        ]);

        // Set regular events
        setEvents(fetchedEvents);

        // Set user habits
        setHabits(fetchedHabits);

        // Schedule habits in free time slots
        if (fetchedHabits.length > 0) {
          try {
            const scheduledHabits = habitService.scheduleHabits(
              fetchedEvents,
              fetchedHabits,
              selectedDate
            );
            setSuggestedHabits(scheduledHabits);
          } catch (scheduleErr) {
            console.error("Error scheduling habits:", scheduleErr);
            setSuggestedHabits([]);
          }
        }
      } catch (err) {
        console.log("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Update habit schedule when selectedDate, habits, or events change
  useEffect(() => {
    const updateSchedule = () => {
      if (habits.length > 0) {
        try {
          const futureSuggestions = habitService.scheduleHabits(
            events,
            habits,
            selectedDate
          );
          setSuggestedHabits(futureSuggestions);
        } catch (err) {
          console.error("Error scheduling habits:", err);
        }
      }
    };

    updateSchedule();
  }, [selectedDate, habits, events]);

  // Refresh data when page gets focus
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  // Event handlers
  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.date);
    setSelectedDate(clickedDate);
  };

  const handleAddEvent = () => {
    const formattedDate =
      selectedDate instanceof Date
        ? selectedDate.toISOString().slice(0, 10)
        : new Date(selectedDate).toISOString().slice(0, 10);
    navigate(`/event?date=${formattedDate}`);
  };

  const handleEventClick = async (clickInfo) => {
    try {
      await eventService.deleteEvent(clickInfo.event.id);
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDelete = async (e, eventId) => {
    e.stopPropagation();
    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleCompleteHabit = async (e, item) => {
    e.stopPropagation();
    try {
      setIsLoading(true);

      // Calculate duration in hours
      const durationHours =
        (new Date(item.end) - new Date(item.start)) / (1000 * 60 * 60);

      // Call the enhanced complete habit function
      const result = await habitService.completeHabit(
        item.habitId,
        durationHours
      );

      // Show completion feedback with points
      setCompletionFeedback({
        show: true,
        points: result.pointsEarned,
        habitName: item.title,
        newAchievements: result.updatedHabit.newAchievements,
      });

      // Refresh data after a short delay to show the feedback
      setTimeout(() => {
        fetchData();
        setCompletionFeedback((prev) => ({ ...prev, show: false }));
      }, 2000);
    } catch (error) {
      console.error("Error completing habit:", error);
      setError("Failed to complete habit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calendar-related functions
  const getEventsForSelectedDate = () => {
    const allItems = getAllItems();
    return allItems
      .filter((item) => {
        const itemDate = new Date(item.start).toDateString();
        const selected = new Date(selectedDate).toDateString();
        return itemDate === selected;
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  const formatHabitProgress = (habit) => {
    if (!habit.targetHours) return "";

    // Find the habit in our habits list to get complete details
    const fullHabit = habits.find((h) => h.id === habit.habitId);
    if (!fullHabit) return `${habit.targetHours}h goal`;

    // Show current vs final goal
    return `Progress: ${habit.targetHours}h/${fullHabit.finalGoalHours}h`;
  };

  const renderEventContent = (eventInfo) => {
    const isHabit = eventInfo.event.extendedProps.isHabit;

    return (
      <div className={`calendar-event ${isHabit ? "habit-event" : ""}`}>
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
    const dayEvents = events.filter((event) => {
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

  const getAllItems = () => {
    // Combine regular events and suggested habits if enabled
    return [...events, ...(showSuggestedHabits ? suggestedHabits : [])];
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
    events: getAllItems(),
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
    dayMaxEvents: true, // When too many events, show the "+more" link
    moreLinkContent: (args) => `+${args.num} more`,
    eventDisplay: "none", // Hide the actual events
    nowIndicator: true,
    views: {
      dayGridMonth: {
        titleFormat: { year: "numeric", month: "long" },
      },
    },
    dayCellContent: renderDayCellContent,
    eventClassNames: (arg) => {
      return arg.event.extendedProps.isHabit ? "habit-event" : "";
    },
  };

  const debugRescheduleHabits = () => {
    try {
      console.log("Current habits:", habits);
      console.log("Current events:", events);

      // Force local mode
      localStorage.setItem("localMode", "true");

      // Ensure a Training habit exists
      const trainingHabit = habits.find((h) => h.name === "Training");

      if (!trainingHabit) {
        const newTrainingHabit = {
          id: `workout-${Date.now()}`,
          type: "WORKOUT",
          name: "Training",
          description: "Regular physical exercise and training",
          finalGoalHours: 1.5,
          initialGoalHours: 0.5,
          gradualIncreaseWeeks: 4,
          currentProgress: 0,
          streak: 0,
          forceDaily: true,
          startDate: new Date().toISOString(),
          completionHistory: [],
          timePreferences: [
            {
              startTime: "06:00",
              endTime: "10:00",
              daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
            },
            {
              startTime: "16:00",
              endTime: "20:00",
              daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
            },
          ],
        };

        console.log("Adding Training habit:", newTrainingHabit);

        // Add to localStorage
        const userHabits = JSON.parse(
          localStorage.getItem("userHabits") || "[]"
        );
        userHabits.push(newTrainingHabit);
        localStorage.setItem("userHabits", JSON.stringify(userHabits));

        // Update state
        setHabits([...habits, newTrainingHabit]);
      }

      // Force reschedule
      const updatedHabits = habits.map((h) => {
        if (h.name === "Training") {
          return { ...h, forceDaily: true };
        }
        return h;
      });

      console.log("Rescheduling with habits:", updatedHabits);

      const scheduledHabits = habitService.scheduleHabits(
        events,
        updatedHabits,
        selectedDate
      );

      console.log("New scheduled habits:", scheduledHabits);
      setSuggestedHabits(scheduledHabits);
    } catch (error) {
      console.error("Debug rescheduling error:", error);
    }
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
            getEventsForSelectedDate().map((item, index) => (
              <div
                key={index}
                className={`event-item ${item.isHabit ? "habit-item" : ""}`}
                style={
                  item.isHabit
                    ? { borderLeftColor: item.color || "#9C27B0" }
                    : {}
                }
                data-type={item.isHabit ? item.habitType : null}
              >
                <div className="event-item-content">
                  <h3>{item.title}</h3>
                  <div className="event-details">
                    <span className="event-time">
                      {formatEventTime(item.start)} -{" "}
                      {formatEventTime(item.end)}
                    </span>
                    {item.description && (
                      <p className="event-description">{item.description}</p>
                    )}
                    {item.isHabit && (
                      <div className="habit-progress-info">
                        <p>
                          {item.currentGoalText || formatHabitProgress(item)}
                        </p>
                        {item.targetHours < item.finalGoalHours && (
                          <div className="progress-bar">
                            <div
                              className="progress-value"
                              style={{
                                width: `${
                                  (item.targetHours / item.finalGoalHours) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="event-actions">
                  {item.isHabit ? (
                    // Show complete button for habits
                    <button
                      className="complete-button"
                      onClick={(e) => handleCompleteHabit(e, item)}
                    >
                      Complete
                    </button>
                  ) : (
                    <>
                      <button
                        className="edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/event/edit/${item.id}`);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={(e) => handleDelete(e, item.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">
              <p>No events or habits scheduled for this day</p>
            </div>
          )}
        </div>
      </section>

      <div className="habit-toggle">
        <label>
          <input
            type="checkbox"
            checked={showSuggestedHabits}
            onChange={() => setShowSuggestedHabits(!showSuggestedHabits)}
          />
          Show Suggested Habits
        </label>
      </div>

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

      {completionFeedback.show && (
        <div className="completion-feedback">
          <div className="points-earned">
            <span>+{completionFeedback.points}</span>
            <span className="points-label">points</span>
          </div>
          <p>{completionFeedback.habitName} completed!</p>
          {completionFeedback.newAchievements?.length > 0 && (
            <div className="new-achievements">
              <p>New achievements unlocked!</p>
              {completionFeedback.newAchievements.map((achievement) => (
                <div key={achievement.id} className="achievement-unlocked">
                  <span className="achievement-icon">{achievement.icon}</span>
                  <span className="achievement-title">{achievement.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Debug button - Add this near the end of your return statement */}
      <button
        className="debug-button"
        style={{
          position: "fixed",
          bottom: "10px",
          left: "10px",
          padding: "8px",
          background: "#f0f0f0",
          border: "1px solid #ccc",
          borderRadius: "4px",
          opacity: debugMode ? "1" : "0.3",
          zIndex: 1000,
        }}
        onClick={() => {
          if (!debugMode) {
            setDebugMode(true);
          } else {
            debugRescheduleHabits();
          }
        }}
      >
        {debugMode ? "Rescue Training" : "Debug"}
      </button>
    </div>
  );
};

export default MainPage;
