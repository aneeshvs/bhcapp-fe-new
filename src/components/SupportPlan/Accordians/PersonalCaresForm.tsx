"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanPersonalCares } from "@/src/components/SupportPlan/types";

interface PersonalCaresProps {
  formData: SupportPlanPersonalCares;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function PersonalCaresForm({
  formData,
  handleChange,
  uuid,
}: PersonalCaresProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.support_daily_personal_care === 0 && formData.daily_personal_care_details) {
      handleChange({
        target: {
          name: 'daily_personal_care_details',
          value: ''
        }
      });
    }
  }, [formData.support_daily_personal_care, formData.daily_personal_care_details, handleChange]);

  // Clear showering details and type when support_showering is set to "No"
  useEffect(() => {
    if (formData.support_showering === 0) {
      if (formData.showering_details) {
        handleChange({
          target: {
            name: 'showering_details',
            value: ''
          }
        });
      }
      if (formData.showering_type) {
        handleChange({
          target: {
            name: 'showering_type',
            value: ''
          }
        });
      }
    }
  }, [formData.support_showering, formData.showering_details, formData.showering_type, handleChange]);

  // Clear dressing details and routine when support_dressing is set to "No"
  useEffect(() => {
    if (formData.support_dressing === 0) {
      if (formData.dressing_details) {
        handleChange({
          target: {
            name: 'dressing_details',
            value: ''
          }
        });
      }
      if (formData.dressing_routine) {
        handleChange({
          target: {
            name: 'dressing_routine',
            value: ''
          }
        });
      }
    }
  }, [formData.support_dressing, formData.dressing_details, formData.dressing_routine, handleChange]);

  // Clear equipment details when equipment_in_bathroom is set to "No"
  useEffect(() => {
    if (formData.equipment_in_bathroom === 0 && formData.equipment_details) {
      handleChange({
        target: {
          name: 'equipment_details',
          value: ''
        }
      });
    }
  }, [formData.equipment_in_bathroom, formData.equipment_details, handleChange]);

  // Clear shaving details when support_shaving is set to "No"
  useEffect(() => {
    if (formData.support_shaving === 0 && formData.shaving_details) {
      handleChange({
        target: {
          name: 'shaving_details',
          value: ''
        }
      });
    }
  }, [formData.support_shaving, formData.shaving_details, handleChange]);

  // Clear haircuts details when support_haircuts is set to "No"
  useEffect(() => {
    if (formData.support_haircuts === 0 && formData.haircuts_details) {
      handleChange({
        target: {
          name: 'haircuts_details',
          value: ''
        }
      });
    }
  }, [formData.support_haircuts, formData.haircuts_details, handleChange]);

  // Clear dentures details when wears_dentures is set to "No"
  useEffect(() => {
    if (formData.wears_dentures === 0 && formData.dentures_details) {
      handleChange({
        target: {
          name: 'dentures_details',
          value: ''
        }
      });
    }
  }, [formData.wears_dentures, formData.dentures_details, handleChange]);

  // Clear teeth brushing details when support_teeth_brushing is set to "No"
  useEffect(() => {
    if (formData.support_teeth_brushing === 0 && formData.teeth_brushing_details) {
      handleChange({
        target: {
          name: 'teeth_brushing_details',
          value: ''
        }
      });
    }
  }, [formData.support_teeth_brushing, formData.teeth_brushing_details, handleChange]);

  // Clear OT assessment details and type when ot_bathroom_assessment is set to "No"
  useEffect(() => {
    if (formData.ot_bathroom_assessment === 0) {
      if (formData.ot_assessment_details) {
        handleChange({
          target: {
            name: 'ot_assessment_details',
            value: ''
          }
        });
      }
      if (formData.ot_assessment_type) {
        handleChange({
          target: {
            name: 'ot_assessment_type',
            value: ''
          }
        });
      }
    }
  }, [formData.ot_bathroom_assessment, formData.ot_assessment_details, formData.ot_assessment_type, handleChange]);

  // Clear OT referral details when referral_ot_required is set to "No"
  useEffect(() => {
    if (formData.referral_ot_required === 0 && formData.plancare_referral_ot_details) {
      handleChange({
        target: {
          name: 'plancare_referral_ot_details',
          value: ''
        }
      });
    }
  }, [formData.referral_ot_required, formData.plancare_referral_ot_details, handleChange]);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const yesNoOptions = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  const showeringTypeOptions = [
    { label: "Supervision", value: "supervision" },
    { label: "Partial Assistance", value: "partial_assistance" },
    { label: "Full Assistance", value: "full_assistance" },
    { label: "Verbal Prompting", value: "verbal_prompting" },
    { label: "Physical Assistance", value: "physical_assistance" },
  ];

  const otAssessmentTypeOptions = [
    { label: "Supervision", value: "supervision" },
    { label: "Assessment", value: "assessment" },
    { label: "Equipment Recommendation", value: "equipment_recommendation" },
    { label: "Home Modification", value: "home_modification" },
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

  const renderYesNoField = (fieldName: string, label: string, detailsField?: string, additionalField?: string, options?: Array<{label: string, value: string}>) => (
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
                checked={formData[fieldName as keyof SupportPlanPersonalCares] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {additionalField && formData[fieldName as keyof SupportPlanPersonalCares] === 1 && options && (
        <div
          className="relative"
          onMouseEnter={() => setHoveredField(additionalField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">{label} Type</label>
            {hoveredField === additionalField && (
              <button
                type="button"
                onClick={() => handleViewLogs(additionalField)}
                className="text-xs btn-primary text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <select
            name={additionalField}
            value={formData[additionalField as keyof SupportPlanPersonalCares] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select type</option>
            {options.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      )}

      {detailsField && formData[fieldName as keyof SupportPlanPersonalCares] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanPersonalCares] || ""}
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
          Personal Care
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Support Daily Personal Care */}
          {renderYesNoField("support_daily_personal_care", "Do you require support to maintain your daily personal care?", "daily_personal_care_details")}

          {/* Support Showering */}
          {renderYesNoField("support_showering", "Do you require support for showering?", "showering_details", "showering_type", showeringTypeOptions)}

          {/* Personal Care Routine */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("personal_care_routine")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">What is your personal care routine?</label>
              {hoveredField === "personal_care_routine" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("personal_care_routine")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="personal_care_routine"
              placeholder="Describe personal care routine..."
              value={formData.personal_care_routine || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Support Dressing */}
          {renderYesNoField("support_dressing", "Do you require support for undressing/dressing?", "dressing_details")}

          {/* Dressing Routine */}
          {formData.support_dressing === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("dressing_routine")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">What is your dressing/undressing routine?</label>
                {hoveredField === "dressing_routine" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("dressing_routine")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="dressing_routine"
                placeholder="Describe dressing routine..."
                value={formData.dressing_routine || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          )}

          {/* Equipment in Bathroom */}
          {renderYesNoField("equipment_in_bathroom", "Do you have equipment in your shower/bathroom?", "equipment_details")}

          {/* Support Shaving */}
          {renderYesNoField("support_shaving", "Do you require support with shaving?", "shaving_details")}

          {/* Support Haircuts */}
          {renderYesNoField("support_haircuts", "Do you require support with hair cuts", "haircuts_details")}

          {/* Task at Home */}
          {renderYesNoField("task_at_home", "Do you want us to complete this task at home? ")}

          {/* Wears Dentures */}
          {renderYesNoField("wears_dentures", "Do you wear dentures?", "dentures_details")}

          {/* Support Teeth Brushing */}
          {renderYesNoField("support_teeth_brushing", "Do you need support with brushing your teeth?", "teeth_brushing_details")}

          {/* OT Bathroom Assessment */}
          {renderYesNoField("ot_bathroom_assessment", "Have you had an Occupational Therapist assessment on your bathroom/shower?", "ot_assessment_details", "ot_assessment_type", otAssessmentTypeOptions)}

          {/* Referral OT Required */}
          {renderYesNoField("referral_ot_required", "Do you require a referral to an Occupational Therapist?", "plancare_referral_ot_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_personal_care"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}