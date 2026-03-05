import React from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  data?: Record<string, string | number>; // Key-value pairs to display
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title = "Modal Title",
  description = "",
  data = {},
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] max-w-full">
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        {description && <p className="mb-4">{description}</p>}

        {data && Object.keys(data).length > 0 && (
          <div className="mb-4 space-y-1">
            {Object.entries(data).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={onClose}
          >
            {cancelButtonText}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              if (onConfirm) onConfirm();
            }}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
