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
  const fpRef = useRef<flatpickr.Instance | null>(null);

  // ✅ Init once
  useEffect(() => {
    if (!inputRef.current) return;

    fpRef.current = flatpickr(inputRef.current, {
      dateFormat: "d-m-Y",
      allowInput: true,
      onChange(selectedDates) {
        if (!selectedDates[0]) return;
        syncDate(selectedDates[0]);
      },
    });

    return () => {
      fpRef.current?.destroy();
    };
  }, []);

  // ✅ Sync from parent
  useEffect(() => {
    if (value && fpRef.current) {
      fpRef.current.setDate(value, true);
    }
  }, [value]);

  // ✅ Handle pasted / typed date
  const handleBlur = () => {
    if (!inputRef.current || !fpRef.current) return;

    const parsed = fpRef.current.parseDate(
      inputRef.current.value,
      "d-m-Y"
    );

    if (!parsed) return;

    syncDate(parsed);
    fpRef.current.setDate(parsed, true);
  };

  const syncDate = (d: Date) => {
    const mysqlFormat = `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    onChange({ target: { name, value: mysqlFormat } });
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder || "Select Date"}
      className="w-full border border-gray-300 rounded px-3 py-2"
      onBlur={handleBlur}   // 🔥 THIS FIXES COPY-PASTE
    />
  );
}
