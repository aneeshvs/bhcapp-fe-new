"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface KitchenAssessmentsFormData {
  floor_condition?: string;
  floor_condition_strategy?: string;
  electrical_condition?: string;
  electrical_condition_strategy?: string;
  ventilation_condition?: string;
  ventilation_condition_strategy?: string;
  bench_condition?: string;
  bench_condition_strategy?: string;
  stove_condition?: string;
  stove_condition_strategy?: string;
  fridge_condition?: string;
  fridge_condition_strategy?: string;
  bath_access?: string;
  bath_access_strategy?: string;
  toilet_access?: string;
  toilet_access_strategy?: string;
  privacy_condition?: string;
  privacy_condition_strategy?: string;
  laundry_condition?: string;
  laundry_condition_strategy?: string;
  ironing_condition?: string;
  ironing_condition_strategy?: string;
  manual_handling_risks?: string;
  manual_handling_strategy?: string;
  kitchen_fire_hazards?: string;
  kitchen_fire_hazards_strategy?: string;
}

interface KitchenAssessmentsProps {
  formData: KitchenAssessmentsFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function KitchenAssessmentsForm({
  formData,
  handleChange,
  uuid,
}: KitchenAssessmentsProps) {
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
                checked={formData[fieldName as keyof KitchenAssessmentsFormData] === option.value}
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
          value={formData[strategyFieldName as keyof KitchenAssessmentsFormData] as string || ""}
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
          KITCHEN & UTILITY AREAS ASSESSMENT
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {renderAssessmentField(
            "floor_condition",
            "floor_condition_strategy",
            "Are floor surfaces, level, in good condition, no trip hazards (e.g. mats)"
          )}

          {renderAssessmentField(
            "electrical_condition",
            "electrical_condition_strategy",
            "Are electrical switches/power points /leads appear in good condition, easy to access and suitable location? (away from water and direct heat)"
          )}

          {renderAssessmentField(
            "ventilation_condition",
            "ventilation_condition_strategy",
            "Is ventilation, lighting and drainage adequate?"
          )}

          {renderAssessmentField(
            "bench_condition",
            "bench_condition_strategy",
            "Are benches/surfaces clean and adequate room/height to work from"
          )}

          {renderAssessmentField(
            "stove_condition",
            "stove_condition_strategy",
            "Is Stove and food preparation equipment clean and in good working order?"
          )}

          {renderAssessmentField(
            "fridge_condition",
            "fridge_condition_strategy",
            "Is fridge clean and food stored appropriately?"
          )}

          {renderAssessmentField(
            "bath_access",
            "bath_access_strategy",
            "Is Bath/shower an appropriate design for easy access, non-slip surface?"
          )}

          {renderAssessmentField(
            "toilet_access",
            "toilet_access_strategy",
            "Is toilet accessible for cleaning and seat intact?"
          )}

          {renderAssessmentField(
            "privacy_condition",
            "privacy_condition_strategy",
            "Is privacy adequate for staff use? (doors closed and locked)"
          )}

          {renderAssessmentField(
            "laundry_condition",
            "laundry_condition_strategy",
            "Is washing machine/dryer an appropriate design, clean and in working order?"
          )}

          {renderAssessmentField(
            "ironing_condition",
            "ironing_condition_strategy",
            "Is Iron/ironing board/clothesline an appropriate design and in working order?"
          )}

          {renderAssessmentField(
            "manual_handling_risks",
            "manual_handling_strategy",
            "Are the manual handling risks associated with Participant transfers and other manual handling duties, assessed and controlled? e.g. - Transfers IN/OUT of bed, transferring the wheelchair into a car. (If Yes, discuss manual handling requirements)"
          )}

          {renderAssessmentField(
            "kitchen_fire_hazards",
            "kitchen_fire_hazards_strategy",
            "Are there any fire hazards? fireplaces, candles, etc."
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="kitchen_bathroom_safety_check"
        field={selectedField}
        url="home-safety-assessment/logs"
      />
    </div>
  );
}