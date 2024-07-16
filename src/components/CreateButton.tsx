import React from "react";

interface CreateButtonProps {
  disabled: boolean;
  onPress: () => void;
}

export const CreateButton: React.FC<CreateButtonProps> = ({
  disabled,
  onPress,
}) => {
  return (
    <button
      disabled={disabled}
      className={`p-4 w-full rounded-full mt-6 text-white text-center ${
        disabled ? "bg-gray-400" : "bg-black"
      }`}
      onClick={onPress}
    >
      Create
    </button>
  );
};
