import React from "react";

interface ModalProps {
  version: "reset" | "pdf";
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const Modal: React.FC<ModalProps> = ({
  version,
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
      <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
        <div className="text-2xl font-semibold text-gray-800 mb-4 text-left">
          {version === "reset"
            ? "Reset entire meeting"
            : "You haven't marked anyone yet"}
        </div>
        <div className="text-gray-700 mb-6 text-left">
          {version === "reset"
            ? "Are you sure you want to reset everything?"
            : "To download the PDF you need to tag someone"}
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 font-bold rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            {version === "reset" ? "Cancel" : "Ok"}
          </button>
          {version === "reset" && (
            <button
              className="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
              onClick={onConfirm}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
