import React from "react";
import { UsersIcon } from "lucide-react";

interface MaxClaimsInputProps {
  maxClaims: number | null;
  onChangeMaxClaims: (value: number) => void;
}

export const MaxClaimsInput: React.FC<MaxClaimsInputProps> = ({
  maxClaims,
  onChangeMaxClaims,
}) => {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      onChangeMaxClaims(value);
    } else {
      onChangeMaxClaims(0);
    }
  }

  return (
    <div className="relative mb-2">
      <input
        type="number"
        value={maxClaims ? maxClaims : ""}
        onChange={handleChange}
        placeholder="Add max no. of recipients"
        className="bg-white border border-gray-200 px-4 py-2 rounded-lg focus:border-blue-600 w-full no-scrollbar"
        min="0"
      />
      <div className="absolute right-4 bottom-3">
        <UsersIcon className="text-black" width={20} height={20} />
      </div>
    </div>
  );
};
