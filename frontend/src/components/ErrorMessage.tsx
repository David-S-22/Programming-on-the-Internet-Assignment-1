import { XIcon } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"

type ErrorMessageProps = {
  errorMessage : string
  setErrorMessage : Dispatch<SetStateAction<string>>
}

export default function ErrorMessage(props : ErrorMessageProps) {
  return (
    <>
      {
      props.errorMessage !== "" 
        ? <div className="error-message-banner" role="alert" aria-live="assertive">
            <p id="errorMessage">{props.errorMessage}</p>
            <button aria-label="Dismiss error message" onClick={() => (props.setErrorMessage(""))}><XIcon size={16}/></button>
        </div>
        : <></> 
      }
    </>
  )
}