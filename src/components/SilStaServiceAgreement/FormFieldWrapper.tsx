import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface FormFieldWrapperProps {
  label: string;
  fieldName: string;
  type?: string;
  value: any;
  onChange: (e: any) => void;
  uuid?: string;
  apiEndpoint: string;
  options?: { label: string; value: string }[];
  classNameOverride?: string;
  hideLabel?: boolean;
  wrapperClassName?: string;
  rows?: number;
  table?: string;
}

export default function FormFieldWrapper({
  label,
  fieldName,
  type = "text",
  value,
  onChange,
  uuid,
  apiEndpoint,
  options,
  classNameOverride,
  hideLabel = false,
  wrapperClassName = "relative mb-4 w-full",
  rows = 4,
  table
}: FormFieldWrapperProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const effectiveUuid = uuid || undefined;

  const handleViewLogs = () => {
    setIsModalOpen(true);
  };

  return (
    <div
      className={wrapperClassName}
      onMouseEnter={() => setHoveredField(fieldName)}
      onMouseLeave={() => setHoveredField(null)}
    >
      {!hideLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      {type === "textarea" ? (
        <textarea
          name={fieldName}
          value={value || ""}
          onChange={onChange}
          className={classNameOverride || "w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200 focus:border-indigo-500"}
          rows={rows}
        />
      ) : type === "select" ? (
        <select
          name={fieldName}
          value={value || ""}
          onChange={onChange}
          className={classNameOverride || "w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200 focus:border-indigo-500"}
        >
          <option value="">Select...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={fieldName}
          value={value || ""}
          onChange={onChange}
          className={classNameOverride || "w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200 focus:border-indigo-500"}
        />
      )}

      {effectiveUuid && hoveredField === fieldName && (
        <button
          type="button"
          onClick={handleViewLogs}
          className="absolute top-0 right-0 mt-1 text-xs btn-primary text-white px-2 py-1 rounded shadow-sm z-10"
        >
          View Logs
        </button>
      )}

      {isModalOpen && effectiveUuid && (
        <FieldLogsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          uuid={effectiveUuid}
          field={fieldName}
          table={table || ""}
          url={apiEndpoint}
        />
      )}
    </div>
  );
}
