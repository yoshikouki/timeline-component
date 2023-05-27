"use client";

import React, { useState } from "react";

interface Datetime {
  hour: number;
  minute: number;
}

interface EventTime {
  start: Datetime;
  end: Datetime;
}

const formatTime = (datetime: Datetime) => {
  const formattedHour =
    datetime.hour < 10 ? `0${datetime.hour}` : `${datetime.hour}`;
  const formattedMinute =
    datetime.minute < 10 ? `0${datetime.minute}` : `${datetime.minute}`;
  return `${formattedHour}:${formattedMinute}`;
};

export default function Timeline() {
  const [time, setTime] = useState<Partial<EventTime>>({
    start: undefined,
    end: undefined,
  });
  const [timeUnit, setTimeUnit] = useState<number>(10);
  const [schedule, setSchedule] = useState<EventTime[]>([]);

  const handleTimeClick = (hour: number, minute: number) => {
    const datetime: Datetime = { hour, minute };

    if (!time.start) {
      setTime({ ...time, start: datetime });
    } else if (!time.end) {
      setTime({ ...time, end: datetime });
      setSchedule([...schedule, { start: time.start, end: datetime }]);
      setTime({ start: undefined, end: undefined });
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4">
        <label htmlFor="time-unit">Time Unit:</label>
        <select
          id="time-unit"
          value={timeUnit}
          onChange={(e) => setTimeUnit(Number(e.target.value))}
          className="ml-2"
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        <div>
          {Array.from({ length: (24 * 60) / timeUnit }, (_, i) => {
            const hour = Math.floor((i * timeUnit) / 60);
            const minute = (i * timeUnit) % 60;
            return (
              <div
                key={i}
                onClick={() => handleTimeClick(hour, minute)}
                className="my-2 cursor-pointer"
              >
                {formatTime({ hour, minute })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 p-4">
        <h2 className="mb-4">Schedule:</h2>
        {schedule.map((item, i) => (
          <div key={i}>
            {`Schedule ${i + 1}: Start at ${formatTime(item.start)}, End at ${formatTime(item.end)}`}
          </div>
        ))}
      </div>
    </div>
  );
}
