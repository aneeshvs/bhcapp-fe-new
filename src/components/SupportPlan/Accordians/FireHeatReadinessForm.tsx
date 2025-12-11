// FireHeatReadinessForm.tsx
"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanFireHeatReadiness } from "@/src/components/SupportPlan/types";

interface FireHeatReadinessProps {
  formData: SupportPlanFireHeatReadiness;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function FireHeatReadinessForm({
  formData,
  handleChange,
  uuid,
}: FireHeatReadinessProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.home_preparation_support === 0 && formData.home_preparation_details) {
      handleChange({
        target: {
          name: 'home_preparation_details',
          value: ''
        }
      });
    }
  }, [formData.home_preparation_support, formData.home_preparation_details, handleChange]);

  // Clear hydration details when hydration_access is set to "No"
  useEffect(() => {
    if (formData.hydration_access === 0 && formData.hydration_details) {
      handleChange({
        target: {
          name: 'hydration_details',
          value: ''
        }
      });
    }
  }, [formData.hydration_access, formData.hydration_details, handleChange]);

  // Clear home cooling details when home_cooling is set to "No"
  useEffect(() => {
    if (formData.home_cooling === 0 && formData.home_cooling_details) {
      handleChange({
        target: {
          name: 'home_cooling_details',
          value: ''
        }
      });
    }
  }, [formData.home_cooling, formData.home_cooling_details, handleChange]);

  // Clear exit points details when multiple_exit_points is set to "No"
  useEffect(() => {
    if (formData.multiple_exit_points === 0 && formData.exit_points_details) {
      handleChange({
        target: {
          name: 'exit_points_details',
          value: ''
        }
      });
    }
  }, [formData.multiple_exit_points, formData.exit_points_details, handleChange]);

  // Clear fire risk details when identify_fire_risk is set to "No"
  useEffect(() => {
    if (formData.identify_fire_risk === 0 && formData.fire_risk_details) {
      handleChange({
        target: {
          name: 'fire_risk_details',
          value: ''
        }
      });
    }
  }, [formData.identify_fire_risk, formData.fire_risk_details, handleChange]);

  // Clear evacuate independently details when can_evacuate_independently is set to "No"
  useEffect(() => {
    if (formData.can_evacuate_independently === 0 && formData.evacuate_independently_details) {
      handleChange({
        target: {
          name: 'evacuate_independently_details',
          value: ''
        }
      });
    }
  }, [formData.can_evacuate_independently, formData.evacuate_independently_details, handleChange]);

  // Clear support from family/neighbour details when support_from_family_or_neighbour is set to "No"
  useEffect(() => {
    if (formData.support_from_family_or_neighbour === 0 && formData.support_from_family_or_neighbour_details) {
      handleChange({
        target: {
          name: 'support_from_family_or_neighbour_details',
          value: ''
        }
      });
    }
  }, [formData.support_from_family_or_neighbour, formData.support_from_family_or_neighbour_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanFireHeatReadiness] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanFireHeatReadiness] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanFireHeatReadiness] || ""}
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
          Fire & Heat Readiness
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Home Preparation Support */}
          {renderYesNoField("home_preparation_support", "Do you require support to prepare your home for the fire season, such as gutter cleaning, tree pruning etc.", "home_preparation_details")}

          {/* Hydration Access */}
          {renderYesNoField("hydration_access", "Are you able to maintain hydration C easily access fluids during warm weather?", "hydration_details")}

          {/* Home Cooling */}
          {renderYesNoField("home_cooling", "Do you have C use cooling in your home during warm weather", "home_cooling_details")}

          {/* Multiple Exit Points */}
          {renderYesNoField("multiple_exit_points", "Do you have multiple exit points from your home and street in case of a fire?", "exit_points_details")}

          {/* Identify Fire Risk */}
          {renderYesNoField("identify_fire_risk", "Are you able to identify the risk of bushfire or fire and know when to evacuate?", "fire_risk_details")}

          {/* Can Evacuate Independently */}
          {renderYesNoField("can_evacuate_independently", "Can you evacuate independently?", "evacuate_independently_details")}

          {/* Support from Family/Neighbour */}
          {renderYesNoField("support_from_family_or_neighbour", "Do you have support from family or a neighbour who checks in on you during warm days?", "support_from_family_or_neighbour_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_fire_heat_readiness"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}