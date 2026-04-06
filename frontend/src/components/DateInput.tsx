import { format } from "date-fns";

function getDateFromTargetValue(value: Date | null): Date {
  return value ?? new Date(NaN);
}

function DateInput(props : { value: Date, onChange: (date: Date) => void, ariaLabel?: string }) {
  return (
    <input
      aria-label={props.ariaLabel}
      type="date"
      value={format(props.value, "yyyy-MM-dd")}
      onChange={(event) => {
        props.onChange(getDateFromTargetValue(event.target.valueAsDate));
      }}
    />
  );
}

export default DateInput;
