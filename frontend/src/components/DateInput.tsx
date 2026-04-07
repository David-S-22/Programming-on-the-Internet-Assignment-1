import { format } from "date-fns";

function getDateFromTargetValue(value: Date | null): Date {
  return value ?? new Date(NaN);
}

function DateInput(props : { value: Date, onChange: (date: Date) => void, ariaLabel?: string, title?: string }) {
  return (
    <input
      aria-label={props.ariaLabel}
      title={props.title}
      type="date"
      value={format(props.value, "yyyy-MM-dd")}
      onChange={(event) => {
        props.onChange(getDateFromTargetValue(event.target.valueAsDate));
      }}
    />
  );
}

export default DateInput;
