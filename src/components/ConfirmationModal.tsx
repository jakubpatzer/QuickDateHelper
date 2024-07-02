import React from 'react';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<Props> = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
      <div className="relative w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
        <div className="text-xl font-semibold text-gray-800 mb-4 text-left">Resetuj całe spotkanie</div>
        <div className="text-gray-700 mb-6 text-left">Czy na pewno chcesz wszystko zresetować ?</div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Anuluj
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Resetuj
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
