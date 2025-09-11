// components/utils/popup/ConfirmDialog.jsx
import React from "react";
import "./ConfirmDialog.css";

const ConfirmDialog = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "red", // default green
}) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className="confirm-btn"
            style={{ backgroundColor: confirmColor, color: "#fff" }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
