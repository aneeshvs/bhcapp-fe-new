"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface Props {
  name: string;
  value: string | null;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => void;
  placeholder?: string;
}

export default function DatePicker({ name, value, onChange, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    flatpickr(inputRef.current, {
      dateFormat: "d-m-Y",
      allowInput: false,

      onChange(selectedDates) {
        if (!selectedDates[0]) {
          onChange({ target: { name, value: "" } });
          return;
        }

        const d = selectedDates[0];

        // 🔥 Manual formatting – NO timezone shift
        const mysqlFormat = `${d.getFullYear()}-${String(
          d.getMonth() + 1
        ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

        onChange({
          target: {
            name,
            value: mysqlFormat, // backend-safe date
          },
        });
      },
    });
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      name={name}
      value={
        value
          ? new Date(value).toLocaleDateString("en-GB") // Display dd-mm-yyyy
          : ""
      }
      placeholder={placeholder || "Select Date"}
      className="w-full border border-gray-300 rounded px-3 py-2"
      readOnly
    />
  );
}
