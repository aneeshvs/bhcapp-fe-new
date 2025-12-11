"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface HomeSafetyOutsideEntriesFormData {
  parking_adequate?: string;
  parking_adequate_strategy?: string;
  pathway_surface?: string;
  pathway_surface_strategy?: string;
  gates_entry_easy?: string;
  gates_entry_easy_strategy?: string;
  lighting_adequate?: string;
  lighting_adequate_strategy?: string;
  outdoor_fire_hazards?: string;
  outdoor_fire_hazards_strategy?: string;
}

interface HomeSafetyOutsideEntriesProps {
  formData: HomeSafetyOutsideEntriesFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function HomeSafetyOutsideEntriesForm({
  formData,
  handleChange,
  uuid,
}: HomeSafetyOutsideEntriesProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleRadioChange = (fieldName: string, value: string) => {
    handleChange({
      target: {
        name: fieldName,
        value,
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value,
      },
    });
  };

  const assessmentOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "N/A", label: "N/A" },
    { value: "Unsure", label: "Unsure" },
  ];

  const renderAssessmentField = (
    fieldName: string,
    strategyFieldName: string,
    label: string,
    description?: string
  ) => (
    <div className="border-b pb-4 last:border-b-0">
      <div
        className="relative mb-3"
        onMouseEnter={() => setHoveredField(fieldName)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block font-medium text-gray-700">
            {label}
          </label>
          {hoveredField === fieldName && (
            <button
              type="button"
              onClick={() => handleViewLogs(fieldName)}
              className="text-xs btn-primary text-white px-2 py-1 rounded"
            >
              View Logs
            </button>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-600 mb-2">{description}</p>
        )}
        <div className="flex flex-wrap gap-4 py-2">
          {assessmentOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`${fieldName}_${option.value}`}
                name={fieldName}
                value={option.value}
                checked={formData[fieldName as keyof HomeSafetyOutsideEntriesFormData] === option.value}
                onChange={() => handleRadioChange(fieldName, option.value)}
                className="mr-2"
              />
              <label htmlFor={`${fieldName}_${option.value}`}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Textarea */}
      <div
        className="relative"
        onMouseEnter={() => setHoveredField(strategyFieldName)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block font-medium text-gray-700">
            Where there is a risk identified, please outline the management strategy
          </label>
          {hoveredField === strategyFieldName && (
            <button
              type="button"
              onClick={() => handleViewLogs(strategyFieldName)}
              className="text-xs btn-primary text-white px-2 py-1 rounded"
            >
              View Logs
            </button>
          )}
        </div>
        <textarea
          name={strategyFieldName}
          value={formData[strategyFieldName as keyof HomeSafetyOutsideEntriesFormData] as string || ""}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter strategies, recommendations, or additional notes..."
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          HOME SAFETY - OUTSIDE ENTRIES
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {renderAssessmentField(
            "parking_adequate",
            "parking_adequate_strategy",
            "Is parking adequate on street?",
          )}

          {renderAssessmentField(
            "pathway_surface",
            "pathway_surface_strategy",
            "Are Pathway/veranda/stairs level surface, non-slip, uncluttered, adequate width?",
          )}

          {renderAssessmentField(
            "gates_entry_easy",
            "gates_entry_easy_strategy",
            "Are gates and entry door easy to open, clear of obstruction??",
          )}

          {renderAssessmentField(
            "lighting_adequate",
            "lighting_adequate_strategy",
            "Are lighting adequate illumination from street to front door at night?",
          )}

          {renderAssessmentField(
            "outdoor_fire_hazards",
            "outdoor_fire_hazards_strategy",
            "Are there any outdoor fire hazards? (Potential high grass / bush fire / Snakes)",
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="home_safety_outside_entry"
        field={selectedField}
        url="home-safety-assessment/logs"
      />
    </div>
  );
}