import React from "react";

interface AuthAlertProps {
  type: "success" | "error";
  message: string;
}

const AuthAlert = ({ type, message }: AuthAlertProps) => {
  const baseClasses = "rounded-md p-4 shadow text-xs"; // Common base styles

  const alertClasses =
    type === "success"
      ? `${baseClasses} bg-green-100 text-green-700` // Success styles
      : `${baseClasses} bg-red-100 text-red-700`; // Error styles

  return (
    <div className={alertClasses}>
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default AuthAlert;
