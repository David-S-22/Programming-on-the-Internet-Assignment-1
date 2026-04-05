import { toISO8601Date } from "../../../common/helpers.ts"

function parseDateInputValue(value: string): Date {
  //The reason why we add the timestamp is to ensure that we don't try to set it in UTC time which can cause a mismatch in inputted and the actually set date.
  return value === "" ? new Date(NaN) : new Date(`${value}T00:00:00`);
}

function DateInput(props : { value: Date, onChange: (date: Date) => void }) {
  return (
    <input
      type="date"
      value={toISO8601Date(props.value)}
      onChange={(event) => {
        props.onChange(parseDateInputValue(event.target.value));
      }}
    />
  );
}

export default DateInput;
