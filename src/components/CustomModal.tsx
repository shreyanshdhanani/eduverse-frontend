"use client";

import React from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info, HelpCircle } from "lucide-react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  type?: "success" | "error" | "info" | "warning" | "confirm";
  confirmText?: string;
  cancelText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="text-green-500" size={48} />,
          buttonClass: "bg-green-600 hover:bg-green-700 shadow-green-200",
          titleDefault: "Success",
          bgColor: "bg-green-50",
        };
      case "error":
        return {
          icon: <AlertCircle className="text-red-500" size={48} />,
          buttonClass: "bg-red-600 hover:bg-red-700 shadow-red-200",
          titleDefault: "Error",
          bgColor: "bg-red-50",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="text-amber-500" size={48} />,
          buttonClass: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
          titleDefault: "Warning",
          bgColor: "bg-amber-50",
        };
      case "confirm":
        return {
          icon: <HelpCircle className="text-purple-500" size={48} />,
          buttonClass: "bg-purple-600 hover:bg-purple-700 shadow-purple-200",
          titleDefault: "Confirmation",
          bgColor: "bg-purple-50",
        };
      case "info":
      default:
        return {
          icon: <Info className="text-blue-500" size={48} />,
          buttonClass: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
          titleDefault: "Information",
          bgColor: "bg-blue-50",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header/Icon Area */}
        <div className={`p-8 flex flex-col items-center text-center ${styles.bgColor}`}>
          <div className="mb-4 bg-white p-4 rounded-3xl shadow-sm border border-white/50 animate-bounce-subtle">
            {styles.icon}
          </div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">
            {title || styles.titleDefault}
          </h2>
        </div>

        {/* Message Area */}
        <div className="p-8 pb-4">
          <p className="text-gray-600 text-center text-lg leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Actions Area */}
        <div className="p-8 pt-4 flex gap-3">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all active:scale-95 text-sm"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 text-sm ${styles.buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
