import DateInput from './DateInput'

type EditableExpenseCellProps = {
  isEditing: boolean,
  displayValue: string | number,
  ariaLabel: string,
  title?: string,
  inputType: 'text' | 'number' | 'select' | 'date',
  value: string | number | Date,
  min?: number,
  step? : number,
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
        title={props.title}
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
        title={props.title}
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
        title={props.title}
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
