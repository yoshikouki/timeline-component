"use client";

import { datetimeToMinutes, formatToTwoDigitTime } from "@/utils/date";

import { useEventManagement } from "@/hooks/event-management";
import { useState } from "react";

export default function Timeline() {
  const [intervalMinutes, setIntervalMinutes] = useState<number>(15);
  const { newEventPeriod, events, processTimeSelection } =
    useEventManagement(intervalMinutes);
  const minuteHeight = 2;

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
        <div className="relative">
          <div className="absolute grid auto-cols-auto grid-rows-[1440] gap-0 w-full">
            {Array.from({ length: 24 }, (_, hour) => {
              return (
                <div
                  key={`hour-${hour}`}
                  className="border-t cursor-pointer row-span-60 px-4 py-2"
                  style={{ height: 60 * minuteHeight }}
                >
                  {formatToTwoDigitTime(hour)}
                </div>
              );
            })}
          </div>

          <div className="absolute grid auto-cols-auto grid-rows-[1440] gap-0 w-full">
            {Array.from(
              { length: (60 / intervalMinutes) * 24 },
              (_, intervalIndex) => {
                const minutesIn24 = intervalIndex * intervalMinutes;
                const hour = Math.floor(minutesIn24 / 60);
                const minute = minutesIn24 % 60;
                return (
                  <div
                    key={intervalIndex}
                    onClick={() => processTimeSelection({ hour, minute })}
                    className="cursor-pointer flex-grow"
                    style={{ height: intervalMinutes * minuteHeight }}
                  />
                );
              }
            )}
          </div>

          <div className="pl-[20%] pointer-events-none w-full">
            {events.map((event) => {
              const startMinutes = datetimeToMinutes(event.start);
              const endMinutes = datetimeToMinutes(event.end);
              return (
                <div
                  key={event.id}
                  className="border bg-blue-500 text-white pointer-events-auto px-4 absolute w-4/5"
                  style={{
                    top: startMinutes * minuteHeight,
                    height: (endMinutes - startMinutes) * minuteHeight,
                  }}
                >
                  {event.id}: {startMinutes} - {endMinutes}
                </div>
              );
            })}

            {newEventPeriod.start && (
              <div
                className="border bg-blue-500 opacity-60 text-white absolute pointer-events-auto w-4/5"
                style={{
                  top: datetimeToMinutes(newEventPeriod.start) * minuteHeight,
                  height: intervalMinutes * minuteHeight,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
