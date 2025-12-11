"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface HomeMiscellaneousFormData {
  misc_children_living_at_home?: string;
  misc_children_living_at_home_strategy?: string;
  misc_weapons_stored_appropriately?: string;
  misc_weapons_stored_appropriately_strategy?: string;
  misc_smoking_outside_only?: string;
  misc_smoking_outside_only_strategy?: string;
  misc_mobility_issues?: string;
  misc_mobility_issues_strategy?: string;
  misc_equipment_good_condition?: string;
  misc_equipment_good_condition_strategy?: string;
  misc_ppe_requirements?: string;
  misc_ppe_requirements_strategy?: string;
  misc_personal_threats?: string;
  misc_personal_threats_strategy?: string;
  misc_safe_neighbourhood?: string;
  misc_safe_neighbourhood_strategy?: string;
  misc_aggression_in_home?: string;
  misc_aggression_in_home_strategy?: string;
}

interface HomeMiscellaneousProps {
  formData: HomeMiscellaneousFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function HomeMiscellaneousForm({
  formData,
  handleChange,
  uuid,
}: HomeMiscellaneousProps) {
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
                checked={formData[fieldName as keyof HomeMiscellaneousFormData] === option.value}
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
          value={formData[strategyFieldName as keyof HomeMiscellaneousFormData] as string || ""}
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
          MISCELLANEOUS HOME SAFETY ASSESSMENT
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {renderAssessmentField(
            "misc_children_living_at_home",
            "misc_children_living_at_home_strategy",
            "Are children living at home or is it expected children may be at home during service?"
          )}

          {renderAssessmentField(
            "misc_weapons_stored_appropriately",
            "misc_weapons_stored_appropriately_strategy",
            "Are there weapons (e.g. guns, knives) stored appropriately? (gun safe, bolts/ammo, separate lockable draw)"
          )}

          {renderAssessmentField(
            "misc_smoking_outside_only",
            "misc_smoking_outside_only_strategy",
            "Smoking? outside and not in presence of staff"
          )}

          {renderAssessmentField(
            "misc_mobility_issues",
            "misc_mobility_issues_strategy",
            "Does the Participant have mobility issues? e.g. wheelchair or other"
          )}

          {renderAssessmentField(
            "misc_equipment_good_condition",
            "misc_equipment_good_condition_strategy",
            "Is the wheelchair and other equipment used in good working condition?"
          )}

          {renderAssessmentField(
            "misc_ppe_requirements",
            "misc_ppe_requirements_strategy",
            "Are there any PPE requirements? (gloves, eye protection, mask, etc.)moved, or easy to move? (e.g. chairs)"
          )}

          {renderAssessmentField(
            "misc_personal_threats",
            "misc_personal_threats_strategy",
            "Are there any known personal threats or safety concerns?"
          )}

          {renderAssessmentField(
            "misc_safe_neighbourhood",
            "misc_safe_neighbourhood_strategy",
            "Is it generally a safe neighbourhood? Other"
          )}

          {renderAssessmentField(
            "misc_aggression_in_home",
            "misc_aggression_in_home_strategy",
            "Does the participant or others in home become aggressive?"
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="home_safety_miscellaneous"
        field={selectedField}
        url="home-safety-assessment/logs"
      />
    </div>
  );
}