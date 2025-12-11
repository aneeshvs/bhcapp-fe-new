"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanInformalSupports } from "@/src/components/SupportPlan/types";

interface InformalSupportsProps {
  formData: SupportPlanInformalSupports;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function InformalSupportsForm({
  formData,
  handleChange,
  uuid,
}: InformalSupportsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.is_primary_caregiver === 0 && formData.primary_caregiver_details) {
      handleChange({
        target: {
          name: 'primary_caregiver_details',
          value: ''
        }
      });
    }
  }, [formData.is_primary_caregiver, formData.primary_caregiver_details, handleChange]);

  // Clear receiving help details when receiving_help is set to "No"
  useEffect(() => {
    if (formData.receiving_help === 0 && formData.receiving_help_details) {
      handleChange({
        target: {
          name: 'receiving_help_details',
          value: ''
        }
      });
    }
  }, [formData.receiving_help, formData.receiving_help_details, handleChange]);

  // Clear carer lives with you details when carer_lives_with_you is set to "No"
  useEffect(() => {
    if (formData.carer_lives_with_you === 0 && formData.carer_lives_with_you_details) {
      handleChange({
        target: {
          name: 'carer_lives_with_you_details',
          value: ''
        }
      });
    }
  }, [formData.carer_lives_with_you, formData.carer_lives_with_you_details, handleChange]);

  // Clear carer pension details when carer_receives_pension is set to "No"
  useEffect(() => {
    if (formData.carer_receives_pension === 0 && formData.carer_pension_details) {
      handleChange({
        target: {
          name: 'carer_pension_details',
          value: ''
        }
      });
    }
  }, [formData.carer_receives_pension, formData.carer_pension_details, handleChange]);

  // Clear factors affecting care details when factors_affecting_care is set to "No"
  useEffect(() => {
    if (formData.factors_affecting_care === 0 && formData.factors_affecting_care_details) {
      handleChange({
        target: {
          name: 'factors_affecting_care_details',
          value: ''
        }
      });
    }
  }, [formData.factors_affecting_care, formData.factors_affecting_care_details, handleChange]);

  // Clear carer gateway referral details when carer_gateway_referral is set to "No"
  useEffect(() => {
    if (formData.carer_gateway_referral === 0 && formData.carer_gateway_referral_details) {
      handleChange({
        target: {
          name: 'carer_gateway_referral_details',
          value: ''
        }
      });
    }
  }, [formData.carer_gateway_referral, formData.carer_gateway_referral_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanInformalSupports] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanInformalSupports] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanInformalSupports] || ""}
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
          Informal Supports & Caregivers
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Is Primary Caregiver */}
          {renderYesNoField("is_primary_caregiver", "Are you the primary caregiver for another person?", "primary_caregiver_details")}

          {/* Receiving Help */}
          {renderYesNoField("receiving_help", "Are you receiving help from a carer, family member, friend or someone else?", "receiving_help_details")}

          {/* Carer Lives With You */}
          {renderYesNoField("carer_lives_with_you", "Does the carer live with you?", "carer_lives_with_you_details")}

          {/* Carer Receives Pension */}
          {renderYesNoField("carer_receives_pension", "Does the carer receive a pension", "carer_pension_details")}

          {/* Factors Affecting Care */}
          {renderYesNoField("factors_affecting_care", "Are there factors affecting carer availability and sustainability of care relationship?", "factors_affecting_care_details")}

          {/* Caregiver Strain Index Required */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("caregiver_strain_index_required")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">If yes, Caregiver strain index form must be completed</label>
              {hoveredField === "caregiver_strain_index_required" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("caregiver_strain_index_required")}
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
                    name="caregiver_strain_index_required"
                    value={value}
                    checked={formData.caregiver_strain_index_required === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Carer Gateway Referral */}
          {renderYesNoField("carer_gateway_referral", "Carer Gateway referral suitable", "carer_gateway_referral_details")}

          {/* Primary Caregiver Receives Allowance */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("primary_caregiver_receives_allowance")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Is your primary caregiver receiving a Carers Allowance?</label>
              {hoveredField === "primary_caregiver_receives_allowance" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("primary_caregiver_receives_allowance")}
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
                    name="primary_caregiver_receives_allowance"
                    value={value}
                    checked={formData.primary_caregiver_receives_allowance === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_informal_support"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}