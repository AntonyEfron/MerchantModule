// context/ConfirmDialogContext.jsx
import React, { createContext, useContext, useState } from "react";
import ConfirmDialog from "../components/utils/popup/ConfirmDialog";

const ConfirmDialogContext = createContext(null);

export const useConfirmDialog = () => useContext(ConfirmDialogContext);

export const ConfirmDialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const openConfirm = ({ title, message, onConfirm }) => {
    setDialog({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirm = () => {
    setDialog({ ...dialog, isOpen: false });
  };

  const handleConfirm = () => {
    if (dialog.onConfirm) dialog.onConfirm();
    closeConfirm();
  };

  return (
    <ConfirmDialogContext.Provider value={{ openConfirm, closeConfirm }}>
      {children}

      {dialog.isOpen && (
        <ConfirmDialog
          title={dialog.title}
          message={dialog.message}
          onConfirm={handleConfirm}
          onCancel={closeConfirm}
        />
      )}
    </ConfirmDialogContext.Provider>
  );
};
