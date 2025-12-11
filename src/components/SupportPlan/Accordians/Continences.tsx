"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanContinences } from "@/src/components/SupportPlan/types";

interface ContinencesSupportsProps {
  formData: SupportPlanContinences;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function ContinencesForm({
  formData,
  handleChange,
  uuid,
}: ContinencesSupportsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.identified_needs === 0 && formData.identified_needs_details) {
      handleChange({
        target: {
          name: 'identified_needs_details',
          value: ''
        }
      });
    }
  }, [formData.identified_needs, formData.identified_needs_details, handleChange]);

  // Clear identify toilet needs details when identify_toilet_needs is set to "No"
  useEffect(() => {
    if (formData.identify_toilet_needs === 0 && formData.identify_toilet_needs_details) {
      handleChange({
        target: {
          name: 'identify_toilet_needs_details',
          value: ''
        }
      });
    }
  }, [formData.identify_toilet_needs, formData.identify_toilet_needs_details, handleChange]);

  // Clear require prompting details when require_prompting is set to "No"
  useEffect(() => {
    if (formData.require_prompting === 0 && formData.require_prompting_details) {
      handleChange({
        target: {
          name: 'require_prompting_details',
          value: ''
        }
      });
    }
  }, [formData.require_prompting, formData.require_prompting_details, handleChange]);

  // Clear continence aids details when wears_continence_aids is set to "No"
  useEffect(() => {
    if (formData.wears_continence_aids === 0 && formData.continence_aids_details) {
      handleChange({
        target: {
          name: 'continence_aids_details',
          value: ''
        }
      });
    }
  }, [formData.wears_continence_aids, formData.continence_aids_details, handleChange]);

  // Clear ruis details when ruis_required is set to "No"
  useEffect(() => {
    if (formData.ruis_required === 0 && formData.ruis_details) {
      handleChange({
        target: {
          name: 'ruis_details',
          value: ''
        }
      });
    }
  }, [formData.ruis_required, formData.ruis_details, handleChange]);

  // Clear rfis details when rfis_required is set to "No"
  useEffect(() => {
    if (formData.rfis_required === 0 && formData.rfis_details) {
      handleChange({
        target: {
          name: 'rfis_details',
          value: ''
        }
      });
    }
  }, [formData.rfis_required, formData.rfis_details, handleChange]);

  // Clear funding for products details when funding_for_products is set to "No"
  useEffect(() => {
    if (formData.funding_for_products === 0 && formData.funding_for_products_details) {
      handleChange({
        target: {
          name: 'funding_for_products_details',
          value: ''
        }
      });
    }
  }, [formData.funding_for_products, formData.funding_for_products_details, handleChange]);

  // Clear nurse assessment details when nurse_assessment is set to "No"
  useEffect(() => {
    if (formData.nurse_assessment === 0 && formData.nurse_assessment_details) {
      handleChange({
        target: {
          name: 'nurse_assessment_details',
          value: ''
        }
      });
    }
  }, [formData.nurse_assessment, formData.nurse_assessment_details, handleChange]);

  // Clear worry about continence details when worry_about_continence is set to "No"
  useEffect(() => {
    if (formData.worry_about_continence === 0 && formData.worry_about_continence_details) {
      handleChange({
        target: {
          name: 'worry_about_continence_details',
          value: ''
        }
      });
    }
  }, [formData.worry_about_continence, formData.worry_about_continence_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanContinences] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanContinences] === 1 && (
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
            placeholder={"List details..."}
            value={formData[detailsField as keyof SupportPlanContinences] || ""}
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
          Continences
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {renderYesNoField("identified_needs", "Do you have any identified needs regarding continence support?", "identified_needs_details")}

          {renderYesNoField("identify_toilet_needs", "Are you able to identify when you need to access the toilet?", "identify_toilet_needs_details")}

          {renderYesNoField("require_prompting", "Do you require prompting to use the toilet/change continence products?", "require_prompting_details")}

          {renderYesNoField("wears_continence_aids", "Do you wear continence aids?", "continence_aids_details")}

          {renderYesNoField("ruis_required", "Does the RUIS assessment need to be completed?", "ruis_details")}

          {renderYesNoField("rfis_required", "Does the RFIS assessment need to be completed?", "rfis_details")}

          {renderYesNoField("funding_for_products", "Are you accessing funding for continence products?", "funding_for_products_details")}

          {renderYesNoField("nurse_assessment", "Have you had a Continence Nurse Assessment previously", "nurse_assessment_details")}

          {renderYesNoField("worry_about_continence", "Does any aspect of your continence worry you?", "worry_about_continence_details")}

        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_continence"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}