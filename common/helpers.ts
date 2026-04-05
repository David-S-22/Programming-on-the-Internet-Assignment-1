function toISO8601DateString(date: Date): string {
  if (isNaN(date.getTime())) {
    return "";
  }

  //Extracting the year, month and day in the expected format so that the date input will display it in YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export { toISO8601DateString }