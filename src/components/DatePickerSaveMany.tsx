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

// Helper function to normalize any incoming date string (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, etc.) to ISO YYYY-MM-DD
function parseAndFormatToIso(rawDate: string | null | undefined): string {
  if (!rawDate) return "";
  const str = String(rawDate).trim();
  if (!str) return "";

  // 1. Check if already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // 2. Extract DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY (e.g. '13/03/1993 (62)')
  const dmyMatch = str.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
  if (dmyMatch) {
    const p1 = parseInt(dmyMatch[1], 10);
    const p2 = parseInt(dmyMatch[2], 10);
    const year = dmyMatch[3];
    if (p1 > 12) {
      return `${year}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
    }
    if (p2 > 12) {
      return `${year}-${String(p1).padStart(2, "0")}-${String(p2).padStart(2, "0")}`;
    }
    return `${year}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
  }

  // 3. Extract YYYY/MM/DD or YYYY-MM-DD
  const ymdMatch = str.match(/(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/);
  if (ymdMatch) {
    return `${ymdMatch[1]}-${String(ymdMatch[2]).padStart(2, "0")}-${String(ymdMatch[3]).padStart(2, "0")}`;
  }

  return str;
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
    if (disabled) return;

    const isoValue = parseAndFormatToIso(value);

    // Convert ISO YYYY-MM-DD to Flatpickr's configured d-m-Y format (DD-MM-YYYY)
    let dmyString: string | undefined = undefined;
    if (isoValue && isoValue.includes("-")) {
      const [y, m, d] = isoValue.split("-");
      if (y && m && d) {
        dmyString = `${d}-${m}-${y}`;
      }
    }

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
      defaultDate: dmyString || undefined,
      clickOpens: !disabled,
      disableMobile: true,

      onChange(selectedDates) {
        emitChange(selectedDates[0]);
      },

      onClose(selectedDates) {
        emitChange(selectedDates[0]);
      },
    });

    // Sync display when parent value changes
    if (dmyString && inputRef.current) {
      inputRef.current.value = dmyString;
      fp.setDate(dmyString, false);
    } else if (!value && inputRef.current) {
      inputRef.current.value = "";
      fp.clear(false);
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
