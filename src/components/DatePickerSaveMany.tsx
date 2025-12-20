"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface DatePickerSaveManyProps {
  name: string;
  value: string | null;
  onChange: (e: { target: { name: string; value: string } }) => void;
  placeholder?: string;
}

export default function DatePickerSaveMany({
  name,
  value,
  onChange,
  placeholder,
}: DatePickerSaveManyProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const fp = flatpickr(inputRef.current, {
      dateFormat: "d-m-Y",
      allowInput: false,
      defaultDate: value || undefined,

      onChange(selectedDates) {
        if (!selectedDates[0]) {
          onChange({ target: { name, value: "" } });
          return;
        }

        const d = selectedDates[0];
        const mysqlFormat = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        onChange({ target: { name, value: mysqlFormat } });
      },
    });

    // Update the display when value changes from parent
    const updateDisplay = () => {
      if (value && inputRef.current) {
        const [year, month, day] = value.split("-");
        inputRef.current.value = `${day}-${month}-${year}`;
      } else if (inputRef.current) {
        inputRef.current.value = "";
      }
    };

    updateDisplay();

    return () => {
      fp.destroy();
    };
  }, [name, onChange, value]); // Keep value in dependencies to update display

  return (
    <input
      ref={inputRef}
      type="text"
      name={name}
      placeholder={placeholder || "Select Date"}
      className="w-full border border-gray-300 rounded px-3 py-2"
      readOnly
    />
  );
}