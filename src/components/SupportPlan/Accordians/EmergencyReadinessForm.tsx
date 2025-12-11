"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanEmergencyReadiness } from "@/src/components/SupportPlan/types";

interface EmergencyReadinessProps {
  formData: SupportPlanEmergencyReadiness;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function EmergencyReadinessForm({
  formData,
  handleChange,
  uuid,
}: EmergencyReadinessProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.at_risk_of_abuse === 0 && formData.abuse_details) {
      handleChange({
        target: {
          name: 'abuse_details',
          value: ''
        }
      });
    }
  }, [formData.at_risk_of_abuse, formData.abuse_details, handleChange]);

  // Clear OPAN referral details when opan_referral_required is set to "No"
  useEffect(() => {
    if (formData.opan_referral_required === 0 && formData.opan_referral_details) {
      handleChange({
        target: {
          name: 'opan_referral_details',
          value: ''
        }
      });
    }
  }, [formData.opan_referral_required, formData.opan_referral_details, handleChange]);

  // Clear declining services details when risk_of_declining_services is set to "No"
  useEffect(() => {
    if (formData.risk_of_declining_services === 0 && formData.declining_services_details) {
      handleChange({
        target: {
          name: 'declining_services_details',
          value: ''
        }
      });
    }
  }, [formData.risk_of_declining_services, formData.declining_services_details, handleChange]);

  // Clear neglect indicators details when neglect_indicators is set to "No"
  useEffect(() => {
    if (formData.neglect_indicators === 0 && formData.neglect_indicators_details) {
      handleChange({
        target: {
          name: 'neglect_indicators_details',
          value: ''
        }
      });
    }
  }, [formData.neglect_indicators, formData.neglect_indicators_details, handleChange]);

  // Clear emergency accessible details when emergency_accessible is set to "No"
  useEffect(() => {
    if (formData.emergency_accessible === 0 && formData.emergency_accessible_details) {
      handleChange({
        target: {
          name: 'emergency_accessible_details',
          value: ''
        }
      });
    }
  }, [formData.emergency_accessible, formData.emergency_accessible_details, handleChange]);

  // Clear emergency support details when emergency_support_available is set to "No"
  useEffect(() => {
    if (formData.emergency_support_available === 0 && formData.emergency_support_details) {
      handleChange({
        target: {
          name: 'emergency_support_details',
          value: ''
        }
      });
    }
  }, [formData.emergency_support_available, formData.emergency_support_details, handleChange]);

  // Clear VPR details when vpr_required is set to "No"
  useEffect(() => {
    if (formData.vpr_required === 0 && formData.vpr_details) {
      handleChange({
        target: {
          name: 'vpr_details',
          value: ''
        }
      });
    }
  }, [formData.vpr_required, formData.vpr_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanEmergencyReadiness] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanEmergencyReadiness] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanEmergencyReadiness] || ""}
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
          Emergency Readiness & Risk Assessment
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* At Risk of Abuse */}
          {renderYesNoField("at_risk_of_abuse", "Are you experiencing or at risk of abuse or neglect?", "abuse_details")}

          {/* OPAN Referral Required */}
          {renderYesNoField("opan_referral_required", "Is a referral to OPAN required?", "opan_referral_details")}

          {/* Risk of Declining Services */}
          {renderYesNoField("risk_of_declining_services", "Are you at risk of declining services?", "declining_services_details")}

          {/* Neglect Indicators */}
          {renderYesNoField("neglect_indicators", "Are there any indicators that the participant is neglecting their personal care, nutrition, or safety?", "neglect_indicators_details")}

          {/* Emergency Accessible */}
          {renderYesNoField("emergency_accessible", "Can emergency vehicles easily identify C access your property?", "emergency_accessible_details")}

          {/* Emergency Support Available */}
          {renderYesNoField("emergency_support_available", "Do you have emergency support in place if your carer is suddenly unavailable?", "emergency_support_details")}

          {/* VPR Required */}
          {renderYesNoField("vpr_required", "Does the participant need to be added to the Vulnerable Persons Register (VPR)?", "vpr_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_emergency_readiness"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}