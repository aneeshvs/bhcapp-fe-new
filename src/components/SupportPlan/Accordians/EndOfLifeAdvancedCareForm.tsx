// EndOfLifeAdvancedCareForm.tsx
"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanEndOfLifeAdvancedCare } from "@/src/components/SupportPlan/types";

interface EndOfLifeAdvancedCareProps {
  formData: SupportPlanEndOfLifeAdvancedCare;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function EndOfLifeAdvancedCareForm({
  formData,
  handleChange,
  uuid,
}: EndOfLifeAdvancedCareProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.receiving_palliative_care === 0 && formData.receiving_palliative_care_details) {
      handleChange({
        target: {
          name: 'receiving_palliative_care_details',
          value: ''
        }
      });
    }
  }, [formData.receiving_palliative_care, formData.receiving_palliative_care_details, handleChange]);

  // Clear support to initiate palliative care details when support_to_initiate_palliative_care is set to "No"
  useEffect(() => {
    if (formData.support_to_initiate_palliative_care === 0 && formData.support_to_initiate_palliative_care_details) {
      handleChange({
        target: {
          name: 'support_to_initiate_palliative_care_details',
          value: ''
        }
      });
    }
  }, [formData.support_to_initiate_palliative_care, formData.support_to_initiate_palliative_care_details, handleChange]);

  // Clear advanced care plan details when has_advanced_care_plan is set to "No"
  useEffect(() => {
    if (formData.has_advanced_care_plan === 0 && formData.advanced_care_plan_details) {
      handleChange({
        target: {
          name: 'advanced_care_plan_details',
          value: ''
        }
      });
    }
  }, [formData.has_advanced_care_plan, formData.advanced_care_plan_details, handleChange]);

  // Clear support to complete advanced care plan details when support_to_complete_advanced_care_plan is set to "No"
  useEffect(() => {
    if (formData.support_to_complete_advanced_care_plan === 0 && formData.support_to_complete_advanced_care_plan_details) {
      handleChange({
        target: {
          name: 'support_to_complete_advanced_care_plan_details',
          value: ''
        }
      });
    }
  }, [formData.support_to_complete_advanced_care_plan, formData.support_to_complete_advanced_care_plan_details, handleChange]);

  // Clear DNR details when has_dnr is set to "No"
  useEffect(() => {
    if (formData.has_dnr === 0 && formData.dnr_details) {
      handleChange({
        target: {
          name: 'dnr_details',
          value: ''
        }
      });
    }
  }, [formData.has_dnr, formData.dnr_details, handleChange]);

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

  const renderYesNoField = (fieldName: string, label: string, detailsField?: string) => (
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
                checked={formData[fieldName as keyof SupportPlanEndOfLifeAdvancedCare] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanEndOfLifeAdvancedCare] === 1 && (
        <div
          className="relative md:col-span-2"
          onMouseEnter={() => setHoveredField(detailsField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Details</label>
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
            placeholder={"Enter details..."}
            value={formData[detailsField as keyof SupportPlanEndOfLifeAdvancedCare] || ""}
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
          End of Life & Advanced Care Planning
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Receiving Palliative Care */}
          {renderYesNoField("receiving_palliative_care", "Are you receiving palliative care?", "receiving_palliative_care_details")}

          {/* Support to Initiate Palliative Care */}
          {renderYesNoField("support_to_initiate_palliative_care", "Do you require support to initiate palliative care services?", "support_to_initiate_palliative_care_details")}

          {/* Has Advanced Care Plan */}
          {renderYesNoField("has_advanced_care_plan", "Do you have an advanced care plan?", "advanced_care_plan_details")}

          {/* Support to Complete Advanced Care Plan */}
          {renderYesNoField("support_to_complete_advanced_care_plan", "If no, do you want support in completing an Advanced Care Plan?", "support_to_complete_advanced_care_plan_details")}

          {/* Has DNR */}
          {renderYesNoField("has_dnr", "Do you have a Do Not Resuscitate (DNR)?", "dnr_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_end_of_life_advanced_care_planning"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}