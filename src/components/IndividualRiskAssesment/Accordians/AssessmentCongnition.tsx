"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface AssessmentCognitionsFormData {
  oriented_in_time_place?: number; // 0 or 1 for boolean
  oriented_hazards?: string;
  oriented_management_plan?: string;
  accepts_direction?: number; // 0 or 1 for boolean
  direction_hazards?: string;
  direction_management_plan?: string;
  short_term_memory_issues?: number; // 0 or 1 for boolean
  memory_hazards?: string;
  memory_management_plan?: string;
}

interface AssessmentCognitionsProps {
  formData: AssessmentCognitionsFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function AssessmentCognitionsForm({
  formData,
  handleChange,
  uuid,
}: AssessmentCognitionsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.oriented_in_time_place === 0) {
      if (formData.oriented_hazards) {
        handleChange({
          target: {
            name: 'oriented_hazards',
            value: ''
          }
        });
      }
      if (formData.oriented_management_plan) {
        handleChange({
          target: {
            name: 'oriented_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.oriented_in_time_place, formData.oriented_hazards, formData.oriented_management_plan, handleChange]);

  // Clear direction hazards and management plan when accepts_direction is set to "No"
  useEffect(() => {
    if (formData.accepts_direction === 0) {
      if (formData.direction_hazards) {
        handleChange({
          target: {
            name: 'direction_hazards',
            value: ''
          }
        });
      }
      if (formData.direction_management_plan) {
        handleChange({
          target: {
            name: 'direction_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.accepts_direction, formData.direction_hazards, formData.direction_management_plan, handleChange]);

  // Clear memory hazards and management plan when short_term_memory_issues is set to "No"
  useEffect(() => {
    if (formData.short_term_memory_issues === 0) {
      if (formData.memory_hazards) {
        handleChange({
          target: {
            name: 'memory_hazards',
            value: ''
          }
        });
      }
      if (formData.memory_management_plan) {
        handleChange({
          target: {
            name: 'memory_management_plan',
            value: ''
          }
        });
      }
    }
  }, [formData.short_term_memory_issues, formData.memory_hazards, formData.memory_management_plan, handleChange]);

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
          ASSESSMENT COGNITIONS
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {/* Oriented in Time & Place Section */}
          <div className="border-b border-gray-200 pb-6">
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("oriented_in_time_place")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Is the participant disoriented to time and place?
                </label>
                {hoveredField === "oriented_in_time_place" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("oriented_in_time_place")}
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
                      name="oriented_in_time_place"
                      value={value}
                      checked={formData.oriented_in_time_place === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Show oriented hazards and management plan only if oriented_in_time_place is Yes (1) */}
            {formData.oriented_in_time_place === 1 && (
              <div className="grid grid-cols-1 gap-4 mt-4 pl-4 border-l-2 border-blue-200">
                {/* Oriented Hazards */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("oriented_hazards")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">Hazards identified</label>
                    {hoveredField === "oriented_hazards" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("oriented_hazards")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="oriented_hazards"
                    placeholder="Describe hazards related to time and place orientation"
                    value={formData.oriented_hazards || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Oriented Management Plan */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("oriented_management_plan")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">
                      Outline potential risks related to the participant being disoriented in time or place.
                    </label>
                    {hoveredField === "oriented_management_plan" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("oriented_management_plan")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="oriented_management_plan"
                    placeholder="Outline potential risks related to the participant being disoriented in time or place."
                    value={formData.oriented_management_plan || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Accepts Direction Section */}
          <div className="border-b border-gray-200 pb-6">
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("accepts_direction")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Is the participant unable to follow directions or instructions?
                </label>
                {hoveredField === "accepts_direction" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("accepts_direction")}
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
                      name="accepts_direction"
                      value={value}
                      checked={formData.accepts_direction === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Show direction hazards and management plan only if accepts_direction is Yes (1) */}
            {formData.accepts_direction === 1 && (
              <div className="grid grid-cols-1 gap-4 mt-4 pl-4 border-l-2 border-blue-200">
                {/* Direction Hazards */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("direction_hazards")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">Hazards identified</label>
                    {hoveredField === "direction_hazards" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("direction_hazards")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="direction_hazards"
                    placeholder="Describe hazards related to accepting direction"
                    value={formData.direction_hazards || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Direction Management Plan */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("direction_management_plan")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">
                      Outline potential risks if the participant has difficulty following directions or instructions
                    </label>
                    {hoveredField === "direction_management_plan" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("direction_management_plan")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="direction_management_plan"
                    placeholder="Outline potential risks if the participant has difficulty following directions or instructions"
                    value={formData.direction_management_plan || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Short Term Memory Issues Section */}
          <div className="border-b border-gray-200 pb-6">
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("short_term_memory_issues")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Does the participant experience short-term memory difficulties?
                </label>
                {hoveredField === "short_term_memory_issues" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("short_term_memory_issues")}
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
                      name="short_term_memory_issues"
                      value={value}
                      checked={formData.short_term_memory_issues === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Show memory hazards and management plan only if short_term_memory_issues is Yes (1) */}
            {formData.short_term_memory_issues === 1 && (
              <div className="grid grid-cols-1 gap-4 mt-4 pl-4 border-l-2 border-blue-200">
                {/* Memory Hazards */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("memory_hazards")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">Hazards identified</label>
                    {hoveredField === "memory_hazards" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("memory_hazards")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="memory_hazards"
                    placeholder="Describe hazards related to short term memory issues"
                    value={formData.memory_hazards || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                {/* Memory Management Plan */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("memory_management_plan")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">
                      Outline potential risks associated with short-term memory difficulties.
                    </label>
                    {hoveredField === "memory_management_plan" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("memory_management_plan")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <textarea
                    name="memory_management_plan"
                    placeholder="Outline potential risks associated with short-term memory difficulties."
                    value={formData.memory_management_plan || ""}
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
        table="individual_risk_assessment_cognition"
        field={selectedField}
        url="risk-assessment/logs"
      />
    </div>
  );
}