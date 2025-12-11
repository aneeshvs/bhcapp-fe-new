"use client";
import React, { useState, useCallback, useMemo, useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanFallsRisks } from "@/src/components/SupportPlan/types";

interface FallsRisksProps {
  formData: SupportPlanFallsRisks;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

interface FieldConfig {
  name: keyof SupportPlanFallsRisks;
  label: string;
  detailsField?: keyof SupportPlanFallsRisks;
}

const YES_NO_OPTIONS = [
  { label: "Yes", value: 1 },
  { label: "No", value: 0 },
] as const;

const FIELDS_CONFIG: FieldConfig[] = [
  { name: "recent_falls", label: "Have you had any recent falls or near miss falls in 6 months?", detailsField: "recent_falls_details" },
  { name: "strategies_to_reduce_risk", label: "Strategies to reduce falls risk", detailsField: "strategies_details" },
  { name: "has_safety_pendant", label: "If you fall, do you have a safety pendant to call for help?", detailsField: "safety_pendant_details" },
  { name: "worried_about_falling", label: "Are you worried about falling?", detailsField: "worried_details" },
  { name: "referral_falls_clinic", label: "Is a referral to a falls clinic required?", detailsField: "referral_falls_clinic_details" },
  { name: "referral_ot", label: "Is a referral to an Occupational Therapist required?", detailsField: "fallrisk_referral_ot_details" },
  { name: "referral_physio", label: "Is a referral to a Physiotherapist/Exercise Physiotherapist required?", detailsField: "referral_physio_details" },
];

export default function FallsRisksForm({
  formData,
  handleChange,
  uuid,
}: FallsRisksProps) {
  const effectiveUuid = uuid || undefined;
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedField: null as string | null,
    hoveredField: null as string | null,
  });

  useEffect(() => {
    if (formData.recent_falls === 0 && formData.recent_falls_details) {
      handleChange({
        target: {
          name: 'recent_falls_details',
          value: ''
        }
      });
    }
  }, [formData.recent_falls, formData.recent_falls_details, handleChange]);

  // Clear strategies details when strategies_to_reduce_risk is set to "No"
  useEffect(() => {
    if (formData.strategies_to_reduce_risk === 0 && formData.strategies_details) {
      handleChange({
        target: {
          name: 'strategies_details',
          value: ''
        }
      });
    }
  }, [formData.strategies_to_reduce_risk, formData.strategies_details, handleChange]);

  // Clear safety pendant details when has_safety_pendant is set to "No"
  useEffect(() => {
    if (formData.has_safety_pendant === 0 && formData.safety_pendant_details) {
      handleChange({
        target: {
          name: 'safety_pendant_details',
          value: ''
        }
      });
    }
  }, [formData.has_safety_pendant, formData.safety_pendant_details, handleChange]);

  // Clear worried details when worried_about_falling is set to "No"
  useEffect(() => {
    if (formData.worried_about_falling === 0 && formData.worried_details) {
      handleChange({
        target: {
          name: 'worried_details',
          value: ''
        }
      });
    }
  }, [formData.worried_about_falling, formData.worried_details, handleChange]);

  // Clear falls clinic referral details when referral_falls_clinic is set to "No"
  useEffect(() => {
    if (formData.referral_falls_clinic === 0 && formData.referral_falls_clinic_details) {
      handleChange({
        target: {
          name: 'referral_falls_clinic_details',
          value: ''
        }
      });
    }
  }, [formData.referral_falls_clinic, formData.referral_falls_clinic_details, handleChange]);

  // Clear OT referral details when referral_ot is set to "No"
  useEffect(() => {
    if (formData.referral_ot === 0 && formData.fallrisk_referral_ot_details) {
      handleChange({
        target: {
          name: 'fallrisk_referral_ot_details',
          value: ''
        }
      });
    }
  }, [formData.referral_ot, formData.fallrisk_referral_ot_details, handleChange]);

  // Clear physio referral details when referral_physio is set to "No"
  useEffect(() => {
    if (formData.referral_physio === 0 && formData.referral_physio_details) {
      handleChange({
        target: {
          name: 'referral_physio_details',
          value: ''
        }
      });
    }
  }, [formData.referral_physio, formData.referral_physio_details, handleChange]);

  const handleViewLogs = useCallback((fieldName: string) => {
    setModalState(prev => ({ ...prev, selectedField: fieldName, isOpen: true }));
  }, []);

  const handleRadioNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: { name, value: Number(value) },
    });
  }, [handleChange]);

  const handleMouseEnter = useCallback((fieldName: string) => {
    setModalState(prev => ({ ...prev, hoveredField: fieldName }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setModalState(prev => ({ ...prev, hoveredField: null }));
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false, selectedField: null }));
  }, []);

  const renderYesNoField = useCallback(({ name, label, detailsField }: FieldConfig) => {
    const isChecked = formData[name] === 1;
    const isHovered = modalState.hoveredField === name;
    const detailsIsHovered = detailsField && modalState.hoveredField === detailsField;

    return (
      <React.Fragment key={name}>
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter(name)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">{label}</label>
            {isHovered && (
              <button
                type="button"
                onClick={() => handleViewLogs(name)}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <div className="flex gap-4">
            {YES_NO_OPTIONS.map(({ label: optionLabel, value }) => (
              <label key={optionLabel} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={name}
                  value={value}
                  checked={formData[name] === value}
                  onChange={handleRadioNumberChange}
                />
                {optionLabel}
              </label>
            ))}
          </div>
        </div>

        {detailsField && isChecked && (
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => handleMouseEnter(detailsField)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Details</label>
              {detailsIsHovered && (
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
              value={formData[detailsField] || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>
        )}
      </React.Fragment>
    );
  }, [formData, modalState.hoveredField, handleRadioNumberChange, handleViewLogs, handleMouseEnter, handleMouseLeave]);

  const fieldsElements = useMemo(() => 
    FIELDS_CONFIG.map(renderYesNoField), 
    [renderYesNoField]
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Falls Risk Assessment
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldsElements}
        </div>
      </div>

      <FieldLogsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        uuid={effectiveUuid ?? ""}
        table="support_plan_falls_risk"
        field={modalState.selectedField}
        url="logs/view/support"
      />
    </div>
  );
}