import React from "react";
import "./movie-button.scss";

export function MovieButton({ label, buttonComponent }) {
  return (
    <div className="button-style" onClick={buttonComponent}>
      {label}
    </div>
  );
}
