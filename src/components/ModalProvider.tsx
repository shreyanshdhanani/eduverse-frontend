"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import CustomModal from "./CustomModal";

type ModalType = "success" | "error" | "info" | "warning" | "confirm";

interface ModalOptions {
  title?: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  showAlert: (options: ModalOptions | string) => void;
  showConfirm: (options: ModalOptions) => Promise<boolean>;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalOptions & { resolve?: (val: boolean) => void }>({
    message: "",
    type: "info",
  });

  const showAlert = useCallback((options: ModalOptions | string) => {
    if (typeof options === "string") {
      setModalOptions({ message: options, type: "info" });
    } else {
      setModalOptions({ ...options, type: options.type || "info" });
    }
    setIsOpen(true);
  }, []);

  const showConfirm = useCallback((options: ModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalOptions({
        ...options,
        type: "confirm",
        resolve,
      });
      setIsOpen(true);
    });
  }, []);

  const hideModal = useCallback(() => {
    setIsOpen(false);
    if (modalOptions.resolve) {
      modalOptions.resolve(false);
    }
  }, [modalOptions]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (modalOptions.onConfirm) modalOptions.onConfirm();
    if (modalOptions.resolve) modalOptions.resolve(true);
  }, [modalOptions]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (modalOptions.onCancel) modalOptions.onCancel();
    if (modalOptions.resolve) modalOptions.resolve(false);
  }, [modalOptions]);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, hideModal }}>
      {children}
      <CustomModal
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        {...modalOptions}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
