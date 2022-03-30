import React from "react";
import "./btn.css";
interface btnProps {
  text: string;
  handler: React.MouseEventHandler<HTMLElement>;
  disabled: boolean;
  extraClasses: string;
}

export default function Button({
  text,
  handler,
  disabled,
  extraClasses,
}: btnProps) {
  return (
    <button
      type="button"
      onClick={handler}
      className={`btn ${extraClasses}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
