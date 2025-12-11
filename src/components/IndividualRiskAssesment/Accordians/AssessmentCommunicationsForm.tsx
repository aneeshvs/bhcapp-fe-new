"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface AssessmentCommunicationsFormData {
  hearing_impairment?: number; // 0 or 1 for boolean
  hearing_hazards?: string;
  hearing_management_plan?: string;
  speech_impairment?: number; // 0 or 1 for boolean
  speech_hazards?: string;
  speech_management_plan?: string;
}

interface AssessmentCommunicationsProps {
  formData: AssessmentCommunicationsFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function AssessmentCommunicationsForm({
  formData,
  handleChange,
  uuid,
}: AssessmentCommunicationsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.hearing_impairment === 0) {
      if (formData.hearing_hazards) {
        handleChange({
          target: {
            name: 'hearing_hazards',
            value: ''
          }
        });
      }
      if (formData.hearing_management_plan) {
        handleChange({
          target: {
            name: 'hearing_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.hearing_impairment, formData.hearing_hazards, formData.hearing_management_plan, handleChange]);

  // Clear speech hazards and management plan when speech_impairment is set to "No"
  useEffect(() => {
    if (formData.speech_impairment === 0) {
      if (formData.speech_hazards) {
        handleChange({
          target: {
            name: 'speech_hazards',
            value: ''
          }
        });
      }
      if (formData.speech_management_plan) {
        handleChange({
          target: {
            name: 'speech_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.speech_impairment, formData.speech_hazards, formData.speech_management_plan, handleChange]);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleRadioNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value: Number(value),
      },
    });
  };

  const yesNoOptions = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          ASSESSMENT COMMUNICATIONS
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {/* Hearing Impairment Section */}
          <div className="border-b border-gray-200 pb-6">
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("hearing_impairment")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Does the participant have Hearing impairment?
                </label>
                {hoveredField === "hearing_impairment" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("hearing_impairment")}
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
                      name="hearing_impairment"
                      value={value}
                      checked={formData.hearing_impairment === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Show hearing hazards and management plan only if hearing_impairment is Yes (1) */}
            {formData.hearing_impairment === 1 && (
              <div className="grid grid-cols-1 gap-4 mt-4 pl-4 border-l-2 border-blue-200">
                {/* Hearing Hazards */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("hearing_hazards")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">Hazards identified:</label>
                    {hoveredField === "hearing_hazards" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("hearing_hazards")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="hearing_hazards"
                    placeholder="Describe hearing-related hazards"
                    value={formData.hearing_hazards || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Hearing Management Plan */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("hearing_management_plan")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">
                      	Management Plan
                    </label>
                    {hoveredField === "hearing_management_plan" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("hearing_management_plan")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="hearing_management_plan"
                    placeholder="Describe management plan for hearing impairment"
                    value={formData.hearing_management_plan || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Speech Impairment Section */}
          <div className="border-b border-gray-200 pb-6">
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("speech_impairment")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Does the participant have Speech impairment?
                </label>
                {hoveredField === "speech_impairment" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("speech_impairment")}
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
                      name="speech_impairment"
                      value={value}
                      checked={formData.speech_impairment === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Show speech hazards and management plan only if speech_impairment is Yes (1) */}
            {formData.speech_impairment === 1 && (
              <div className="grid grid-cols-1 gap-4 mt-4 pl-4 border-l-2 border-blue-200">
                {/* Speech Hazards */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("speech_hazards")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">Hazards identified</label>
                    {hoveredField === "speech_hazards" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("speech_hazards")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="speech_hazards"
                    placeholder="Describe speech-related hazards"
                    value={formData.speech_hazards || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Speech Management Plan */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("speech_management_plan")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">
                      Management Plan
                    </label>
                    {hoveredField === "speech_management_plan" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("speech_management_plan")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="speech_management_plan"
                    placeholder="Describe management plan for speech impairment"
                    value={formData.speech_management_plan || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="individual_risk_assessment_communication"
        field={selectedField}
        url="risk-assessment/logs"
      />
    </div>
  );
}