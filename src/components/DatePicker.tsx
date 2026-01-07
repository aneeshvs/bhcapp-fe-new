"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface Props {
  name: string;
  value: string | null; // yyyy-mm-dd
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => void;
  placeholder?: string;
}

export default function DatePicker({
  name,
  value,
  onChange,
  placeholder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const emitChange = (date?: Date) => {
      if (!date) {
        onChange({ target: { name, value: "" } });
        return;
      }

      // ✅ No timezone issue
      const mysqlDate = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      onChange({
        target: {
          name,
          value: mysqlDate,
        },
      });
    };

    const fp = flatpickr(inputRef.current, {
      dateFormat: "d-m-Y",
      allowInput: true,
      defaultDate: value || undefined,

      // Calendar select
      onChange(selectedDates) {
        emitChange(selectedDates[0]);
      },

      // Paste / type + blur
      onClose(selectedDates) {
        emitChange(selectedDates[0]);
      },
    });

    // 🔁 Sync display when parent updates value
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
