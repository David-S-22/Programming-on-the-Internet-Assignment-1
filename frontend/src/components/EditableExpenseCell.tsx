import DateInput from './DateInput'

type EditableExpenseCellProps = {
  isEditing: boolean,
  displayValue: string | number,
  inputType: 'text' | 'number' | 'select' | 'date',
  value: string | number | Date | null,
  min?: number,
  options?: string[],
  onChange: (value: string | number | Date) => void,
}

function EditableExpenseCell(props: EditableExpenseCellProps) {
  var editingElement;

  if (props.inputType === 'text') {
    editingElement = (
      <input
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
        type="number"
        min={props.min}
        value={(props.value as number).toString()}
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