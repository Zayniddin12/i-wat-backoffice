export const changeNumberFormat = (number: number) => {
  return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export function calculateDuration(start: string, end: string): number {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();

  // Calculate the difference in milliseconds
  const durationInMilliseconds = endTime - startTime;

  // Convert milliseconds to minutes
  const durationInMinutes = Math.round(
    Math.abs(durationInMilliseconds / (1000 * 60))
  );

  return durationInMinutes;
}

export const convertStringToDate = (date: string) => {
  if (!date) return ["", ""];
  return date.split(" - ").map((item) => item.split(".").reverse().join("-"));
};

export function convertToISOString(dateString: string, timeString: string) {
  if (!dateString) return;
  if (!timeString) timeString = "00:00:00";
  const [day, month, year] = dateString.split(".");
  const [hours, minutes, seconds] = timeString.split(":");

  const dateObject = new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  );

  const formattedDate = dateObject.toISOString();

  return formattedDate;
}

export function separateDateAndTime(isoDateString: string) {
  if (!isoDateString) return { date: "", time: "" };
  const dateObject = new Date(isoDateString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");

  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const seconds = String(dateObject.getSeconds()).padStart(2, "0");

  const dateString = `${day}.${month}.${year}`;
  const timeString = `${hours}:${minutes}:${seconds}`;

  return { date: dateString, time: timeString };
}

export const convertDateToString = (start: string, end: string) => {
  start = start === "undefined" ? "" : start;
  end = end === "undefined" ? "" : end;
  if (!start.length || !end.length) return;
  const date = [start, end].map((item) => item.split("-").reverse().join("."));
  return date.join(" - ");
};

export const convertPhoneNumberToString = (value: string) => {
  const number = value?.replace(/[\s-]/g, "");

  return number;
};
export function hashPhoneNumber(input: string) {
  // Remove non-numeric characters
  const numericOnly = input.replace(/\D/g, "");

  // Check if the input is a valid phone number
  if (numericOnly.length !== 12) {
    // console.error("Invalid phone number format");
    return input; // return the original input if it's not a valid phone number
  }

  // Format the phone number
  return `+${numericOnly.slice(0, 5)} *** ** ${numericOnly.slice(10, 12)}`;
}
export function convertSecondsToHMS(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours = seconds % 3600;
  const minutes = Math.floor(remainingSecondsAfterHours / 60);
  const remainingSeconds = remainingSecondsAfterHours % 60;

  return {
    hours: hours,
    minutes: minutes,
    seconds: remainingSeconds,
  };
}
