"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface DatePickerSaveManyProps {
  name: string;
  value: string | null;
  onChange: (e: { target: { name: string; value: string } }) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function DatePickerSaveMany({
  name,
  value,
  onChange,
  placeholder,
  disabled,
}: DatePickerSaveManyProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    if (disabled) return; // Don't init flatpickr if disabled? Or maybe init but it won't open?

    // Check if flatpickr instance exists? 
    // Actually, if disabled changes, we might want to destroy/re-init or just rely on input disabled.
    // Flatpickr doesn't automatically unbind if input becomes disabled.

    // Let's just pass disabled to input and hope flatpickr respects it (it usually does).
    // But if we return early here, we might miss init if it starts enabled.

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
      clickOpens: !disabled,
      disableMobile: true,

      onChange(selectedDates) {
        emitChange(selectedDates[0]);
      },

      onClose(selectedDates) {
        emitChange(selectedDates[0]);
      },
    });

    // ... (rest is same)

    // Sync display when parent value changes
    if (value && inputRef.current) {
      const [y, m, d] = value.split("-");
      inputRef.current.value = `${d}-${m}-${y}`;
    }

    return () => fp.destroy();
  }, [name, value, onChange, disabled]);

  return (
    <input
      ref={inputRef}
      type="text"
      name={name}
      disabled={disabled}
      placeholder={placeholder || "Select Date"}
      className={`w-full border border-gray-300 rounded px-3 py-2 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
  );
}
