import React from "react";

interface MultilineTextInputProps {
  maxLength: number;
  text: string;
  setText: (text: string) => void;
}

export const MultilineTextInput: React.FC<MultilineTextInputProps> = ({
  maxLength,
  text,
  setText,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value.slice(0, maxLength));
  };


  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow placeholder-[#B9B9B9] no-scrollbar">
      <textarea
        className="w-full text-sm p-2 border-none outline-none resize-none bg-white no-scrollbar"
        placeholder="Best wishes! Here's a Lifafa for you!"
        onChange={handleChange}
        value={text || ""}
        maxLength={maxLength}
        rows={4}
      />
      <p className="text-right text-xs text-gray-500 mt-1">
        {text.length}/{maxLength}
      </p>
    </div>
  );
};
