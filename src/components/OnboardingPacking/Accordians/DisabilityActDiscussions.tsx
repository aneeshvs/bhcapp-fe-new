"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
export interface DisabilityActDiscussions {
  clarify_services_provided: number;
  verbal_information_intake_process: number;
  cost_of_services: number;
  participant_rights_handbook: number;
}

export interface DisabilityActDiscussionsProps {
  formData: DisabilityActDiscussions;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number } }
  ) => void;
  uuid?: string;
}
export default function DisabilityActDiscussionsForm({
  formData,
  handleChange,
  uuid,
}: DisabilityActDiscussionsProps) {
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

  const renderDiscussionField = (fieldName: string, label: string, description: string) => (
    <div
      className="relative p-4 border border-gray-200 rounded-lg bg-white"
      onMouseEnter={() => setHoveredField(fieldName)}
      onMouseLeave={() => setHoveredField(null)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <label className="block font-semibold text-gray-800 mb-1">
            {label}
          </label>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        </div>
        {hoveredField === fieldName && (
          <button
            type="button"
            onClick={() => handleViewLogs(fieldName)}
            className="text-xs btn-primary text-white px-3 py-1 rounded ml-4 flex-shrink-0"
          >
            View Logs
          </button>
        )}
      </div>
      
      <div className="flex gap-6">
        {yesNoOptions.map(({ label, value }) => (
          <label key={label} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={fieldName}
              value={value}
              checked={formData[fieldName as keyof DisabilityActDiscussions] === value}
              onChange={handleRadioNumberChange}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mb-6 border border-gray-300 rounded-lg shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h4 className="text-xl font-bold text-gray-900">
          IN LINE WITH THE DISABILITY ACT, PLEASE DISCUSS THE FOLLOWING
        </h4>
      </div>

      <div className="p-6 bg-white">
        <div className="grid grid-cols-1 gap-4">
          {renderDiscussionField(
            "clarify_services_provided",
            "Clarify Services Provided",
            "Clarify the type of services provided by the organisation"
          )}

          {renderDiscussionField(
            "verbal_information_intake_process",
            "Verbal Information - Intake Process",
            "Provide verbal information about intake process: steps and expected timeline"
          )}

          {renderDiscussionField(
            "cost_of_services",
            "Cost of Services",
            "Cost of services of all scheduled services"
          )}

          {renderDiscussionField(
            "participant_rights_handbook",
            "Participant Rights Handbook",
            "Participant right (Handbook) including complaint, feedback, safety, incident"
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="onboarding_packing_signoff_disability_act_discussion"
        field={selectedField}
        url="onboarding-packing-signoff/logs"
      />
    </div>
  );
}