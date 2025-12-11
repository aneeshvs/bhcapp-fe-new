"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface InsideResidencesFormData {
  exit_doors_unobstructed?: string;
  exit_doors_unobstructed_strategy?: string;
  heaters_suitable?: string;
  heaters_suitable_strategy?: string;
  aids_equipment_condition?: string;
  aids_equipment_condition_strategy?: string;
  evidence_of_pests?: string;
  evidence_of_pests_strategy?: string;
  participant_open_door?: string;
  participant_open_door_strategy?: string;
  fire_hazards?: string;
  fire_hazards_strategy?: string;
  vacuum_cleaner_ok?: string;
  vacuum_cleaner_ok_strategy?: string;
  mop_bucket_ok?: string;
  mop_bucket_ok_strategy?: string;
  step_ladder_ok?: string;
  step_ladder_ok_strategy?: string;
  cleaning_substances_ok?: string;
  cleaning_substances_ok_strategy?: string;
}

interface InsideResidencesProps {
  formData: InsideResidencesFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function InsideResidencesForm({
  formData,
  handleChange,
  uuid,
}: InsideResidencesProps) {
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
                checked={formData[fieldName as keyof InsideResidencesFormData] === option.value}
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
          value={formData[strategyFieldName as keyof InsideResidencesFormData] as string || ""}
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
          HOME SAFETY - INSIDE RESIDENCE
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {renderAssessmentField(
            "exit_doors_unobstructed",
            "exit_doors_unobstructed_strategy",
            "Are all exit doors unobstructed and in working order?"
          )}

          {renderAssessmentField(
            "heaters_suitable",
            "heaters_suitable_strategy",
            "Are heaters in suitable position? (e.g. no bedding, clothes or water nearby)"
          )}

          {renderAssessmentField(
            "aids_equipment_condition",
            "aids_equipment_condition_strategy",
            "Are aids and equipment in good conditions? (e.g. handrails, adjustable bed, shower chair, hoist, access ramps)"
          )}

          {renderAssessmentField(
            "evidence_of_pests",
            "evidence_of_pests_strategy",
            "Is there evidence of pests? (e.g. ants, wasps, vermin)"
          )}

          {renderAssessmentField(
            "participant_open_door",
            "participant_open_door_strategy",
            "Is the Participant able to (entry/egress) open door? (if relevant)"
          )}

          {renderAssessmentField(
            "fire_hazards",
            "fire_hazards_strategy",
            "Are there any fire hazards? fireplaces, candles, etc."
          )}

          {renderAssessmentField(
            "vacuum_cleaner_ok",
            "vacuum_cleaner_ok_strategy",
            "Is Vacuum cleaner/carpet sweeper appropriate design and in working order?"
          )}

          {renderAssessmentField(
            "mop_bucket_ok",
            "mop_bucket_ok_strategy",
            "Is Mop and bucket appropriate design and in working order?"
          )}

          {renderAssessmentField(
            "step_ladder_ok",
            "step_ladder_ok_strategy",
            "Is Step ladder appropriate design and in working order?"
          )}

          {renderAssessmentField(
            "cleaning_substances_ok",
            "cleaning_substances_ok_strategy",
            "Are cleaning substances/products in original container and labelled appropriately?"
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="home_safety_inside_residence"
        field={selectedField}
        url="home-safety-assessment/logs"
      />
    </div>
  );
}