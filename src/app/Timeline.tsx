"use client";

import React, { useState } from "react";
import { addMinutes, subMinutes } from "date-fns";

interface Datetime {
  hour: number;
  minute: number;
}

interface EventTime {
  start: Datetime;
  end: Datetime;
}

interface Event extends EventTime {
  id: number;
}

const formatTime = (time: number) => (time < 10 ? `0${time}` : `${time}`);
const formatDateTime = (datetime: Datetime) => {
  return `${formatTime(datetime.hour)}:${formatTime(datetime.minute)}`;
};

const datetimeToJsDate = (datetime: Datetime) => {
  const date = new Date();
  date.setHours(datetime.hour);
  date.setMinutes(datetime.minute);
  return date;
};
const datetimeToMinutes = (datetime: Datetime) => {
  return datetime.hour * 60 + datetime.minute;
}

const addMinutesToDatetime = (
  datetime: Datetime,
  minutesToAdd: number
): Datetime => {
  const jsDate = datetimeToJsDate(datetime);
  const newJsDate = addMinutes(jsDate, minutesToAdd);
  return {
    hour: newJsDate.getHours(),
    minute: newJsDate.getMinutes(),
  };
};
const subMinutesToDatetime = (
  datetime: Datetime,
  minutesToAdd: number
): Datetime => {
  const jsDate = datetimeToJsDate(datetime);
  const newJsDate = subMinutes(jsDate, minutesToAdd);
  return {
    hour: newJsDate.getHours(),
    minute: newJsDate.getMinutes(),
  };
};

export default function Timeline() {
  const [time, setTime] = useState<Partial<EventTime>>({
    start: undefined,
    end: undefined,
  });
  const [timeUnit, setTimeUnit] = useState<number>(15);
  const [events, setEvents] = useState<Event[]>([]);

  const handleTimeClick = (hour: number, minute: number) => {
    const clickedDatetime: Datetime = { hour, minute };
    if (!time.start) {
      setTime({ ...time, start: clickedDatetime });
    } else if (!time.end) {
      let newEventDatetime: EventTime
      const storedMinutes = datetimeToMinutes(time.start);
      const clickedMinutes = datetimeToMinutes(clickedDatetime);
      if (storedMinutes <= clickedMinutes) {
        newEventDatetime = {
          start: time.start,
          end: addMinutesToDatetime(clickedDatetime, timeUnit),
        };
      } else {
        newEventDatetime = {
          start: clickedDatetime,
          end: addMinutesToDatetime(time.start, timeUnit),
        };
      }
      setEvents([...events, { id: events.length + 1, ...newEventDatetime }]);
      setTime({ start: undefined, end: undefined });
    } else {
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

      <div className="h-screen overflow-y-auto">
        <div className="relative h-full">
          <div className="absolute grid auto-cols-auto grid-rows-[1440] gap-0 w-full">
            {Array.from({ length: 24 }, (_, hour) => {
              return (
                <div
                  onClick={() => handleTimeClick(hour, 0)}
                  key={`hour-${hour}`}
                  className="border-t cursor-pointer row-span-60"
                  style={{ height: 120 }}
                >
                  {formatTime(hour)}
                </div>
              );
            })}
          </div>

          <div className="absolute grid auto-cols-auto grid-rows-[1440] gap-0 w-full">
            {Array.from({ length: 24 }, (_, hour) => {
              return (
                <div
                  key={`minute-${hour}`}
                  className="flex flex-col row-span-60"
                  style={{ height: 120 }}
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

          <div className="absolute grid auto-cols-auto grid-rows-[1440] gap-0 w-full pl-8 pointer-events-none">
            {Array.from({ length: 1440 }, (_, i) => {
              return (
                <div
                  key={i}
                  className="col-start-1 row-span-60 pointer-events-none"
                  style={{ height: 2 }}
                />
              );
            })}

            {time.start && (
              <div
                className="col-start-2 border bg-blue-500 opacity-60 text-white pointer-events-auto"
                style={{
                  gridRowStart: datetimeToMinutes(time.start) + 1,
                  gridRowEnd: datetimeToMinutes(time.start) + timeUnit,
                }}
              />
            )}

            {events.map((event) => {
              const startRow = datetimeToMinutes(event.start) + 1;
              const endRow = Math.floor(datetimeToMinutes(event.end)) + 1;

              return (
                <div
                  key={event.id}
                  className="col-start-2 border bg-blue-500 text-white pointer-events-auto px-4"
                  style={{
                    gridRowStart: startRow,
                    gridRowEnd: endRow,
                  }}
                >
                  {event.id}: event.title
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
