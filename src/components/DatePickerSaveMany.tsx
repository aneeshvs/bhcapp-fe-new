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

    const emitChange = (date: Date | undefined) => {
      if (!date) {
        onChange({ target: { name, value: "" } });
        return;
      }

      const mysql = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      onChange({ target: { name, value: mysql } });
    };

    const fp = flatpickr(inputRef.current, {
      dateFormat: "d-m-Y",
      allowInput: true,
      defaultDate: value || undefined,

      onChange(selectedDates) {
        emitChange(selectedDates[0]);
      },

      onClose(selectedDates) {
        emitChange(selectedDates[0]);
      },
    });

    // Sync display when parent value changes
    if (value && inputRef.current) {
      const [y, m, d] = value.split("-");
      inputRef.current.value = `${d}-${m}-${y}`;
    }

    return () => fp.destroy();
  }, [name, value, onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      name={name}
      placeholder={placeholder || "Select Date"}
      className="w-full border border-gray-300 rounded px-3 py-2"
    />
  );
}
