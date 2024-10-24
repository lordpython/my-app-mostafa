import type * as React from "react"

interface AlertProps {
  message: string
  onClose: () => void
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => (
  <div className="alert bg-red-500 text-white p-4 rounded shadow-md">
    <span>{message}</span>
    <button onClick={onClose} className="ml-4">
      Close
    </button>
  </div>
)

export default Alert
