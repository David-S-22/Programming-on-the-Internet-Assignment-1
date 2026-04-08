import { format, isValid } from "date-fns";

type DateInputProps = {
  value : Date
  onChange : (date : Date) => void
  ariaLabel? : string
  title? : string
}

//The main purpose of this is to allow me to properly format and get the value from the date input. This is because we need to format the value so that we can display it as the value, and also it needs to be able to handle nulls gracefully incase the user does not input a date.
function DateInput(props : DateInputProps) {
  return (
    <input
      aria-label={props.ariaLabel}
      title={props.title}
      type="date"
      value={isValid(props.value) ? format(props.value, "yyyy-MM-dd") : ""} //As an input of date type can only store valid dates if the date becomes invalid we remove it to ensure that only correct dates are inputted
      onChange={(event) => {
        props.onChange(event.target.valueAsDate ?? new Date(NaN));
      }}
    />
  );
}

export default DateInput;
