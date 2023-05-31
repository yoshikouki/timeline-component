"use client";

import { addMinutes } from "date-fns";
import { useState } from "react";

interface Datetime {
  hour: number;
  minute: number;
}

interface EventPeriod {
  start: Datetime;
  end: Datetime;
}

interface Event extends EventPeriod {
  id: number;
}

const formatTime = (time: number) => (time < 10 ? `0${time}` : `${time}`);

const datetimeToJsDate = (datetime: Datetime) => {
  const date = new Date();
  date.setHours(datetime.hour);
  date.setMinutes(datetime.minute);
  return date;
};
const datetimeToMinutes = (datetime: Datetime) => {
  return datetime.hour * 60 + datetime.minute;
};

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

export default function Timeline() {
  const [newEventPeriod, setNewEventPeriod] = useState<Partial<EventPeriod>>({
    start: undefined,
    end: undefined,
  });
  const [intervalMinutes, setIntervalMinutes] = useState<number>(15);
  const [events, setEvents] = useState<Event[]>([]);

  const handleTimelineClick = (hour: number, minute: number) => {
    const clickedDatetime: Datetime = { hour, minute };
    let newTime: Partial<EventPeriod> = { start: undefined, end: undefined };
    if (!newEventPeriod.start) {
      newTime = { start: clickedDatetime, end: undefined };
    } else if (!newEventPeriod.end) {
      const storedMinutes = datetimeToMinutes(newEventPeriod.start);
      const clickedMinutes = datetimeToMinutes(clickedDatetime);
      const newEventDatetime: EventPeriod =
        storedMinutes <= clickedMinutes
          ? {
              start: newEventPeriod.start,
              end: addMinutesToDatetime(clickedDatetime, intervalMinutes),
            }
          : {
              start: clickedDatetime,
              end: addMinutesToDatetime(newEventPeriod.start, intervalMinutes),
            };
      setEvents([...events, { id: events.length + 1, ...newEventDatetime }]);
    }
    setNewEventPeriod(newTime);
  };

  return (
    <>
      <div className="mt-4 mb-8 px-4">
        <label htmlFor="time-unit">時間単位:</label>
        <select
          id="time-unit"
          value={intervalMinutes}
          onChange={(e) => setIntervalMinutes(Number(e.target.value))}
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
                  onClick={() => handleTimelineClick(hour, 0)}
                  key={`hour-${hour}`}
                  className="border-t cursor-pointer row-span-60 px-4 py-2"
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
                  {Array.from({ length: 60 / intervalMinutes }, (_, minuteIndex) => {
                    const minute = minuteIndex * intervalMinutes;
                    return (
                      <div
                        key={`hour-${hour}-minute-${minute}`}
                        onClick={() => handleTimelineClick(hour, minute)}
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

            {newEventPeriod.start && (
              <div
                className="col-start-2 border bg-blue-500 opacity-60 text-white pointer-events-auto"
                style={{
                  gridRowStart: datetimeToMinutes(newEventPeriod.start) + 1,
                  gridRowEnd: datetimeToMinutes(newEventPeriod.start) + intervalMinutes,
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
