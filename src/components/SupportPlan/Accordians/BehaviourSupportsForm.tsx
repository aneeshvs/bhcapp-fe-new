"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanBehaviourSupports } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";

interface BehaviourSupportsProps {
  formData: SupportPlanBehaviourSupports;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function BehaviourSupportsForm({
  formData,
  handleChange,
  uuid,
}: BehaviourSupportsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.feeling_agitation === 0 && formData.feeling_agitation_details) {
      handleChange({
        target: {
          name: 'feeling_agitation_details',
          value: ''
        }
      });
    }
  }, [formData.feeling_agitation, formData.feeling_agitation_details, handleChange]);

  // Clear delusions/hallucinations details when delusions_hallucinations is set to "No"
  useEffect(() => {
    if (formData.delusions_hallucinations === 0 && formData.delusions_hallucinations_details) {
      handleChange({
        target: {
          name: 'delusions_hallucinations_details',
          value: ''
        }
      });
    }
  }, [formData.delusions_hallucinations, formData.delusions_hallucinations_details, handleChange]);

  // Clear personality changes details when personality_changes is set to "No"
  useEffect(() => {
    if (formData.personality_changes === 0 && formData.personality_changes_details) {
      handleChange({
        target: {
          name: 'personality_changes_details',
          value: ''
        }
      });
    }
  }, [formData.personality_changes, formData.personality_changes_details, handleChange]);

  // Clear wandering purpose details when wandering_purpose is set to "No"
  useEffect(() => {
    if (formData.wandering_purpose === 0 && formData.wandering_purpose_details) {
      handleChange({
        target: {
          name: 'wandering_purpose_details',
          value: ''
        }
      });
    }
  }, [formData.wandering_purpose, formData.wandering_purpose_details, handleChange]);

  // Clear absconding concerns details when absconding_concerns is set to "No"
  useEffect(() => {
    if (formData.absconding_concerns === 0 && formData.absconding_concerns_details) {
      handleChange({
        target: {
          name: 'absconding_concerns_details',
          value: ''
        }
      });
    }
  }, [formData.absconding_concerns, formData.absconding_concerns_details, handleChange]);

  // Clear verbal threats details when verbal_threats is set to "No"
  useEffect(() => {
    if (formData.verbal_threats === 0 && formData.verbal_threats_details) {
      handleChange({
        target: {
          name: 'verbal_threats_details',
          value: ''
        }
      });
    }
  }, [formData.verbal_threats, formData.verbal_threats_details, handleChange]);

  // Clear physical assault details when physical_assault is set to "No"
  useEffect(() => {
    if (formData.physical_assault === 0 && formData.physical_assault_details) {
      handleChange({
        target: {
          name: 'physical_assault_details',
          value: ''
        }
      });
    }
  }, [formData.physical_assault, formData.physical_assault_details, handleChange]);

  // Clear restrictive interventions details when restrictive_interventions is set to "No"
  useEffect(() => {
    if (formData.restrictive_interventions === 0 && formData.restrictive_interventions_details) {
      handleChange({
        target: {
          name: 'restrictive_interventions_details',
          value: ''
        }
      });
    }
  }, [formData.restrictive_interventions, formData.restrictive_interventions_details, handleChange]);

  // Clear restrictive practitioner details when restrictive_physical is set to "No"
  useEffect(() => {
    if (formData.restrictive_physical === 0) {
      if (formData.restrictive_approved_by_practitioner !== undefined) {
        handleChange({
          target: {
            name: 'restrictive_approved_by_practitioner',
            value: 0
          }
        });
      }
      if (formData.restrictive_practitioner_details) {
        handleChange({
          target: {
            name: 'restrictive_practitioner_details',
            value: ''
          }
        });
      }
    }
  }, [formData.restrictive_physical, formData.restrictive_approved_by_practitioner, formData.restrictive_practitioner_details, handleChange]);

  // Clear positive behaviour practitioner referral details when referral_positive_behaviour_practitioner is set to "No"
  useEffect(() => {
    if (formData.referral_positive_behaviour_practitioner === 0 && formData.referral_positive_behaviour_practitioner_details) {
      handleChange({
        target: {
          name: 'referral_positive_behaviour_practitioner_details',
          value: ''
        }
      });
    }
  }, [formData.referral_positive_behaviour_practitioner, formData.referral_positive_behaviour_practitioner_details, handleChange]);

  // Clear behaviour support plan expiry when behaviour_support_plan_required is set to "No"
  useEffect(() => {
    if (formData.behaviour_support_plan_required === 0 && formData.behaviour_support_plan_expiry) {
      handleChange({
        target: {
          name: 'behaviour_support_plan_expiry',
          value: ''
        }
      });
    }
  }, [formData.behaviour_support_plan_required, formData.behaviour_support_plan_expiry, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanBehaviourSupports] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanBehaviourSupports] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanBehaviourSupports] || ""}
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
          Behaviour Support
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Feeling Agitation */}
          {renderYesNoField("feeling_agitation", "Do you experience feeling agitation or frustration", "feeling_agitation_details")}

          {/* Delusions/Hallucinations */}
          {renderYesNoField("delusions_hallucinations", "Have you had delusions or hallucinations previously?", "delusions_hallucinations_details")}

          {/* Personality Changes */}
          {renderYesNoField("personality_changes", "Are there changes to your personality that are out of character?", "personality_changes_details")}

          {/* Wandering with Purpose */}
          {renderYesNoField("wandering_purpose", "Do you wander around with no purpose?", "wandering_purpose_details")}

          {/* Absconding Concerns */}
          {renderYesNoField("absconding_concerns", "Have you absconded previously or are there concerns of absconding?", "absconding_concerns_details")}

          {/* Verbal Threats */}
          {renderYesNoField("verbal_threats", "Do you scream, yell or verbally threaten others?", "verbal_threats_details")}

          {/* Physical Assault */}
          {renderYesNoField("physical_assault", "Do you physically assault or threaten to assault others?", "physical_assault_details")}

          {/* Restrictive Interventions */}
          {renderYesNoField("restrictive_interventions", "Are there Restrictive Interventions occurring?", "restrictive_interventions_details")}

          {/* Restrictive Physical */}
          {renderYesNoField("restrictive_physical", "Are the restrictive interventions approved by a Behaviour Support Practitioner?")}

          {/* Restrictive Approved by Practitioner */}
          {formData.restrictive_physical === 1 && (
            renderYesNoField("restrictive_approved_by_practitioner", "Restrictive Approved by Practitioner", "restrictive_practitioner_details")
          )}

          {/* Current Strategies */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("current_strategies")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Current strategies being implemented	</label>
              {hoveredField === "current_strategies" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("current_strategies")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="current_strategies"
              placeholder="Describe current behaviour support strategies..."
              value={formData.current_strategies || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
            />
          </div>

          {/* Referral to Positive Behaviour Practitioner */}
          {renderYesNoField("referral_positive_behaviour_practitioner", "Is a referral to a Positive Behaviour Support Practitioner required?", "referral_positive_behaviour_practitioner_details")}

          {/* Behaviour Support Plan Required */}
          {renderYesNoField("behaviour_support_plan_required", "Is a Behavior Support Plan required?")}

          {/* Behaviour Support Plan Expiry */}
          {formData.behaviour_support_plan_required === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("behaviour_support_plan_expiry")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Date of expiry of current Behaviour Support Plan</label>
                {hoveredField === "behaviour_support_plan_expiry" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("behaviour_support_plan_expiry")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <DatePicker
                name="behaviour_support_plan_expiry"
                value={formData.behaviour_support_plan_expiry}
                onChange={handleChange}
              />
              {/* <input
                type="date"
                name="behaviour_support_plan_expiry"
                value={formData.behaviour_support_plan_expiry || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              /> */}
            </div>
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_behaviour_support"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}