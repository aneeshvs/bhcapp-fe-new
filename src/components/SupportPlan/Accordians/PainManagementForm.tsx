"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanPain } from "@/src/components/SupportPlan/types";

interface SupportPlanPainProps {
  formData: SupportPlanPain;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function DietariesForm({
  formData,
  handleChange,
  uuid,
}: SupportPlanPainProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.ongoing_pain === 0) {
      // Clear pain details
      if (formData.pain_details) {
        handleChange({
          target: {
            name: 'pain_details',
            value: ''
          }
        });
      }
    }
  }, [formData.ongoing_pain, formData.pain_details, handleChange]);

  // Clear supported pain details when supported_for_pain is set to "No"
  useEffect(() => {
    if (formData.supported_for_pain === 0 && formData.supported_pain_details) {
      handleChange({
        target: {
          name: 'supported_pain_details',
          value: ''
        }
      });
    }
  }, [formData.supported_for_pain, formData.supported_pain_details, handleChange]);

  // Clear pain worry details when pain_worry is set to "No"
  useEffect(() => {
    if (formData.pain_worry === 0 && formData.pain_worry_details) {
      handleChange({
        target: {
          name: 'pain_worry_details',
          value: ''
        }
      });
    }
  }, [formData.pain_worry, formData.pain_worry_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanPain] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanPain] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanPain] || ""}
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
          Support Plan Pain
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Intolerances */}
          {renderYesNoField("ongoing_pain", "Do you have ongoing pain?", "pain_details")}

          {/* IDDSI Food Category */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("pain_location")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Location of the pain</label>
              {hoveredField === "pain_location" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("pain_location")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="pain_location"
              placeholder="Enter Pian Location"
              value={formData.pain_location || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* IDDSI Liquid Category */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("pain_frequency")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Frequency of the pain</label>
              {hoveredField === "pain_frequency" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("pain_frequency")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="pain_frequency"
              placeholder="Enter IDDSI liquid category"
              value={formData.pain_frequency || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>


          <div
            className="relative"
            onMouseEnter={() => setHoveredField("pain_scale")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Scale of the pain</label>
              {hoveredField === "pain_scale" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("pain_scale")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="number"
              name="pain_scale"
              placeholder="Enter Pain Scale"
              value={formData.pain_scale || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Prepares Meals */}
          {renderYesNoField("supported_for_pain", "Are you currently being supported to manage your pain?", "supported_pain_details")}

          <div
            className="relative"
            onMouseEnter={() => setHoveredField("pain_management_strategies")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Strategies to manage the pain</label>
              {hoveredField === "pain_management_strategies" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("pain_management_strategies")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="pain_management_strategies"
              placeholder="Enter Pain Management Strategies"
              value={formData.pain_management_strategies || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>


          <div
            className="relative"
            onMouseEnter={() => setHoveredField("abbey_pain_scale_required")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Does the Abbey Pain Scale need to be completed</label>
              {hoveredField === "abbey_pain_scale_required" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("abbey_pain_scale_required")}
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
                    name="abbey_pain_scale_required"
                    value={value}
                    checked={formData.abbey_pain_scale_required === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {renderYesNoField("pain_worry", "Does any aspect of your pain worry you?", "pain_worry_details")}

        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_pain_management"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}