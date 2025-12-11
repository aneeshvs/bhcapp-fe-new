// StormFloodingForm.tsx
"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanStormFlooding } from "@/src/components/SupportPlan/types";

interface StormFloodingProps {
  formData: SupportPlanStormFlooding;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function StormFloodingForm({
  formData,
  handleChange,
  uuid,
}: StormFloodingProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.storm_home_preparation_support === 0 && formData.storm_home_preparation_details) {
      handleChange({
        target: {
          name: 'storm_home_preparation_details',
          value: ''
        }
      });
    }
  }, [formData.storm_home_preparation_support, formData.storm_home_preparation_details, handleChange]);

  // Clear storm multiple exit points details when storm_multiple_exit_points is set to "No"
  useEffect(() => {
    if (formData.storm_multiple_exit_points === 0 && formData.storm_multiple_exit_points_details) {
      handleChange({
        target: {
          name: 'storm_multiple_exit_points_details',
          value: ''
        }
      });
    }
  }, [formData.storm_multiple_exit_points, formData.storm_multiple_exit_points_details, handleChange]);

  // Clear identify flood risk details when identify_flood_risk is set to "No"
  useEffect(() => {
    if (formData.identify_flood_risk === 0 && formData.identify_flood_risk_details) {
      handleChange({
        target: {
          name: 'identify_flood_risk_details',
          value: ''
        }
      });
    }
  }, [formData.identify_flood_risk, formData.identify_flood_risk_details, handleChange]);

  // Clear storm evacuate independently details when storm_can_evacuate_independently is set to "No"
  useEffect(() => {
    if (formData.storm_can_evacuate_independently === 0 && formData.storm_evacuate_independently_details) {
      handleChange({
        target: {
          name: 'storm_evacuate_independently_details',
          value: ''
        }
      });
    }
  }, [formData.storm_can_evacuate_independently, formData.storm_evacuate_independently_details, handleChange]);

  // Clear storm support from family/neighbour details when storm_support_from_family_or_neighbour is set to "No"
  useEffect(() => {
    if (formData.storm_support_from_family_or_neighbour === 0 && formData.storm_support_from_family_or_neighbour_details) {
      handleChange({
        target: {
          name: 'storm_support_from_family_or_neighbour_details',
          value: ''
        }
      });
    }
  }, [formData.storm_support_from_family_or_neighbour, formData.storm_support_from_family_or_neighbour_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanStormFlooding] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanStormFlooding] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanStormFlooding] || ""}
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
          Storm & Flooding Readiness
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Home Preparation Support */}
          {renderYesNoField("storm_home_preparation_support", "Do you require support to prepare your home for storms, such as gutter cleaning, tree pruning, etc.?", "storm_home_preparation_details")}

          {/* Multiple Exit Points */}
          {renderYesNoField("storm_multiple_exit_points", "Do you have multiple exit points from your home and street in case of flooding?", "storm_multiple_exit_points_details")}

          {/* Identify Flood Risk */}
          {renderYesNoField("identify_flood_risk", "Are you able to identify the risk of flooding and know when to evacuate?", "identify_flood_risk_details")}

          {/* Can Evacuate Independently */}
          {renderYesNoField("storm_can_evacuate_independently", "Can you evacuate independently?", "storm_evacuate_independently_details")}

          {/* Support from Family/Neighbour */}
          {renderYesNoField("storm_support_from_family_or_neighbour", "Do you have support from a family member or neighbour who checks in on you during a storm?", "storm_support_from_family_or_neighbour_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_storm_flooding"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}