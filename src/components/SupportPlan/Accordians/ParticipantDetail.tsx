"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { Participant } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";

interface ParticipantDetailProps {
  formData: Participant;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function ParticipantDetailForm({
  formData,
  handleChange,
  uuid
}: ParticipantDetailProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    console.log("View logs clicked", fieldName);
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

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Card Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Participant Details
        </h4>
      </div>

      {/* Form Body */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
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

          {/* Surname */}
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

          {/* Preferred Name */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("preferred_name")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Preferred Name</label>
              {hoveredField === "preferred_name" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("preferred_name")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="preferred_name"
              placeholder="Enter preferred name"
              value={formData.preferred_name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Date of Birth */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("date_of_birth")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date of Birth</label>
              {hoveredField === "date_of_birth" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("date_of_birth")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2" */}
            {/* /> */}
          </div>

          {/* Country of Birth */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("country_of_birth")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Country of Birth</label>
              {hoveredField === "country_of_birth" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("country_of_birth")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="country_of_birth"
              placeholder="Enter country of birth"
              value={formData.country_of_birth || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Gender */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("gender")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Gender</label>
              {hoveredField === "gender" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("gender")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Identify as Aboriginal or Torres Strait Islander */}
          <div
            className="relative"
            onMouseEnter={() =>
              setHoveredField("identify_as_aboriginal_or_torres_strait")
            }
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                Do you identify as Aboriginal or Torress Strait Island
              </label>
              {hoveredField ===
                "identify_as_aboriginal_or_torres_strait" && (
                <button
                  type="button"
                  onClick={() =>
                    handleViewLogs("identify_as_aboriginal_or_torres_strait")
                  }
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
                    name="identify_as_aboriginal_or_torres_strait"
                    value={value}
                    checked={
                      formData.identify_as_aboriginal_or_torres_strait === value
                    }
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="participant_detail"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}