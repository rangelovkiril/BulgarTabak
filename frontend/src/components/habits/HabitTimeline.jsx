import React from "react";
import PropTypes from "prop-types";
import "./HabitTimeline.css";

const HabitTimeline = ({ habits, events }) => {
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getAvailableSlots = () => {
    const busySlots = events.map((event) => ({
      start: new Date(event.startTime).getHours(),
      end: new Date(event.endTime).getHours(),
    }));

    return timeSlots.filter(
      (slot) => !busySlots.some((busy) => slot >= busy.start && slot < busy.end)
    );
  };

  const availableSlots = getAvailableSlots();

  return (
    <div className="habit-timeline">
      <div className="timeline-header">
        <h3>Available Time Slots for Habits</h3>
      </div>

      <div className="timeline-grid">
        {timeSlots.map((hour) => (
          <div
            key={hour}
            className={`timeline-slot ${
              availableSlots.includes(hour) ? "available" : "busy"
            }`}
          >
            <span className="time-label">{`${hour}:00`}</span>
            {availableSlots.includes(hour) && (
              <div className="habit-suggestions">
                {habits
                  .filter((habit) =>
                    habit.timePreferences.some(
                      (pref) =>
                        hour >= parseInt(pref.startTime) &&
                        hour < parseInt(pref.endTime)
                    )
                  )
                  .map((habit) => (
                    <div key={habit.id} className="habit-suggestion">
                      {habit.name}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

HabitTimeline.propTypes = {
  habits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      timePreferences: PropTypes.arrayOf(
        PropTypes.shape({
          startTime: PropTypes.string.isRequired,
          endTime: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default HabitTimeline;
