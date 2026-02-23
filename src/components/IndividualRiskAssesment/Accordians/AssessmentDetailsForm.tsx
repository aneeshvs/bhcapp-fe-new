"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface AssessmentDetailsFormData {
  vulnerability?: string;
  review_frequency?: string;
  dependent_on_homecare?: number; // 0 or 1 for boolean
  has_only_1_support_worker?: number; // 0 or 1 for boolean
  receives_personal_care?: number; // 0 or 1 for boolean
  reason_not_reliant?: string;
}

interface AssessmentDetailsProps {
  formData: AssessmentDetailsFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function AssessmentDetailsForm({
  formData,
  handleChange,
  uuid,
}: AssessmentDetailsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleRadioNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value: Number(value),
      },
    });
  };

  const handleRadioStringChange = (fieldName: string, value: string) => {
    handleChange({
      target: {
        name: fieldName,
        value,
      },
    });
  };

  const vulnerabilityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const reviewFrequencyOptions = [
    { value: "3_months", label: "3 Months" },
    { value: "6_months", label: "6 Months" },
    { value: "12_months", label: "12 Months" },
  ];

  const yesNoOptions = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          ASSESSMENT DETAILS
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-4">
          {/* Has Only 1 Support Worker */}
          <div className="border-b border-gray-200 pb-6">
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("has_only_1_support_worker")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Has only 1 support worker allocated to work with them
                </label>
                {hoveredField === "has_only_1_support_worker" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("has_only_1_support_worker")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                {yesNoOptions.map(({ label, value }) => (
                  <label key={label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="has_only_1_support_worker"
                      value={value}
                      checked={formData.has_only_1_support_worker === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Receives Personal Care */}
          <div className="border-b border-gray-200 pb-6">
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("receives_personal_care")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Receives personal care (showering, toileting, changing)
                </label>
                {hoveredField === "receives_personal_care" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("receives_personal_care")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                {yesNoOptions.map(({ label, value }) => (
                  <label key={label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="receives_personal_care"
                      value={value}
                      checked={formData.receives_personal_care === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {(formData.has_only_1_support_worker === 1 || formData.receives_personal_care === 1) && (
            <div className="mb-4 pl-4 border-l-4 border-yellow-400 bg-yellow-50 p-3 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Notice:</strong> If either of the boxes above are ticked, they must receive a
                'check in' every three (3) months.
              </p>
            </div>
          )}

          {/* Dependent on Homecare - Radio Buttons */}
          <div className="border-b border-gray-200 pb-6">
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("dependent_on_homecare")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Are you reliant on Best of Home Care for your daily needs?
                </label>
                {hoveredField === "dependent_on_homecare" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("dependent_on_homecare")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                {yesNoOptions.map(({ label, value }) => (
                  <label key={label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dependent_on_homecare"
                      value={value}
                      checked={formData.dependent_on_homecare === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {formData.dependent_on_homecare === 0 && (
              <div className="grid grid-cols-1 gap-4 mt-4 pl-4 border-l-2 border-blue-200">
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("reason_not_reliant")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">Outline the reasons why they are not reliant on BHC for daily needs</label>
                    {hoveredField === "reason_not_reliant" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("reason_not_reliant")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="reason_not_reliant"
                    placeholder="Provide reasons"
                    value={formData.reason_not_reliant || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            )}

            {formData.dependent_on_homecare === 1 && (
              <div className="mt-4 pl-4 border-l-4 border-blue-400 bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> (If yes, Emergency Plan in Support Care Plan.)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="individual_risk_assessment_detail"
        field={selectedField}
        url="risk-assessment/logs"
      />
    </div>
  );
}