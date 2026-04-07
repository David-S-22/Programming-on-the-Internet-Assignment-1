import DateInput from './DateInput'

type EditableExpenseCellProps = {
  isEditing: boolean,
  displayValue: string | number,
  ariaLabel: string,
  inputType: 'text' | 'number' | 'select' | 'date',
  value: string | number | Date,
  min?: number,
  step? : number,
  options?: string[],
  onChange: (value: string | number | Date) => void,
}

function EditableExpenseCell(props: EditableExpenseCellProps) {
  let editingElement;

  if (props.inputType === 'text') {
    editingElement = (
      <input
        aria-label={props.ariaLabel}
        value={props.value as string}
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
        value={props.value as string}
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
      <input
        aria-label={props.ariaLabel}
        type="number"
        min={props.min}
        value={(props.value as number).toString()}
        step={props.step}
        onInput={(e) => e.currentTarget.validity.valid || (e.currentTarget.value = '')}
        onChange={(e) => {
          props.onChange(e.target.valueAsNumber);
        }}
      />
    );
  }

  if (props.inputType === 'date') {
    editingElement = (
      <DateInput
        ariaLabel={props.ariaLabel}
        value={props.value as Date}
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
