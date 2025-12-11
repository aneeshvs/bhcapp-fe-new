// PlanEmergencyScenariosForm.tsx
"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanEmergencyScenarios } from "@/src/components/SupportCarePlan/types";

interface PlanEmergencyScenariosProps {
  formData: SupportPlanEmergencyScenarios;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function PlanEmergencyScenariosForm({
  formData,
  handleChange,
  uuid,
}: PlanEmergencyScenariosProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.admitted_to_hospital === 0 && formData.admitted_to_hospital_action) {
      handleChange({
        target: {
          name: 'admitted_to_hospital_action',
          value: ''
        }
      });
    }
  }, [formData.admitted_to_hospital, formData.admitted_to_hospital_action, handleChange]);

  // Clear medical emergencies action when medical_emergencies is set to "No"
  useEffect(() => {
    if (formData.medical_emergencies === 0 && formData.medical_emergencies_action) {
      handleChange({
        target: {
          name: 'medical_emergencies_action',
          value: ''
        }
      });
    }
  }, [formData.medical_emergencies, formData.medical_emergencies_action, handleChange]);

  // Clear other likely medical emergency action when other_likely_medical_emergency is set to "No"
  useEffect(() => {
    if (formData.other_likely_medical_emergency === 0 && formData.other_likely_medical_emergency_action) {
      handleChange({
        target: {
          name: 'other_likely_medical_emergency_action',
          value: ''
        }
      });
    }
  }, [formData.other_likely_medical_emergency, formData.other_likely_medical_emergency_action, handleChange]);

  // Clear natural disaster action when natural_disaster is set to "No"
  useEffect(() => {
    if (formData.natural_disaster === 0 && formData.natural_disaster_action) {
      handleChange({
        target: {
          name: 'natural_disaster_action',
          value: ''
        }
      });
    }
  }, [formData.natural_disaster, formData.natural_disaster_action, handleChange]);

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
    detailsField?: string
  ) => (
    <>
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
                checked={formData[fieldName as keyof SupportPlanEmergencyScenarios] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField &&
        formData[fieldName as keyof SupportPlanEmergencyScenarios] === 1 && (
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField(detailsField)}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">{label} Action</label>
              {hoveredField === detailsField && (
                <button
                  type="button"
                  onClick={() => handleViewLogs(detailsField)}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name={detailsField}
              placeholder={`Provide action steps for ${label.toLowerCase()}...`}
              value={formData[detailsField as keyof SupportPlanEmergencyScenarios] || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>
        )}
    </>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Emergency Scenarios
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Admitted to Hospital */}
          {renderYesNoField(
            "admitted_to_hospital",
            "Admitted to Hospital",
            "admitted_to_hospital_action"
          )}

          {/* Medical Emergencies */}
          {renderYesNoField(
            "medical_emergencies",
            "Medical Emergencies",
            "medical_emergencies_action"
          )}

          {/* Other Likely Medical Emergency */}
          {renderYesNoField(
            "other_likely_medical_emergency",
            "Do you have any other type of likely medical emergency for example – Seizures, etc",
            "other_likely_medical_emergency_action"
          )}

          {/* Natural Disaster */}
          {renderYesNoField(
            "natural_disaster",
            "Natural Disaster (flood, bushfire, earthquake, pandemic)",
            "natural_disaster_action"
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_care_plan_emergency_scenarios"
        field={selectedField}
        url="support-care-plan/logs"
      />
    </div>
  );
}
