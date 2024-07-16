import React, { useState } from "react";
import { ClockIcon } from "lucide-react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  time: Date | null;
  setTime: (time: Date | null) => void;
}

export const CustomDatePicker: React.FC<DatePickerProps> = ({
  time,
  setTime,
}) => {
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const handleDateChange = (date: Date) => {
    setTime(date);
    setIsTimePickerVisible(false);
  };

  return (
    <>
      <div
        className="relative bg-white border border-gray-200 p-3 rounded-lg flex justify-between items-center mb-4 cursor-pointer transition duration-150 ease-in-out hover:border-blue-600 focus-within:border-blue-600"
        onClick={() => setIsTimePickerVisible(!isTimePickerVisible)}
      >
        <span className={time ? "" : "text-gray-400"}>
          {time ? dayjs(time).format("D MMM YYYY") : "Add end date"}
        </span>
        <ClockIcon className="text-black" width={20} height={20} />
      </div>
      {isTimePickerVisible && (
        <div className="absolute mt-1 z-50">
          <DatePicker
            selected={time}
            onChange={handleDateChange}
            inline
            className="bg-white border border-gray-200 rounded-lg shadow-md"
          />
        </div>
      )}
    </>
  );
};
