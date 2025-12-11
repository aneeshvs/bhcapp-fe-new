"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface HallwaysChecksFormData {
  hallways_lounge_dining_bedroom?: string;
  hallways_lounge_dining_bedroom_strategy?: string;
  pests_evidence?: string;
  pests_evidence_strategy?: string;
  lighting_workspace?: string;
  lighting_workspace_strategy?: string;
  furniture_stable?: string;
  furniture_stable_strategy?: string;
  bed_adjustable?: string;
  bed_adjustable_strategy?: string;
  electrical_switches?: string;
  electrical_switches_strategy?: string;
  private_sleep_space?: string;
  private_sleep_space_strategy?: string;
  hallways_fire_hazards?: string;
  hallways_fire_hazards_strategy?: string;
}

interface HallwaysChecksProps {
  formData: HallwaysChecksFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function HallwaysChecksForm({
  formData,
  handleChange,
  uuid,
}: HallwaysChecksProps) {
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
                checked={formData[fieldName as keyof HallwaysChecksFormData] === option.value}
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
          value={formData[strategyFieldName as keyof HallwaysChecksFormData] as string || ""}
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
          HALLWAYS & LIVING AREAS CHECK
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {renderAssessmentField(
            "hallways_lounge_dining_bedroom",
            "hallways_lounge_dining_bedroom_strategy",
            "Are hallways, lounge, dining, and bedroom areas clear and safe?"
          )}

          {renderAssessmentField(
            "pests_evidence",
            "pests_evidence_strategy",
            "Is there evidence of pests in these areas?"
          )}

          {renderAssessmentField(
            "lighting_workspace",
            "lighting_workspace_strategy",
            "Is there adequate lighting and workspace to undertake tasks?"
          )}

          {renderAssessmentField(
            "furniture_stable",
            "furniture_stable_strategy",
            "Is furniture stable and does not need to be moved, or easy to move? (e.g. chairs)"
          )}

          {renderAssessmentField(
            "bed_adjustable",
            "bed_adjustable_strategy",
            "Is bed adjustable or adequate height to work from?"
          )}

          {renderAssessmentField(
            "electrical_switches",
            "electrical_switches_strategy",
            "Are electrical switches/power points/leads in good condition and easy to access?"
          )}

          {renderAssessmentField(
            "private_sleep_space",
            "private_sleep_space_strategy",
            "Is there a private sleeping space with clean bed linen available for sleepover shifts?"
          )}

          {renderAssessmentField(
            "hallways_fire_hazards",
            "hallways_fire_hazards_strategy",
            "Are there any fire hazards? - heaters, electric blankets, etc."
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="hallways_safety_check"
        field={selectedField}
        url="home-safety-assessment/logs"
      />
    </div>
  );
}