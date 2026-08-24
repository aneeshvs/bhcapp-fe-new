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

export default function DatePicker({
  name,
  value,
  onChange,
  placeholder,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const isoValue = parseAndFormatToIso(value);

    // Convert ISO YYYY-MM-DD to Flatpickr's configured d-m-Y format (DD-MM-YYYY)
    let dmyString: string | undefined = undefined;
    if (isoValue && isoValue.includes("-")) {
      const [y, m, d] = isoValue.split("-");
      if (y && m && d) {
        dmyString = `${d}-${m}-${y}`;
      }
    }

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
      defaultDate: dmyString || undefined,
      disableMobile: true,

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
    if (dmyString && inputRef.current) {
      inputRef.current.value = dmyString;
      fp.setDate(dmyString, false);
    } else if (!value && inputRef.current) {
      inputRef.current.value = "";
      fp.clear(false);
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
