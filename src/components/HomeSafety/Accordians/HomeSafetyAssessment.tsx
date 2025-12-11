"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface HomeSafetyChecklistFormData {
  participant_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_new_participant?: number;
  is_review_existing?: number;
  does_participant_agree?: number;
  entry_door?: string;
  entry_door_other?: string;
}

interface HomeSafetyChecklistProps {
  formData: HomeSafetyChecklistFormData;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function HomeSafetyChecklistForm({
  formData,
  handleChange,
  uuid,
}: HomeSafetyChecklistProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleRadioBooleanChange = (fieldName: string, value: number) => {
    handleChange({
      target: {
        name: fieldName,
        value: Number(value),
      },
    });
  };

  const handleRadioStringChange = (fieldName: string, value: string) => {
    handleChange({
      target: {
        name: fieldName,
        value,
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      handleChange({
        target: {
          name,
          value: checked,
        },
      });
    } else {
      handleChange({
        target: {
          name,
          value,
        },
      });
    }
  };

  const entryDoorOptions = [
    { value: "front", label: "Front" },
    { value: "side", label: "Side" },
    { value: "rear", label: "Rear" },
    { value: "other", label: "Other" },
  ];

  const yesNoOptions = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 },
  ];

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          HOME SAFETY CHECKLIST ASSESSMENT
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {/* Participant Details Section */}
          <div className="border-b pb-4">
            <h5 className="text-md font-semibold mb-3 text-gray-700">Participant Details</h5>
            
            {/* Participant Name */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("participant_name")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Participant Name</label>
                {hoveredField === "participant_name" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("participant_name")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="participant_name"
                value={formData.participant_name || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter participant name"
              />
            </div>

            {/* Address */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("address")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Address</label>
                {hoveredField === "address" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("address")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full address"
                rows={3}
              />
            </div>

            {/* Phone */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("phone")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Phone</label>
                {hoveredField === "phone" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("phone")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            {/* Email */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("email")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Email</label>
                {hoveredField === "email" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("email")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Assessment Type Section */}
          <div className="border-b pb-4">
            <h5 className="text-md font-semibold mb-3 text-gray-700">Assessment Type</h5>
            
            {/* Is New Participant */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("is_new_participant")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Is this a new participant?</label>
                {hoveredField === "is_new_participant" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("is_new_participant")}
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
                      name="is_new_participant"
                      checked={formData.is_new_participant === value}
                      onChange={() => handleRadioBooleanChange("is_new_participant", value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Is Review Existing */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("is_review_existing")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Is this a review of existing home safety assessment?</label>
                {hoveredField === "is_review_existing" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("is_review_existing")}
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
                      name="is_review_existing"
                      checked={formData.is_review_existing === value}
                      onChange={() => handleRadioBooleanChange("is_review_existing", value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Agreement and Entry Details Section */}
          <div>
            {/* Does Participant Agree */}
            <div
              className="relative mb-6"
              onMouseEnter={() => setHoveredField("does_participant_agree")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Does the participant agree to the home safety assessment?</label>
                {hoveredField === "does_participant_agree" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("does_participant_agree")}
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
                      name="does_participant_agree"
                      checked={formData.does_participant_agree === value}
                      onChange={() => handleRadioBooleanChange("does_participant_agree", value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Entry Door Selection */}
            <div
              className="relative mb-4"
              onMouseEnter={() => setHoveredField("entry_door")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Which door is used for entry?<br/>(if ‘Other’, please define)</label>
                {hoveredField === "entry_door" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("entry_door")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-4 py-2">
                {entryDoorOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`entry_door_${option.value}`}
                      name="entry_door"
                      value={option.value}
                      checked={formData.entry_door === option.value}
                      onChange={() => handleRadioStringChange("entry_door", option.value)}
                      className="mr-2"
                    />
                    <label htmlFor={`entry_door_${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Entry Door Other (Conditional) */}
            {formData.entry_door === "other" && (
              <div
                className="relative"
                onMouseEnter={() => setHoveredField("entry_door_other")}
                onMouseLeave={() => setHoveredField(null)}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Specify Other Entry Door</label>
                  {hoveredField === "entry_door_other" && (
                    <button
                      type="button"
                      onClick={() => handleViewLogs("entry_door_other")}
                      className="text-xs btn-primary text-white px-2 py-1 rounded"
                    >
                      View Logs
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  name="entry_door_other"
                  value={formData.entry_door_other || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please specify the entry door location"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="home_safety_checklist_assessment"
        field={selectedField}
        url="home-safety-assessment/logs"
      />
    </div>
  );
}