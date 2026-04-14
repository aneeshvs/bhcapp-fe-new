"use client";
import React, { useState, useEffect } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface AssessmentPersonalCareFormData {
  showering?: number;
  showering_hazards?: string;
  showering_management_plan?: string;

  meal?: number;
  meal_hazards?: string;
  meal_management_plan?: string;

  toileting?: number;
  toileting_hazards?: string;
  toileting_management_plan?: string;

  grooming?: number;
  grooming_hazards?: string;
  grooming_management_plan?: string;

  repositioning_bed?: number;
  repositioning_bed_hazards?: string;
  repositioning_bed_management_plan?: string;

  repositioning_chair?: number;
  repositioning_chair_hazards?: string;
  repositioning_chair_management_plan?: string;

  mouthcare?: number;
  mouthcare_hazards?: string;
  mouthcare_management_plan?: string;

  skin_care?: number;
  skin_care_hazards?: string;
  skin_care_management_plan?: string;
}

interface AssessmentPersonalCareProps {
  formData: AssessmentPersonalCareFormData;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function AssessmentPersonalCareForm({
  formData,
  handleChange,
  uuid,
}: AssessmentPersonalCareProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // ✅ KEEP ALL YOUR EXISTING useEffects (NO CHANGE)
  useEffect(() => {
    if (formData.showering === 0) {
      if (formData.showering_hazards) {
        handleChange({ target: { name: "showering_hazards", value: "" } });
      }
      if (formData.showering_management_plan) {
        handleChange({ target: { name: "showering_management_plan", value: "" } });
      }
    }
  }, [formData.showering, formData.showering_hazards, formData.showering_management_plan, handleChange]);

  // (ALL OTHER useEffects SAME — keep as is)
  useEffect(() => {
    if (formData.meal === 0) {
      if (formData.meal_hazards) {
        handleChange({
          target: {
            name: 'meal_hazards',
            value: ''
          }
        });
      }
      if (formData.meal_management_plan) {
        handleChange({
          target: {
            name: 'meal_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.meal, formData.meal_hazards, formData.meal_management_plan, handleChange]);

  // Clear toileting hazards and management plan when toileting is set to "No"
  useEffect(() => {
    if (formData.toileting === 0) {
      if (formData.toileting_hazards) {
        handleChange({
          target: {
            name: 'toileting_hazards',
            value: ''
          }
        });
      }
      if (formData.toileting_management_plan) {
        handleChange({
          target: {
            name: 'toileting_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.toileting, formData.toileting_hazards, formData.toileting_management_plan, handleChange]);

  // Clear grooming hazards and management plan when grooming is set to "No"
  useEffect(() => {
    if (formData.grooming === 0) {
      if (formData.grooming_hazards) {
        handleChange({
          target: {
            name: 'grooming_hazards',
            value: ''
          }
        });
      }
      if (formData.grooming_management_plan) {
        handleChange({
          target: {
            name: 'grooming_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.grooming, formData.grooming_hazards, formData.grooming_management_plan, handleChange]);

  // Clear repositioning bed hazards and management plan when repositioning_bed is set to "No"
  useEffect(() => {
    if (formData.repositioning_bed === 0) {
      if (formData.repositioning_bed_hazards) {
        handleChange({
          target: {
            name: 'repositioning_bed_hazards',
            value: ''
          }
        });
      }
      if (formData.repositioning_bed_management_plan) {
        handleChange({
          target: {
            name: 'repositioning_bed_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.repositioning_bed, formData.repositioning_bed_hazards, formData.repositioning_bed_management_plan, handleChange]);

  // Clear repositioning chair hazards and management plan when repositioning_chair is set to "No"
  useEffect(() => {
    if (formData.repositioning_chair === 0) {
      if (formData.repositioning_chair_hazards) {
        handleChange({
          target: {
            name: 'repositioning_chair_hazards',
            value: ''
          }
        });
      }
      if (formData.repositioning_chair_management_plan) {
        handleChange({
          target: {
            name: 'repositioning_chair_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.repositioning_chair, formData.repositioning_chair_hazards, formData.repositioning_chair_management_plan, handleChange]);

  // Clear mouthcare hazards and management plan when mouthcare is set to "No"
  useEffect(() => {
    if (formData.mouthcare === 0) {
      if (formData.mouthcare_hazards) {
        handleChange({
          target: {
            name: 'mouthcare_hazards',
            value: ''
          }
        });
      }
      if (formData.mouthcare_management_plan) {
        handleChange({
          target: {
            name: 'mouthcare_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.mouthcare, formData.mouthcare_hazards, formData.mouthcare_management_plan, handleChange]);

  // Clear skin care hazards and management plan when skin_care is set to "No"
  useEffect(() => {
    if (formData.skin_care === 0) {
      if (formData.skin_care_hazards) {
        handleChange({
          target: {
            name: 'skin_care_hazards',
            value: ''
          }
        });
      }
      if (formData.skin_care_management_plan) {
        handleChange({
          target: {
            name: 'skin_care_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.skin_care, formData.skin_care_hazards, formData.skin_care_management_plan, handleChange]);



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

  const renderYesNoField = (
    fieldName: string,
    label: string,
    hazardsField?: string,
    managementPlanField?: string
  ) => (
    <div className="w-full border-b pb-4">
      {/* Question */}
      <div
        className="relative"
        onMouseEnter={() => setHoveredField(fieldName)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block font-medium">{label}</label>

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

        <div className="flex gap-4">
          {yesNoOptions.map(({ label, value }) => (
            <label key={label} className="flex items-center gap-2">
              <input
                type="radio"
                name={fieldName}
                value={value}
                checked={
                  formData[
                    fieldName as keyof AssessmentPersonalCareFormData
                  ] === value
                }
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Conditional Fields */}
      {formData[fieldName as keyof AssessmentPersonalCareFormData] === 1 &&
        hazardsField &&
        managementPlanField && (
          <div className="mt-3 flex flex-col gap-3">
            {/* Hazards */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField(hazardsField)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Hazards Identified</label>

                {hoveredField === hazardsField && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs(hazardsField)}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>

              <textarea
                name={hazardsField}
                value={
                  formData[
                    hazardsField as keyof AssessmentPersonalCareFormData
                  ] || ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>

            {/* Management */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField(managementPlanField)}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Management Plan</label>

                {hoveredField === managementPlanField && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs(managementPlanField)}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>

              <textarea
                name={managementPlanField}
                value={
                  formData[
                    managementPlanField as keyof AssessmentPersonalCareFormData
                  ] || ""
                }
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          </div>
        )}
    </div>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold text-heading">
          ASSESSMENT PERSONAL CARE
        </h4>
      </div>

      <div className="p-4 bg-white flex flex-col gap-6">
        {/* Basic */}
        <div>
          <h5 className="font-semibold text-lg mb-4 text-gray-700 border-b pb-2">
              Basic Personal Care
            </h5>

          <div className="flex flex-col gap-4">
            {renderYesNoField("showering", "Does the participant require assistance with showering?", "showering_hazards", "showering_management_plan")}
            {renderYesNoField("meal", "Does the participant require assistance with meal?", "meal_hazards", "meal_management_plan")}
            {renderYesNoField("toileting", "Does the participant require assistance with Toileting?", "toileting_hazards", "toileting_management_plan")}
            {renderYesNoField("grooming", "Does the participant require assistance Grooming?", "grooming_hazards", "grooming_management_plan")}
          </div>
        </div>

        {/* Repositioning */}
        <div>
          <h5 className="font-semibold text-lg mb-4 text-gray-700 border-b pb-2">
              Repositioning
            </h5>

          <div className="flex flex-col gap-4">
            {renderYesNoField("repositioning_bed", "Does the participant require assistance with Repositioning in bed?", "repositioning_bed_hazards", "repositioning_bed_management_plan")}
            {renderYesNoField("repositioning_chair", "Does the participant require assistance with Repositioning in chair?", "repositioning_chair_hazards", "repositioning_chair_management_plan")}
          </div>
        </div>

        {/* Specialized */}
        <div>
          <h5 className="font-semibold text-lg mb-4 text-gray-700 border-b pb-2">
              Specialized Care
            </h5>

          <div className="flex flex-col gap-4">
            {renderYesNoField("mouthcare", "Does the participant require assistance with Mouthcare?", "mouthcare_hazards", "mouthcare_management_plan")}
            {renderYesNoField("skin_care", "Does the participant require assistance with Skin care?", "skin_care_hazards", "skin_care_management_plan")}
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="individual_risk_assessment_personal_care"
        field={selectedField}
        url="risk-assessment/logs"
      />
    </div>
  );
}