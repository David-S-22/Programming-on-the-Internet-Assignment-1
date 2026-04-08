import type { Dispatch, SetStateAction } from "react"

type ExpenseFiltersProps = {
  selectedCategoryFilter : string
  selectedPeriodFilter : string
  categoryFilterValues : string[]
  periodFilterValues : string[]
  setCategoryFilter : Dispatch<SetStateAction<string>>
  setPeriodFilter : Dispatch<SetStateAction<string>>
}

export default function ExpenseFilters(props : ExpenseFiltersProps) {
    return (
      <div className="criteria-filters" role="group" aria-labelledby="filter-text">
        <p id="filter-text">Filters:</p>
        <select id="category-filter" className="expense-filter-select"
          value={props.selectedCategoryFilter}
          onChange={(e) => {
            props.setCategoryFilter(e.target.value);
          }}
        >
          {props.categoryFilterValues.map((categoryValue) => {
            return (
              <option key={categoryValue}>{categoryValue}</option>
            )
          })}
        </select >
        <select id="period-filter" className="expense-filter-select"
          value={props.selectedPeriodFilter}
          onChange={(e) => {
            props.setPeriodFilter(e.target.value)
          }}>
          {props.periodFilterValues.map((period) => {
            return (
              <option key={period}>{period}</option>
            )
          })}
        </select>
      </div>
    )
}