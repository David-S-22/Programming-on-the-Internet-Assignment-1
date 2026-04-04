function formatDateForDateInput(date: Date): string {
  if (isNaN(date.getTime())) {
    return "";
  }

  //Extracting the year, month and day in the expected format so that the date input will display it in YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value: string): Date {
  //The reason why we add the timestamp is to ensure that we don't try to set it in UTC time which can cause a mismatch in inputted and the actually set date.
  return value === "" ? new Date(NaN) : new Date(`${value}T00:00:00`);
}

function DateInput(props : { value: Date, onChange: (date: Date) => void }) {
  return (
    <input
      type="date"
      value={formatDateForDateInput(props.value)}
      onChange={(event) => {
        props.onChange(parseDateInputValue(event.target.value));
      }}
    />
  );
}

export default DateInput;
