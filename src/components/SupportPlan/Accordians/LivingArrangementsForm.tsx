'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import { SupportPlanLivingArrangements } from '@/src/components/SupportPlan/types';
import DatePicker from "../../DatePicker";


interface LivingArrangementsProps {
  formData: SupportPlanLivingArrangements;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function LivingArrangementsForm({
  formData,
  handleChange,
  uuid,
}: LivingArrangementsProps) {
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

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Card Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Living Arrangements
        </h4>
      </div>

      {/* Form Body */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reside In */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("reside_in")}
            onMouseLeave={() => setHoveredField(null)}
            >
            <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">I reside in</label>
                {hoveredField === "reside_in" && (
                <button
                    type="button"
                    onClick={() => handleViewLogs("reside_in")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                    View Logs
                </button>
                )}
            </div>
            <input
                type="text"
                name="reside_in"
                placeholder="Enter where you reside (e.g., Private Home, Apartment, etc.)"
                value={formData.reside_in || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
            />
            </div>

            {/* Reside With */}
            <div
            className="relative"
            onMouseEnter={() => setHoveredField("reside_with")}
            onMouseLeave={() => setHoveredField(null)}
            >
            <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">I reside with</label>
                {hoveredField === "reside_with" && (
                <button
                    type="button"
                    onClick={() => handleViewLogs("reside_with")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                    View Logs
                </button>
                )}
            </div>
            <input
                type="text"
                name="reside_with"
                placeholder="Enter who you reside with (e.g., Alone, Family, Friends, etc.)"
                value={formData.reside_with || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
            />
            </div>

          {/* Home Safety Assessment Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("home_safety_assessment_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date Home Safety Assessment completed</label>
              {hoveredField === "home_safety_assessment_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("home_safety_assessment_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="home_safety_assessment_date"
              value={formData.home_safety_assessment_date}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="home_safety_assessment_date"
              value={formData.home_safety_assessment_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Is Home Suitable */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("is_home_suitable")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Is the home suitable to meet your needs?</label>
              {hoveredField === "is_home_suitable" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("is_home_suitable")}
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
                    name="is_home_suitable"
                    value={value}
                    checked={formData.is_home_suitable === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Home Suitable Details */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("home_suitable_details")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">List Details</label>
              {hoveredField === "home_suitable_details" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("home_suitable_details")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="home_suitable_details"
              placeholder="Provide details about home suitability..."
              value={formData.home_suitable_details || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* At Risk of Homelessness */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("at_risk_of_homelessness")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Are you at risk of homelessness?</label>
              {hoveredField === "at_risk_of_homelessness" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("at_risk_of_homelessness")}
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
                    name="at_risk_of_homelessness"
                    value={value}
                    checked={formData.at_risk_of_homelessness === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Homelessness Details */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("homelessness_details")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">List Details</label>
              {hoveredField === "homelessness_details" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("homelessness_details")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="homelessness_details"
              placeholder="Provide details about homelessness risk..."
              value={formData.homelessness_details || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ''}
        table="support_plan_living_arrangement"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}