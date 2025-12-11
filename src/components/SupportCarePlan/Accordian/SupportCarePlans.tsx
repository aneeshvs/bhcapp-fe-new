"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import DatePickerSaveMany from "../../DatePickerSaveMany";


interface ConsentsFormData {
  consents_participant_first_name: string;
  consents_participant_surname: string;
  consents_participant_dob: string;
  consents_goal_plan_start_date: string;
  consents_goal_plan_review_date: string;
}

interface ConsentsProps {
  formData: ConsentsFormData;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function ConsentsForm({
  formData,
  handleChange,
  uuid,
}: ConsentsProps) {
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
          {/* Participant First Name */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("consents_participant_first_name")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Participant First Name</label>
              {hoveredField === "consents_participant_first_name" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("consents_participant_first_name")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="consents_participant_first_name"
              placeholder="Enter participant's first name"
              value={formData.consents_participant_first_name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Participant Surname */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("consents_participant_surname")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Participant Surname</label>
              {hoveredField === "consents_participant_surname" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("consents_participant_surname")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="consents_participant_surname"
              placeholder="Enter participant's surname"
              value={formData.consents_participant_surname || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Participant Date of Birth */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("consents_participant_dob")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Participant Date of Birth</label>
              {hoveredField === "consents_participant_dob" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("consents_participant_dob")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="consents_participant_dob"
                value={formData.consents_participant_dob || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="consents_participant_dob"
              value={formData.consents_participant_dob || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Goal Plan Start Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("consents_goal_plan_start_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Goal Plan Start Date</label>
              {hoveredField === "consents_goal_plan_start_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("consents_goal_plan_start_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="consents_goal_plan_start_date"
                value={formData.consents_goal_plan_start_date || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="consents_goal_plan_start_date"
              value={formData.consents_goal_plan_start_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Goal Plan Review Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("consents_goal_plan_review_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Goal Plan Review Date</label>
              {hoveredField === "consents_goal_plan_review_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("consents_goal_plan_review_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="consents_goal_plan_review_date"
                value={formData.consents_goal_plan_review_date || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="consents_goal_plan_review_date"
              value={formData.consents_goal_plan_review_date || ""}
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
        table="support_care_plan" // You might need to adjust this table name
        field={selectedField}
        url="support-care-plan/logs"
      />
    </div>
  );
}