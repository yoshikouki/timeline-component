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

const formatTime = (time: number) => (time < 10 ? `0${time}` : `${time}`);
const formatDateTime = (datetime: Datetime) => {
  return `${formatTime(datetime.hour)}:${formatTime(datetime.minute)}`;
};

export default function Timeline() {
  const [time, setTime] = useState<Partial<EventTime>>({
    start: undefined,
    end: undefined,
  });
  const [timeUnit, setTimeUnit] = useState<number>(15);
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
    <>
      <div>
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
      </div>

      <div className="relative h-full">
        <div className="grid auto-cols-auto grid-rows-24 gap-0 absolute w-full">
          {Array.from({ length: 24 }, (_, hour) => {
            return (
              <div
                onClick={() => handleTimeClick(hour, 0)}
                key={`hour-${hour}`}
                className="h-20 border-t cursor-pointer "
              >
                {formatTime(hour)}
              </div>
            );
          })}
        </div>

        <div className="grid auto-cols-auto grid-rows-24 absolute gap-0 w-full">
          {Array.from({ length: 24 }, (_, hour) => {
            return (
              <div
                key={`minute-${hour}`}
                className="h-20 flex flex-col"
              >
                {Array.from({ length: 60 / timeUnit }, (_, minuteIndex) => {
                  const minute = minuteIndex * timeUnit;
                  return (
                    <div
                      key={`hour-${hour}-minute-${minute}`}
                      onClick={() => handleTimeClick(hour, minute)}
                      className="cursor-pointer flex-grow"
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
