import { addMinutes } from "date-fns";

export interface Datetime {
  hour: number;
  minute: number;
}

export const datetimeToJsDate = (datetime: Datetime) => {
  const date = new Date();
  date.setHours(datetime.hour);
  date.setMinutes(datetime.minute);
  return date;
};

export const datetimeToMinutes = (datetime: Datetime) => {
  return datetime.hour * 60 + datetime.minute;
};

export const addMinutesToDatetime = (
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

export const formatToTwoDigitTime = (time: number) =>
  time < 10 ? `0${time}` : `${time}`;
