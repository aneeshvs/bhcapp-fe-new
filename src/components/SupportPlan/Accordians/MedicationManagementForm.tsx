"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanMedicationManagement } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";

interface MedicationManagementProps {
  formData: SupportPlanMedicationManagement;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function MedicationManagementForm({
  formData,
  handleChange,
  uuid,
}: MedicationManagementProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.takes_regular_medications === 0 && formData.medication_details) {
      handleChange({
        target: {
          name: 'medication_details',
          value: ''
        }
      });
    }
  }, [formData.takes_regular_medications, formData.medication_details, handleChange]);

  // Clear medications locked details when medications_locked is set to "No"
  useEffect(() => {
    if (formData.medications_locked === 0 && formData.medications_locked_details) {
      handleChange({
        target: {
          name: 'medications_locked_details',
          value: ''
        }
      });
    }
  }, [formData.medications_locked, formData.medications_locked_details, handleChange]);

  // Clear scheduled medications details when scheduled_4_or_8_medications is set to "No"
  useEffect(() => {
    if (formData.scheduled_4_or_8_medications === 0 && formData.scheduled_medications_details) {
      handleChange({
        target: {
          name: 'scheduled_medications_details',
          value: ''
        }
      });
    }
  }, [formData.scheduled_4_or_8_medications, formData.scheduled_medications_details, handleChange]);

  // Clear takes more than prescribed details when takes_more_than_prescribed is set to "No"
  useEffect(() => {
    if (formData.takes_more_than_prescribed === 0 && formData.takes_more_than_prescribed_details) {
      handleChange({
        target: {
          name: 'takes_more_than_prescribed_details',
          value: ''
        }
      });
    }
  }, [formData.takes_more_than_prescribed, formData.takes_more_than_prescribed_details, handleChange]);

  // Clear missing medication details when at_risk_of_missing_medication is set to "No"
  useEffect(() => {
    if (formData.at_risk_of_missing_medication === 0 && formData.missing_medication_details) {
      handleChange({
        target: {
          name: 'missing_medication_details',
          value: ''
        }
      });
    }
  }, [formData.at_risk_of_missing_medication, formData.missing_medication_details, handleChange]);

  // Clear support with medication details when needs_support_with_medication is set to "No"
  useEffect(() => {
    if (formData.needs_support_with_medication === 0 && formData.support_with_medication_details) {
      handleChange({
        target: {
          name: 'support_with_medication_details',
          value: ''
        }
      });
    }
  }, [formData.needs_support_with_medication, formData.support_with_medication_details, handleChange]);

  // Clear medication management worries details when medication_management_worries is set to "No"
  useEffect(() => {
    if (formData.medication_management_worries === 0 && formData.medication_management_worries_details) {
      handleChange({
        target: {
          name: 'medication_management_worries_details',
          value: ''
        }
      });
    }
  }, [formData.medication_management_worries, formData.medication_management_worries_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanMedicationManagement] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanMedicationManagement] === 1 && (
        <div
          className="relative md:col-span-2"
          onMouseEnter={() => setHoveredField(detailsField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">List Details</label>
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
            placeholder={"List details..."}
            value={formData[detailsField as keyof SupportPlanMedicationManagement] || ""}
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
          Medication Management
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Takes Regular Medications */}
          {renderYesNoField("takes_regular_medications", "Do you take regular medications", "medication_details")}

          {/* Medication Form */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("medication_form")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Medication form to be completed or provided by GP</label>
              {hoveredField === "medication_form" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("medication_form")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
           <input
            type="text"
            name="medication_form"
            value={formData.medication_form || ""}
            onChange={handleChange}
            placeholder="Enter medication form"
            className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Medication Packaging */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("medication_packaging")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Medication packaging</label>
              {hoveredField === "medication_packaging" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("medication_packaging")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
            type="text"
            name="medication_packaging"
            value={formData.medication_packaging || ""}
            onChange={handleChange}
            placeholder="Enter packaging type"
            className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Medications Locked */}
          {renderYesNoField("medications_locked", "Are the medications locked up?", "medications_locked_details")}

          {/* Specific Storage Requirements */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("specific_storage_requirements")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Specific storage requirements for medication</label>
              {hoveredField === "specific_storage_requirements" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("specific_storage_requirements")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="specific_storage_requirements"
              placeholder="Describe any special storage requirements..."
              value={formData.specific_storage_requirements || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Scheduled 4 or 8 Medications */}
          {renderYesNoField("scheduled_4_or_8_medications", "Are any scheduled 4 or 8 medications?", "scheduled_medications_details")}

          {/* Chemical Restraint Medications */}
          {renderYesNoField("chemical_restraint_medications", "Are any medications in chemical restraint?(If yes, a BSP must be completed)")}

          {/* Takes More Than Prescribed */}
          {renderYesNoField("takes_more_than_prescribed", "Do you ever take more than the prescribed dose of your medication?", "takes_more_than_prescribed_details")}

          {/* At Risk of Missing Medication */}
          {renderYesNoField("at_risk_of_missing_medication", "Are you at risk of missing medication?", "missing_medication_details")}

          {/* Able to Explain Purpose */}
          {renderYesNoField("able_to_explain_purpose", "Are you able to explain the purpose of your medication?")}

          {/* Last Medication Review Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("last_medication_review_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date of last medication review?</label>
              {hoveredField === "last_medication_review_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("last_medication_review_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="last_medication_review_date"
              value={formData.last_medication_review_date}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="last_medication_review_date"
              value={formData.last_medication_review_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Medication Collection/Delivery Details */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("medication_collection_delivery_details")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Medication collection/delivery</label>
              {hoveredField === "medication_collection_delivery_details" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("medication_collection_delivery_details")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="medication_collection_delivery_details"
              placeholder="Describe medication collection or delivery arrangements..."
              value={formData.medication_collection_delivery_details || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Needs Support with Medication */}
          {renderYesNoField("needs_support_with_medication", "Do you need support with your medication?", "support_with_medication_details")}

          {/* Medication Management Worries */}
          {renderYesNoField("medication_management_worries", "Does any aspect of your medication management worry you?", "medication_management_worries_details")}

          {/* Medication Service Required */}
          {renderYesNoField("medication_service_required", "Does a medication service need to be implemented?")}

          {/* Support Worker Prompt */}
          {renderYesNoField("support_worker_prompt", "Support Worker Prompt Required")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_medication_management"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}