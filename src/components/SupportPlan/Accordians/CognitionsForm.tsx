"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanCognitions } from "@/src/components/SupportPlan/types";

interface CognitionsProps {
  formData: SupportPlanCognitions;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function CognitionsForm({
  formData,
  handleChange,
  uuid,
}: CognitionsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.cognitive_concerns === 0 && formData.cognitive_concerns_details) {
      handleChange({
        target: {
          name: 'cognitive_concerns_details',
          value: ''
        }
      });
    }
  }, [formData.cognitive_concerns, formData.cognitive_concerns_details, handleChange]);

  // Clear dementia diagnosis details when diagnosis_dementia is set to "No"
  useEffect(() => {
    if (formData.diagnosis_dementia === 0 && formData.diagnosis_dementia_details) {
      handleChange({
        target: {
          name: 'diagnosis_dementia_details',
          value: ''
        }
      });
    }
  }, [formData.diagnosis_dementia, formData.diagnosis_dementia_details, handleChange]);

  // Clear decision making details when capable_of_decisions is set to "No"
  useEffect(() => {
    if (formData.capable_of_decisions === 0 && formData.capable_of_decisions_details) {
      handleChange({
        target: {
          name: 'capable_of_decisions_details',
          value: ''
        }
      });
    }
  }, [formData.capable_of_decisions, formData.capable_of_decisions_details, handleChange]);

  // Clear power of attorney details when has_power_of_attorney is set to "No"
  useEffect(() => {
    if (formData.has_power_of_attorney === 0 && formData.power_of_attorney_details) {
      handleChange({
        target: {
          name: 'power_of_attorney_details',
          value: ''
        }
      });
    }
  }, [formData.has_power_of_attorney, formData.power_of_attorney_details, handleChange]);

  // Clear confusion details when becomes_confused is set to "No"
  useEffect(() => {
    if (formData.becomes_confused === 0 && formData.becomes_confused_details) {
      handleChange({
        target: {
          name: 'becomes_confused_details',
          value: ''
        }
      });
    }
  }, [formData.becomes_confused, formData.becomes_confused_details, handleChange]);

  // Clear delirium details when experienced_delirium is set to "No"
  useEffect(() => {
    if (formData.experienced_delirium === 0 && formData.experienced_delirium_details) {
      handleChange({
        target: {
          name: 'experienced_delirium_details',
          value: ''
        }
      });
    }
  }, [formData.experienced_delirium, formData.experienced_delirium_details, handleChange]);

  // Clear anxiety details when anxious_or_worry is set to "No"
  useEffect(() => {
    if (formData.anxious_or_worry === 0 && formData.anxious_or_worry_details) {
      handleChange({
        target: {
          name: 'anxious_or_worry_details',
          value: ''
        }
      });
    }
  }, [formData.anxious_or_worry, formData.anxious_or_worry_details, handleChange]);

  // Clear short-term memory details when short_term_memory_loss is set to "No"
  useEffect(() => {
    if (formData.short_term_memory_loss === 0 && formData.short_term_memory_loss_details) {
      handleChange({
        target: {
          name: 'short_term_memory_loss_details',
          value: ''
        }
      });
    }
  }, [formData.short_term_memory_loss, formData.short_term_memory_loss_details, handleChange]);

  // Clear long-term memory details when long_term_memory_loss is set to "No"
  useEffect(() => {
    if (formData.long_term_memory_loss === 0 && formData.long_term_memory_loss_details) {
      handleChange({
        target: {
          name: 'long_term_memory_loss_details',
          value: ''
        }
      });
    }
  }, [formData.long_term_memory_loss, formData.long_term_memory_loss_details, handleChange]);

  // Clear ATSI KICA Cog file when atsi_kica_cog_required is set to "No"
  useEffect(() => {
    if (formData.atsi_kica_cog_required === 0 && formData.atsi_kica_cog_file) {
      handleChange({
        target: {
          name: 'atsi_kica_cog_file',
          value: ''
        }
      });
    }
  }, [formData.atsi_kica_cog_required, formData.atsi_kica_cog_file, handleChange]);

  // Clear ATSI KICA Carer file when atsi_kica_carer_required is set to "No"
  useEffect(() => {
    if (formData.atsi_kica_carer_required === 0 && formData.atsi_kica_carer_file) {
      handleChange({
        target: {
          name: 'atsi_kica_carer_file',
          value: ''
        }
      });
    }
  }, [formData.atsi_kica_carer_required, formData.atsi_kica_carer_file, handleChange]);

  // Clear GPCOG file when gpcog_required is set to "No"
  useEffect(() => {
    if (formData.gpcog_required === 0 && formData.gpcog_file) {
      handleChange({
        target: {
          name: 'gpcog_file',
          value: ''
        }
      });
    }
  }, [formData.gpcog_required, formData.gpcog_file, handleChange]);

  // Clear health literacy support details when health_literacy_support is set to "No"
  useEffect(() => {
    if (formData.health_literacy_support === 0 && formData.health_literacy_support_details) {
      handleChange({
        target: {
          name: 'health_literacy_support_details',
          value: ''
        }
      });
    }
  }, [formData.health_literacy_support, formData.health_literacy_support_details, handleChange]);

  // Clear GDS file when gds_required is set to "No"
  useEffect(() => {
    if (formData.gds_required === 0 && formData.gds_file) {
      handleChange({
        target: {
          name: 'gds_file',
          value: ''
        }
      });
    }
  }, [formData.gds_required, formData.gds_file, handleChange]);

  // Clear geriatrician referral details when referral_geriatrician is set to "No"
  useEffect(() => {
    if (formData.referral_geriatrician === 0 && formData.referral_geriatrician_details) {
      handleChange({
        target: {
          name: 'referral_geriatrician_details',
          value: ''
        }
      });
    }
  }, [formData.referral_geriatrician, formData.referral_geriatrician_details, handleChange]);

  // Clear psychologist referral details when referral_psychologist is set to "No"
  useEffect(() => {
    if (formData.referral_psychologist === 0 && formData.referral_psychologist_details) {
      handleChange({
        target: {
          name: 'referral_psychologist_details',
          value: ''
        }
      });
    }
  }, [formData.referral_psychologist, formData.referral_psychologist_details, handleChange]);

  // Clear psychiatrist referral details when referral_psychiatrist is set to "No"
  useEffect(() => {
    if (formData.referral_psychiatrist === 0 && formData.referral_psychiatrist_details) {
      handleChange({
        target: {
          name: 'referral_psychiatrist_details',
          value: ''
        }
      });
    }
  }, [formData.referral_psychiatrist, formData.referral_psychiatrist_details, handleChange]);

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

  const renderYesNoField = (fieldName: string, label: string, detailsField?: string, fileField?: string) => (
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
                checked={formData[fieldName as keyof SupportPlanCognitions] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanCognitions] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanCognitions] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>
      )}

      {fileField && formData[fieldName as keyof SupportPlanCognitions] === 1 && (
        <div
          className="relative md:col-span-2"
          onMouseEnter={() => setHoveredField(fileField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Details</label>
            {hoveredField === fileField && (
              <button
                type="button"
                onClick={() => handleViewLogs(fileField)}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name={fileField}
            placeholder={"List details..."}
            value={formData[fileField as keyof SupportPlanCognitions] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      )}
    </>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Cognitive Assessment
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cognitive Concerns */}
          {renderYesNoField("cognitive_concerns", "Are there cognitive concerns?", "cognitive_concerns_details")}

          {/* Dementia Diagnosis */}
          {renderYesNoField("diagnosis_dementia", "Do you have a diagnosis of dementia from a geriatrician or neurologist?", "diagnosis_dementia_details")}

          {/* Decision Making Capability */}
          {renderYesNoField("capable_of_decisions", "Are you capable of making your own decisions", "capable_of_decisions_details")}

          {/* Power of Attorney */}
          {renderYesNoField("has_power_of_attorney", "Do you have an appointed Power of Attorney of Guardian", "power_of_attorney_details")}

          {/* Confusion */}
          {renderYesNoField("becomes_confused", "Do you become confused at times?", "becomes_confused_details")}

          {/* Delirium */}
          {renderYesNoField("experienced_delirium", "Have you experienced delirium previously?", "experienced_delirium_details")}

          {/* Anxiety/Worry */}
          {renderYesNoField("anxious_or_worry", "Do you feel anxious or worry alot?", "anxious_or_worry_details")}

          {/* Short-term Memory Loss */}
          {renderYesNoField("short_term_memory_loss", "Do you experience short term memory loss?", "short_term_memory_loss_details")}

          {/* Long-term Memory Loss */}
          {renderYesNoField("long_term_memory_loss", "Do you experience long term memory loss?", "long_term_memory_loss_details")}

          {/* ATSI KICA Cog */}
          {renderYesNoField("atsi_kica_cog_required", "For ATSI- does the KICA Regional C Urban -COG need to be completed", undefined, "atsi_kica_cog_file")}

          {/* ATSI KICA Carer */}
          {renderYesNoField("atsi_kica_carer_required", "For ATSI- does the Kimberley Indigenous Cognitive Assessment: Carer Cognitive Informant need to be completed?", undefined, "atsi_kica_carer_file")}

          {/* GPCOG */}
          {renderYesNoField("gpcog_required", "Does the GPCOG need to be completed?", undefined, "gpcog_file")}

          {/* Health Literacy Support */}
          {renderYesNoField("health_literacy_support", "Health literacy is the ability to read, understand and use healthcare information to make informed decisions about health and havethe ability to follow treatment instructions where required. Do you require support?", "health_literacy_support_details")}

          {/* GDS */}
          {renderYesNoField("gds_required", "Does the Gaetrician Depression Scale need to be completed?", undefined, "gds_file")}

          {/* Referral to Geriatrician */}
          {renderYesNoField("referral_geriatrician", "Is a referral required for a Geriatrician?", "referral_geriatrician_details")}

          {/* Referral to Psychologist */}
          {renderYesNoField("referral_psychologist", "Is a referral required for a psychologist?", "referral_psychologist_details")}

          {/* Referral to Psychiatrist */}
          {renderYesNoField("referral_psychiatrist", "Is a referral required for a psychiatrist?", "referral_psychiatrist_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_cognition"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}