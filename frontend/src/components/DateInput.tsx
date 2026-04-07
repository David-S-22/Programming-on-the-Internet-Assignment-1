import { format, isValid } from "date-fns";

function getDateFromTargetValue(value: Date | null): Date {
  return value ?? new Date(NaN);
}

//The main purpose of this is to allow me to properly format and get the value from the date input. This is because we need to format the value so that we can use it and also handle nulls incase the user does not input a date.
function DateInput(props : { value: Date, onChange: (date: Date) => void, ariaLabel?: string, title?: string }) {
  return (
    <input
      aria-label={props.ariaLabel}
      title={props.title}
      type="date"
      value={isValid(props.value) ? format(props.value, "yyyy-MM-dd") : ""} //As an input of date type can only store valid dates if the date becomes invalid we remove it to ensure that only correct dates are inputted
      onChange={(event) => {
        props.onChange(getDateFromTargetValue(event.target.valueAsDate));
      }}
    />
  );
}

export default DateInput;
