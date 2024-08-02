import React from "react";

interface CreateButtonProps {
  disabled: boolean;
  onPress: () => void;
  isLoading: boolean;
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white mr-3"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export const CreateButton: React.FC<CreateButtonProps> = ({
  disabled,
  onPress,
  isLoading,
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`p-4 w-full rounded-full mt-6 text-white text-center ${
        disabled ? "bg-gray-400" : "bg-black"
      } flex items-center justify-center`}
      onClick={onPress}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <span>Creating Lifafa</span>
          <LoadingSpinner />
        </div>
      ) : (
        "Create"
      )}
    </button>
  );
};
