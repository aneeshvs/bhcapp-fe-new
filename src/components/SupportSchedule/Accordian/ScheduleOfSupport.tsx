"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import DatePickerSaveMany from "../../DatePickerSaveMany";


interface ScheduleOfSupportsFormData {
  participant_name: string;
  creation_date: string;
  funding_review_date: string;
  support_on_public_holiday: number;
}

interface ScheduleOfSupportsProps {
  formData: ScheduleOfSupportsFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function ScheduleOfSupportsForm({
  formData,
  handleChange,
  uuid,
}: ScheduleOfSupportsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };
  const yesNoOptions = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  const handleRadioNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value: Number(value),
      },
    });
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          SCHEDULE OF SUPPORTS
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
              placeholder="Enter participant name"
              value={formData.participant_name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Creation Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("creation_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                Schedule of Support Creation Date (Today’s Date):
              </label>
              {hoveredField === "creation_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("creation_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="creation_date"
                value={formData.creation_date || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="creation_date"
              value={formData.creation_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Funding Review Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("funding_review_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                Service Agreement and Funding Review Date
              </label>
              {hoveredField === "funding_review_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("funding_review_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="funding_review_date"
                value={formData.funding_review_date || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="funding_review_date"
              value={formData.funding_review_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Support on Public Holiday */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("support_on_public_holiday")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                Support on Public Holiday
              </label>
              {hoveredField === "support_on_public_holiday" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("support_on_public_holiday")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex gap-4">
                {yesNoOptions.map(({ label, value }) => (
                  <label key={label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="support_on_public_holiday"
                      value={value}
                      checked={formData.support_on_public_holiday === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
            <div className="text-gray-700 space-y-3 w-full">
              <p className="text-gray-600 mb-4">
                <b>note:</b>
              </p>
              <p>
                Shifts on a Public Holiday will incur a higher rate per hour
                and will be priced in the Schedule of Supports. This may impact
                on scope of support and lower the hours of support available
              </p>
            </div>
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="schedule_of_support"
        field={selectedField}
        url="schedule-of-supports/logs"
      />
    </div>
  );
}
