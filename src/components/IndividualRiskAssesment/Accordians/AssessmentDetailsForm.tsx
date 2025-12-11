"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface AssessmentDetailsFormData {
  vulnerability?: string;
  review_frequency?: string;
  dependent_on_homecare?: number; // 0 or 1 for boolean
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
          {/* Vulnerability Selection */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("vulnerability")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Vulnerability</label>
              {hoveredField === "vulnerability" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("vulnerability")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-4 py-2">
              {vulnerabilityOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`vulnerability_${option.value}`}
                    name="vulnerability"
                    value={option.value}
                    checked={formData.vulnerability === option.value}
                    onChange={() => handleRadioStringChange("vulnerability", option.value)}
                    className="mr-2"
                  />
                  <label htmlFor={`vulnerability_${option.value}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Review Frequency Selection */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("review_frequency")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Review Frequency</label>
              {hoveredField === "review_frequency" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("review_frequency")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-4 py-2">
              {reviewFrequencyOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`review_frequency_${option.value}`}
                    name="review_frequency"
                    value={option.value}
                    checked={formData.review_frequency === option.value}
                    onChange={() => handleRadioStringChange("review_frequency", option.value)}
                    className="mr-2"
                  />
                  <label htmlFor={`review_frequency_${option.value}`}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Dependent on Homecare - Radio Buttons */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("dependent_on_homecare")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Are you reliant on Best of Home Care for your daily needs?</label>
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