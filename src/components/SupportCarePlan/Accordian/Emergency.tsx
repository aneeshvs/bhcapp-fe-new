"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import DatePickerSaveMany from "../../DatePickerSaveMany";

interface EmergencyFormData {
  participant_name: string;
  date: string;
  review_date: string;
}

interface EmergencyProps {
  formData: EmergencyFormData;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function EmergencyForm({
  formData,
  handleChange,
  uuid,
}: EmergencyProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Consents Information
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Participant Name */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("participant_name")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Participant Name</label>
              {hoveredField === "participant_name" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("participant_name")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="participant_name"
              placeholder="Enter participant's full name"
              value={formData.participant_name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date</label>
              {hoveredField === "date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="date"
                value={formData.date || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Review Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("review_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Review Date</label>
              {hoveredField === "review_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("review_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="review_date"
                value={formData.review_date || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="review_date"
              value={formData.review_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_care_plan_emergency_disaster" // Adjust table name as needed
        field={selectedField}
        url="support-care-plan/logs"
      />
    </div>
  );
}