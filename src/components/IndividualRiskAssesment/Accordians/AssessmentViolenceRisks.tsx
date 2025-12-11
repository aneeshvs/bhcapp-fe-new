"use client";
import React, { useState, useEffect } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface AssessmentViolenceRisksFormData {
  // Physical Aggression
  physical_aggression?: number;
  physical_hazards?: string;
  physical_management_plan?: string;
  physical_bsp_plan?: number;

  // Verbal Aggression
  verbal_aggression?: string;
  verbal_hazards?: string;
  verbal_management_plan?: string;
  verbal_bsp_plan?: number;
  verbal_aggression_notes?: string;

  // Client Aggression
  client_aggression?: number;
  client_hazards?: string;
  client_management_plan?: string;
  client_bsp_plan?: number;

  // Self Harm
  self_harm?: number;
  self_harm_hazards?: string;
  self_harm_management_plan?: string;
  self_harm_bsp_plan?: number;

  // Drug & Alcohol Use
  drug_alcohol_use?: number;
  drug_alcohol_hazards?: string;
  drug_alcohol_management_plan?: string;
  drug_alcohol_bsp_plan?: number;

  // Sexual Abuse History
  sexual_abuse_history?: number;
  sexual_abuse_hazards?: string;
  sexual_abuse_management_plan?: string;
  sexual_abuse_bsp_plan?: number;

  // Emotional Manipulation
  emotional_manipulation?: number;
  emotional_hazards?: string;
  emotional_management_plan?: string;
  emotional_bsp_plan?: number;

  // Other Known Risks
  other_known_risks?: number;
  other_risks_hazards?: string;
  other_risks_management_plan?: string;
  other_risks_bsp_plan?: number;

  // Finance Management
  finance_management?: string;
  finance_hazards?: string;
  finance_management_plan?: string;
  finance_bsp_plan?: number;
  finance_management_notes?: string;
}

