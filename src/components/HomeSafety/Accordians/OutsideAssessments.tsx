"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface OutsideAssessmentsFormData {
  outside_paths_veranda_steps?: string;
  outside_paths_veranda_steps_strategy?: string;
  outside_pets_restrained?: string;
  outside_pets_restrained_strategy?: string;
  outside_lighting_adequate?: string;
  outside_lighting_adequate_strategy?: string;
  outside_door_easy_open?: string;
  outside_door_easy_open_strategy?: string;
  outside_lawn_mower_condition?: string;
  outside_lawn_mower_condition_strategy?: string;
  outside_electrical_condition?: string;
  outside_electrical_condition_strategy?: string;
  outside_fire_hazards?: string;
  outside_fire_hazards_strategy?: string;
}

interface OutsideAssessmentsProps {
  formData: OutsideAssessmentsFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function OutsideAssessmentsForm({
  formData,
  handleChange,
  uuid,
}: OutsideAssessmentsProps) {
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
    label: string
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
        <div className="flex flex-wrap gap-4 py-2">
          {assessmentOptions.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`${fieldName}_${option.value}`}
                name={fieldName}
                value={option.value}
                checked={formData[fieldName as keyof OutsideAssessmentsFormData] === option.value}
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
          value={formData[strategyFieldName as keyof OutsideAssessmentsFormData] as string || ""}
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
          OUTSIDE AREAS ASSESSMENT
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {renderAssessmentField(
            "outside_paths_veranda_steps",
            "outside_paths_veranda_steps_strategy",
            "Are paths/veranda/steps, surface level, non-slip/trip, uncluttered, adequate width?"
          )}

          {renderAssessmentField(
            "outside_pets_restrained",
            "outside_pets_restrained_strategy",
            "Are pets restrained and separated from worker?"
          )}

          {renderAssessmentField(
            "outside_lighting_adequate",
            "outside_lighting_adequate_strategy",
            "Is lighting adequate illumination at night?"
          )}

          {renderAssessmentField(
            "outside_door_easy_open",
            "outside_door_easy_open_strategy",
            "Is Door easy to open, clear of obstruction?"
          )}

          {renderAssessmentField(
            "outside_lawn_mower_condition",
            "outside_lawn_mower_condition_strategy",
            "Is lawn mower and gardening equipment appropriate design and in working order?"
          )}

          {renderAssessmentField(
            "outside_electrical_condition",
            "outside_electrical_condition_strategy",
            "Are electrical switches/power points/leads in good condition and easy to access?"
          )}

          {renderAssessmentField(
            "outside_fire_hazards",
            "outside_fire_hazards_strategy",
            "Are there any fire hazards? - heaters, BBQ (gas/coal), etc."
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="outside_residence_assessment"
        field={selectedField}
        url="home-safety-assessment/logs"
      />
    </div>
  );
}