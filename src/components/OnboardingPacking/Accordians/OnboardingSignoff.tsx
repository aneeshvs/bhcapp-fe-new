"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import DatePickerSaveMany from "@/src/components/DatePickerSaveMany"; // Adjust path as needed

interface OnboardingPackingSignoffs {
  service_agreement_provided: number;
  service_agreement_date: string;
  participant_handbook_provided: number;
  participant_handbook_date: string;
  support_care_plan_offered: number;
  support_care_plan_date: string;
  consent_form_signed: number;
  consent_form_date: string;
  feedback_form_provided: number;
  feedback_form_date: string;
  home_safety_check_conducted: number;
  home_safety_check_date: string;
  medication_consent_form: number;
  medication_consent_date: string;
  onboarding_form_completed: number;
  onboarding_form_date: string;
  risk_assessment_completed: number;
  risk_assessment_date: string;
  behaviour_support_plan_obtained: number;
  behaviour_support_plan_date: string;
  high_intensity_support_plan_obtained: number;
  high_intensity_support_plan_date: string;
  mealtime_plan_obtained: number;
  mealtime_plan_date: string;
  sil_occupancy_agreement_provided: number;
  sil_occupancy_agreement_date: string;
  external_provider_agreement_completed: number;
  external_provider_agreement_date: string;
  sda_residency_agreement_provided: number;
  sda_residency_agreement_date: string;
  sda_welcome_pack_provided: number;
  sda_welcome_pack_date: string;
  sda_residency_statement_provided: number;
  sda_residency_statement_date: string;
}

interface OnboardingPackingSignoffsProps {
  formData: OnboardingPackingSignoffs;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number } }
  ) => void;
  uuid?: string;
}

export default function OnboardingPackingSignoffsForm({
  formData,
  handleChange,
  uuid,
}: OnboardingPackingSignoffsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

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

  const renderChecklistField = (
    checkboxField: string,
    dateField: string,
    label: string
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {/* Checkbox Field */}
      <div
        className="relative"
        onMouseEnter={() => setHoveredField(checkboxField)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block font-medium">{label}</label>
          {hoveredField === checkboxField && (
            <button
              type="button"
              onClick={() => handleViewLogs(checkboxField)}
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
                name={checkboxField}
                value={value}
                checked={formData[checkboxField as keyof OnboardingPackingSignoffs] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Date Field */}
      <div
        className="relative"
        onMouseEnter={() => setHoveredField(dateField)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block font-medium">Date</label>
          {hoveredField === dateField && (
            <button
              type="button"
              onClick={() => handleViewLogs(dateField)}
              className="text-xs btn-primary text-white px-2 py-1 rounded"
            >
              View Logs
            </button>
          )}
        </div>
        <DatePickerSaveMany
          name={dateField}
          value={(formData[dateField as keyof OnboardingPackingSignoffs] as string) || null}
          onChange={handleChange}
          placeholder="Select date"
        />
      </div>
    </div>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Onboarding Packing Signoffs
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {/* Service Agreement */}
          {renderChecklistField(
            "service_agreement_provided",
            "service_agreement_date",
            "Provided to the participant - Service Agreement and Schedule of Support"
          )}

          {/* Participant Handbook */}
          {renderChecklistField(
            "participant_handbook_provided",
            "participant_handbook_date",
            "Provided to the participant - Participant Handbook"
          )}

          {/* Support Care Plan */}
          {renderChecklistField(
            "support_care_plan_offered",
            "support_care_plan_date",
            "Offered a copy of the Support Care Plan"
          )}

          {/* Consent Form */}
          {renderChecklistField(
            "consent_form_signed",
            "consent_form_date",
            "Consent to exchange confidential information Form signed"
          )}

          {/* Feedback Form */}
          {renderChecklistField(
            "feedback_form_provided",
            "feedback_form_date",
            "Provided to the participant - a Compliments, Complaints and Feedback Form"
          )}

          {/* Home Safety Check */}
          {renderChecklistField(
            "home_safety_check_conducted",
            "home_safety_check_date",
            "Conducted Home Safety Checklist Assessment"
          )}

          {/* Medication Consent Form */}
          {renderChecklistField(
            "medication_consent_form",
            "medication_consent_date",
            "Medication Consent Form (if Applicable)"
          )}

          {/* Onboarding Form */}
          {renderChecklistField(
            "onboarding_form_completed",
            "onboarding_form_date",
            "Onboarding Form Completed"
          )}

          {/* Risk Assessment */}
          {renderChecklistField(
            "risk_assessment_completed",
            "risk_assessment_date",
            "Individual Risk Assessment Completed"
          )}

          {/* Behaviour Support Plan */}
          {renderChecklistField(
            "behaviour_support_plan_obtained",
            "behaviour_support_plan_date",
            "Behaviour Support Plan obtained (if Applicable)"
          )}

          {/* High Intensity Support Plan */}
          {renderChecklistField(
            "high_intensity_support_plan_obtained",
            "high_intensity_support_plan_date",
            "High Intensity Support Plan Obtained (if applicable)"
          )}

          {/* Mealtime Plan */}
          {renderChecklistField(
            "mealtime_plan_obtained",
            "mealtime_plan_date",
            "Mealtime Management Plan obtained (if Applicable)"
          )}

          {/* SIL Occupancy Agreement */}
          {renderChecklistField(
            "sil_occupancy_agreement_provided",
            "sil_occupancy_agreement_date",
            "Provided to the participant - A SIL Occupancy Agreement"
          )}

          {/* External Provider Agreement */}
          {renderChecklistField(
            "external_provider_agreement_completed",
            "external_provider_agreement_date",
            "External Provider Service Agreement Completed (SIL Only)"
          )}

          {/* SDA Residency Agreement */}
          {renderChecklistField(
            "sda_residency_agreement_provided",
            "sda_residency_agreement_date",
            "Provided to the participant -  An SDA Residency Agreement (if SDA)"
          )}

          {/* SDA Welcome Pack */}
          {renderChecklistField(
            "sda_welcome_pack_provided",
            "sda_welcome_pack_date",
            "Provided to the participant - SDA Resident Welcome Pack"
          )}

          {/* SDA Residency Statement */}
          {renderChecklistField(
            "sda_residency_statement_provided",
            "sda_residency_statement_date",
            "Provided to the participant - SDA Residency Statement"
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="onboarding_packing_signoff"
        field={selectedField}
        url="onboarding-packing-signoff/logs"
      />
    </div>
  );
}