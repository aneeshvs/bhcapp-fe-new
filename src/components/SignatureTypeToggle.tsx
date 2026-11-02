"use client";
import React from "react";

interface SignatureTypeToggleProps {
  value?: "digital" | "paper" | "manual" | string;
  onChange: (value: "digital" | "paper") => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export default function SignatureTypeToggle({
  value = "digital",
  onChange,
  disabled = false,
  label = "Signature Method",
  className = "",
}: SignatureTypeToggleProps) {
  const isManual = value === "paper" || value === "manual";

  return (
    <div
      className={`mb-5 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-amber-50/40 border border-blue-200/80 rounded-xl p-4 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
            {label}
          </span>
          <p className="text-sm font-semibold text-gray-800">
            How is this form being signed?
          </p>
        </div>

        <div className="inline-flex rounded-lg bg-white p-1 border border-gray-300 shadow-inner">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("digital")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              !isManual
                ? "bg-blue-600 text-white shadow"
                : "text-gray-600 hover:text-gray-900"
            } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span>✍️</span>
            <span>Digital Signature</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("paper")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              isManual
                ? "bg-amber-600 text-white shadow"
                : "text-gray-600 hover:text-gray-900"
            } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span>📄</span>
            <span>Manual Signature (Paper Form)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