interface AssessmentViolenceRisksProps {
  formData: AssessmentViolenceRisksFormData;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function AssessmentViolenceRisksForm({
  formData,
  handleChange,
  uuid,
}: AssessmentViolenceRisksProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const clearRiskFields = (riskField: string, fieldsToClear: string[]) => {
    if (formData[riskField as keyof AssessmentViolenceRisksFormData] === 0) {
      fieldsToClear.forEach(fieldName => {
        if (formData[fieldName as keyof AssessmentViolenceRisksFormData]) {
          handleChange({
            target: {
              name: fieldName,
              value: ''
            }
          });
        }
      });
    }
  };

  // Physical Aggression
  useEffect(() => {
    clearRiskFields('physical_aggression', [
      'physical_hazards',
      'physical_management_plan',
      'physical_bsp_plan'
    ]);
  }, [formData.physical_aggression, formData.physical_hazards, formData.physical_management_plan, formData.physical_bsp_plan, handleChange]);

  // Verbal Aggression
  useEffect(() => {
    clearRiskFields('verbal_aggression', [
      'verbal_hazards',
      'verbal_management_plan',
      'verbal_bsp_plan'
    ]);
  }, [formData.verbal_aggression, formData.verbal_hazards, formData.verbal_management_plan, formData.verbal_bsp_plan, handleChange]);

  // Client Aggression
  useEffect(() => {
    clearRiskFields('client_aggression', [
      'client_hazards',
      'client_management_plan',
      'client_bsp_plan'
    ]);
  }, [formData.client_aggression, formData.client_hazards, formData.client_management_plan, formData.client_bsp_plan, handleChange]);

  // Self Harm
  useEffect(() => {
    clearRiskFields('self_harm', [
      'self_harm_hazards',
      'self_harm_management_plan',
      'self_harm_bsp_plan'
    ]);
  }, [formData.self_harm, formData.self_harm_hazards, formData.self_harm_management_plan, formData.self_harm_bsp_plan, handleChange]);

  // Drug & Alcohol Use
  useEffect(() => {
    clearRiskFields('drug_alcohol_use', [
      'drug_alcohol_hazards',
      'drug_alcohol_management_plan',
      'drug_alcohol_bsp_plan'
    ]);
  }, [formData.drug_alcohol_use, formData.drug_alcohol_hazards, formData.drug_alcohol_management_plan, formData.drug_alcohol_bsp_plan, handleChange]);

  // Sexual Abuse History
  useEffect(() => {
    clearRiskFields('sexual_abuse_history', [
      'sexual_abuse_hazards',
      'sexual_abuse_management_plan',
      'sexual_abuse_bsp_plan'
    ]);
  }, [formData.sexual_abuse_history, formData.sexual_abuse_hazards, formData.sexual_abuse_management_plan, formData.sexual_abuse_bsp_plan, handleChange]);

  // Emotional Manipulation
  useEffect(() => {
    clearRiskFields('emotional_manipulation', [
      'emotional_hazards',
      'emotional_management_plan',
      'emotional_bsp_plan'
    ]);
  }, [formData.emotional_manipulation, formData.emotional_hazards, formData.emotional_management_plan, formData.emotional_bsp_plan, handleChange]);

  // Other Known Risks
  useEffect(() => {
    clearRiskFields('other_known_risks', [
      'other_risks_hazards',
      'other_risks_management_plan',
      'other_risks_bsp_plan'
    ]);
  }, [formData.other_known_risks, formData.other_risks_hazards, formData.other_risks_management_plan, formData.other_risks_bsp_plan, handleChange]);

  // Finance Management
  useEffect(() => {
    clearRiskFields('finance_management', [
      'finance_hazards',
      'finance_management_plan',
      'finance_bsp_plan'
    ]);
  }, [formData.finance_management, formData.finance_hazards, formData.finance_management_plan, formData.finance_bsp_plan, handleChange]);

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

  const handleRadioStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value,
      },
    });
  };

  const yesNoOptions = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  const renderRiskSection = (
    riskField: string,
    label: string,
    hazardsField: string,
    managementPlanField: string,
    bspPlanField: string
  ) => (
    <div className="border-b border-gray-200 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Type */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField(riskField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">{label}</label>
            {hoveredField === riskField && (
              <button
                type="button"
                onClick={() => handleViewLogs(riskField)}
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
                  name={riskField}
                  value={value}
                  checked={formData[riskField as keyof AssessmentViolenceRisksFormData] === value}
                  onChange={handleRadioNumberChange}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* BSP Plan */}
        {formData[riskField as keyof AssessmentViolenceRisksFormData] === 1 && (
          <div
            className="relative"
            onMouseEnter={() => setHoveredField(bspPlanField)}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">BSP Plan Required</label>
              {hoveredField === bspPlanField && (
                <button
                  type="button"
                  onClick={() => handleViewLogs(bspPlanField)}
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
                    name={bspPlanField}
                    value={value}
                    checked={formData[bspPlanField as keyof AssessmentViolenceRisksFormData] === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Show hazards and management plan only if risk is Yes (1) */}
      {formData[riskField as keyof AssessmentViolenceRisksFormData] === 1 && (
        <div className="grid grid-cols-1 gap-4 mt-4 pl-4 border-l-2 border-red-200">
          {/* Hazards */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField(hazardsField)}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Hazards identified</label>
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
              placeholder={"Describe hazards"}
              value={formData[hazardsField as keyof AssessmentViolenceRisksFormData] || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Management Plan */}
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
              placeholder={"Describe management plan"}
              value={formData[managementPlanField as keyof AssessmentViolenceRisksFormData] || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderEnumRiskSection = (
    riskField: string,
    label: string,
    hazardsField: string,
    managementPlanField: string,
    bspPlanField: string,
    notesField: string
  ) => (
    <div className="border-b border-gray-200 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Type */}
        <div
          className="relative"
          onMouseEnter={() => setHoveredField(riskField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">{label}</label>
            {hoveredField === riskField && (
              <button
                type="button"
                onClick={() => handleViewLogs(riskField)}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <div className="flex gap-4">
            {['Yes', 'No', 'N/A'].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={riskField}
                  value={option}
                  checked={formData[riskField as keyof AssessmentViolenceRisksFormData] === option}
                  onChange={handleRadioStringChange}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* BSP Plan - Only show if Yes */}
        {formData[riskField as keyof AssessmentViolenceRisksFormData] === 'Yes' && (
          <div
            className="relative"
            onMouseEnter={() => setHoveredField(bspPlanField)}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">BSP Plan Required</label>
              {hoveredField === bspPlanField && (
                <button
                  type="button"
                  onClick={() => handleViewLogs(bspPlanField)}
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
                    name={bspPlanField}
                    value={value}
                    checked={formData[bspPlanField as keyof AssessmentViolenceRisksFormData] === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Show hazards and management plan only if risk is Yes */}
      {formData[riskField as keyof AssessmentViolenceRisksFormData] === 'Yes' && (
        <div className="grid grid-cols-1 gap-4 mt-4 pl-4 border-l-2 border-red-200">
          {/* Hazards */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField(hazardsField)}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Hazards identified</label>
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
              placeholder={"Describe hazards"}
              value={formData[hazardsField as keyof AssessmentViolenceRisksFormData] || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Management Plan */}
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
              placeholder={"Describe management plan"}
              value={formData[managementPlanField as keyof AssessmentViolenceRisksFormData] || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      )}

      {/* Show Notes if N/A */}
      {formData[riskField as keyof AssessmentViolenceRisksFormData] === 'N/A' && (
        <div className="mt-4">
          <div
            className="relative"
            onMouseEnter={() => setHoveredField(notesField)}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Notes</label>
              {hoveredField === notesField && (
                <button
                  type="button"
                  onClick={() => handleViewLogs(notesField)}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name={notesField}
              placeholder="Notes..."
              value={formData[notesField as keyof AssessmentViolenceRisksFormData] || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          ASSESSMENT VIOLENCE RISKS
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {/* Physical Aggression */}
          {renderRiskSection(
            "physical_aggression",
            "Does the participant have any history of physical aggression toward others?",
            "physical_hazards",
            "physical_management_plan",
            "physical_bsp_plan"
          )}

          {/* Verbal Aggression */}
          {renderEnumRiskSection(
            "verbal_aggression",
            "Is there a history of Verbal aggression toward staff by the client?",
            "verbal_hazards",
            "verbal_management_plan",
            "verbal_bsp_plan",
            "verbal_aggression_notes"
          )}

          {/* Client Aggression */}
          {renderRiskSection(
            "client_aggression",
            "Is there a history of Aggression towards other clients?",
            "client_hazards",
            "client_management_plan",
            "client_bsp_plan"
          )}

          {/* Self Harm */}
          {renderRiskSection(
            "self_harm",
            "Is there a history of Self harm",
            "self_harm_hazards",
            "self_harm_management_plan",
            "self_harm_bsp_plan"
          )}

          {/* Drug & Alcohol Use */}
          {renderRiskSection(
            "drug_alcohol_use",
            "Does the participant engage in drug or alcohol use?",
            "drug_alcohol_hazards",
            "drug_alcohol_management_plan",
            "drug_alcohol_bsp_plan"
          )}

          {/* Sexual Abuse History */}
          {renderRiskSection(
            "sexual_abuse_history",
            "Is there a history of Sexual abuse",
            "sexual_abuse_hazards",
            "sexual_abuse_management_plan",
            "sexual_abuse_bsp_plan"
          )}

          {/* Emotional Manipulation */}
          {renderRiskSection(
            "emotional_manipulation",
            "Use of emotions to achieve goals",
            "emotional_hazards",
            "emotional_management_plan",
            "emotional_bsp_plan"
          )}

          {/* Other Known Risks */}
          {renderRiskSection(
            "other_known_risks",
            "Other Known Risks",
            "other_risks_hazards",
            "other_risks_management_plan",
            "other_risks_bsp_plan"
          )}

          {/* Finance Management */}
          {renderEnumRiskSection(
            "finance_management",
            "Does the participant need help to manage their finances?",
            "finance_hazards",
            "finance_management_plan",
            "finance_bsp_plan",
            "finance_management_notes"
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="individual_risk_assessment_violence_risk"
        field={selectedField}
        url="risk-assessment/logs"
      />
    </div>
  );
}