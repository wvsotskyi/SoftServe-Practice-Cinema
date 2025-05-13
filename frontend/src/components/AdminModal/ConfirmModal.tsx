import React from "react";

interface ConfirmModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4">
      <div className="bg-[#1C1B20] text-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl bg-gray-600 hover:bg-gray-700 transition duration-150"
          >
            Скасувати
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 transition duration-150"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
};
