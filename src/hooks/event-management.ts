"use client";

import {
  Datetime,
  addMinutesToDatetime,
  datetimeToMinutes,
} from "@/utils/date";

import { useState } from "react";

interface EventPeriod {
  start: Datetime;
  end: Datetime;
}

interface Event extends EventPeriod {
  id: number;
}

export const useEventManagement = (intervalMinutes: number) => {
  const [newEventPeriod, setNewEventPeriod] = useState<Partial<EventPeriod>>({
    start: undefined,
    end: undefined,
  });
  const [events, setEvents] = useState<Event[]>([]);
  const addEvent = (eventPeriod: EventPeriod) => {
    setEvents((prevEvents) => [
      ...prevEvents,
      { id: prevEvents.length + 1, ...eventPeriod },
    ]);
  };

  const processTimeSelection = (selectedDatetime: Datetime) => {
    let newTime: Partial<EventPeriod> = { start: undefined, end: undefined };

    if (!newEventPeriod.start) {
      newTime = { start: selectedDatetime, end: undefined };
    } else if (!newEventPeriod.end) {
      const storedMinutes = datetimeToMinutes(newEventPeriod.start);
      const clickedMinutes = datetimeToMinutes(selectedDatetime);
      const newEventDatetime: EventPeriod =
        storedMinutes <= clickedMinutes
          ? {
              start: newEventPeriod.start,
              end: addMinutesToDatetime(selectedDatetime, intervalMinutes),
            }
          : {
              start: selectedDatetime,
              end: addMinutesToDatetime(newEventPeriod.start, intervalMinutes),
            };
      addEvent(newEventDatetime);
    }
    setNewEventPeriod(newTime);
  };

  return {
    newEventPeriod,
    events,
    processTimeSelection,
  };
};
