"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { AlternativeDecisionMakerFormData } from "@/src/components/SupportCarePlan/types";

interface AlternativeDecisionMakerProps {
  formData: AlternativeDecisionMakerFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function AlternativeDecisionMakerForm({
  formData,
  handleChange,
  uuid,
}: AlternativeDecisionMakerProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleTypeChange = (value: string) => {
    handleChange({
      target: {
        name: "type",
        value,
      },
    });
  };

  const typeOptions = [
    { value: "not_applicable", label: "Not Applicable" },
    { value: "partner", label: "Partner" },
    { value: "carer", label: "Carer" },
    { value: "guardian", label: "Guardian" },
    { value: "parent", label: "Parent" },
    { value: "advocacy", label: "Advocacy" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Alternative Decision Maker Information
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-4">
          {/* Type Selection - Horizontal Radio Buttons */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("type")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Type</label>
              {hoveredField === "type" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("type")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 py-2">
              {typeOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={`type_${option.value}`}
                    name="type"
                    value={option.value}
                    checked={formData.type === option.value}
                    onChange={() => handleTypeChange(option.value)}
                    className="mr-2"
                  />
                  <label htmlFor={`type_${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* First Name - Only show if a type is selected and it's not "not_applicable" */}
          {formData.type && formData.type !== "not_applicable" && (
            <div className="flex flex-col md:flex-row gap-4">
              {/* First Name - Half width on medium screens and up */}
              <div className="flex-1">
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("first_name")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">First Name</label>
                    {hoveredField === "first_name" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("first_name")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Enter first name"
                    value={formData.first_name || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Surname - Half width on medium screens and up */}
              <div className="flex-1">
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredField("surname")}
                  onMouseLeave={() => setHoveredField(null)}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">Surname</label>
                    {hoveredField === "surname" && (
                      <button
                        type="button"
                        onClick={() => handleViewLogs("surname")}
                        className="text-xs btn-primary text-white px-2 py-1 rounded"
                      >
                        View Logs
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    name="surname"
                    placeholder="Enter surname"
                    value={formData.surname || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes - Only show if a type is selected and it's not "not_applicable" */}
          {formData.type && formData.type !== "not_applicable" && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("notes")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Notes</label>
                {hoveredField === "notes" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("notes")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="notes"
                placeholder="Enter notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="alternate_decision_maker" // Adjust this table name as needed
        field={selectedField}
        url="support-care-plan/logs"
      />
    </div>
  );
}
