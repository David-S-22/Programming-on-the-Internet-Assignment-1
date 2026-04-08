import DateInput from './DateInput'
import { NumericFormat } from 'react-number-format'

type EditableExpenseCellProps = {
  isEditing: boolean,
  displayValue: string | number,
  ariaLabel: string,
  title?: string,
  inputType: 'text' | 'number' | 'select' | 'date',
  inputValue: string | number | Date,
  min?: number,
  decimalScale? : number,
  options?: string[],
  onChange: (value: string | number | Date) => void,
}

//The main purpose of this component is to remove a lot of the repeated code since pretty much all of the expense cells in an existing expense row are the same with little variation. So this component was made to remove the need to define the same thing over and over again, and to also improve maintainability
function EditableExpenseCell(props: EditableExpenseCellProps) {
  let editingElement;

  if (props.inputType === 'text') {
    editingElement = (
      <input
        aria-label={props.ariaLabel}
        title={props.title}
        value={props.inputValue as string}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
    );
  }

  if (props.inputType === 'select') {
    editingElement = (
      <select
        aria-label={props.ariaLabel}
        title={props.title}
        value={props.inputValue as string}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      >
        { props.options?.map((option) => {
          return (
            <option key={option}>{option}</option>
          )
        }) }
      </select>
    );
  }

  if (props.inputType === 'number') {
    editingElement = (
      <NumericFormat
        aria-label={props.ariaLabel}
        min={props.min}
        value={(props.inputValue as number)}
        decimalScale={props.decimalScale}
        title={props.title}
        thousandSeparator=","
        onValueChange={({ floatValue }) => {
          props.onChange(floatValue ?? NaN);
        }}
      />
    );
  }

  if (props.inputType === 'date') {
    editingElement = (
      <DateInput
        ariaLabel={props.ariaLabel}
        title={props.title}
        value={props.inputValue as Date}
        onChange={(date) => {
          props.onChange(date);
        }}
      />
    );
  }

  return (
    <td className="expense-table-data">
      {props.isEditing ? editingElement : <span>{props.displayValue}</span>}
    </td>
  )
}

export default EditableExpenseCell
