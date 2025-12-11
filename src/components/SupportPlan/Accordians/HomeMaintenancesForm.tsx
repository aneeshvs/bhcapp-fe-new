"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanHomeMaintenances } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";

interface HomeMaintenancesProps {
  formData: SupportPlanHomeMaintenances;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function HomeMaintenancesForm({
  formData,
  handleChange,
  uuid,
}: HomeMaintenancesProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.needs_domestic_assistance === 0) {
      if (formData.domestic_assistance_details) {
        handleChange({
          target: {
            name: 'domestic_assistance_details',
            value: ''
          }
        });
      }
      if (formData.domestic_assistance_type) {
        handleChange({
          target: {
            name: 'domestic_assistance_type',
            value: ''
          }
        });
      }
    }
  }, [formData.needs_domestic_assistance, formData.domestic_assistance_details, formData.domestic_assistance_type, handleChange]);

  // Clear cleaning products details when needs_help_with_cleaning_products is set to "No"
  useEffect(() => {
    if (formData.needs_help_with_cleaning_products === 0 && formData.cleaning_products_details) {
      handleChange({
        target: {
          name: 'cleaning_products_details',
          value: ''
        }
      });
    }
  }, [formData.needs_help_with_cleaning_products, formData.cleaning_products_details, handleChange]);

  // Clear garden support details when needs_garden_support is set to "No"
  useEffect(() => {
    if (formData.needs_garden_support === 0 && formData.garden_support_details) {
      handleChange({
        target: {
          name: 'garden_support_details',
          value: ''
        }
      });
    }
  }, [formData.needs_garden_support, formData.garden_support_details, handleChange]);

  // Clear navigating at night details when trouble_navigating_at_night is set to "No"
  useEffect(() => {
    if (formData.trouble_navigating_at_night === 0 && formData.navigating_at_night_details) {
      handleChange({
        target: {
          name: 'navigating_at_night_details',
          value: ''
        }
      });
    }
  }, [formData.trouble_navigating_at_night, formData.navigating_at_night_details, handleChange]);

  // Clear home maintenance worries details when home_maintenance_worries is set to "No"
  useEffect(() => {
    if (formData.home_maintenance_worries === 0 && formData.home_maintenance_worries_details) {
      handleChange({
        target: {
          name: 'home_maintenance_worries_details',
          value: ''
        }
      });
    }
  }, [formData.home_maintenance_worries, formData.home_maintenance_worries_details, handleChange]);

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

  const renderYesNoField = (fieldName: string, label: string, detailsField?: string, additionalField?: string) => (
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
              name={fieldName} // ✅ Fixed: using fieldName parameter
              value={value}
              checked={formData[fieldName as keyof SupportPlanHomeMaintenances] === value}
              onChange={handleRadioNumberChange}
            />
            {label}
          </label>
        ))}
      </div>
    </div>

    {/* Rest of the function remains the same */}
    {additionalField && formData[fieldName as keyof SupportPlanHomeMaintenances] === 1 && (
      <div
        className="relative"
        onMouseEnter={() => setHoveredField(additionalField)}
        onMouseLeave={() => setHoveredField(null)}
      >
        <div className="flex justify-between items-center mb-1">
          <label className="block font-medium">{label} Type</label>
          {hoveredField === additionalField && (
            <button
              type="button"
              onClick={() => handleViewLogs(additionalField)}
              className="text-xs btn-primary text-white px-2 py-1 rounded"
            >
              View Logs
            </button>
          )}
        </div>
        <input
          type="text"
          name={additionalField}
          placeholder={`Enter ${label.toLowerCase()} type`}
          value={formData[additionalField as keyof SupportPlanHomeMaintenances] || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
    )}

    {detailsField && formData[fieldName as keyof SupportPlanHomeMaintenances] === 1 && (
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
          value={formData[detailsField as keyof SupportPlanHomeMaintenances] || ""}
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
          Home Maintenance
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Needs Domestic Assistance */}
          {renderYesNoField("needs_domestic_assistance", "Do you need support with domestic assistance within the home?", "domestic_assistance_details", "domestic_assistance_type")}

          {/* Needs Help with Cleaning Products */}
          {renderYesNoField("needs_help_with_cleaning_products", "If you require our support with Domestic Assistance, do you also need help obtaining safe and approved cleaning products and equipment?", "cleaning_products_details")}

          {/* Needs Garden Support */}
          {renderYesNoField("needs_garden_support", "Do you need support with maintaining your gardens to be safe?", "garden_support_details")}

          {/* Trouble Navigating at Night */}
          {renderYesNoField("trouble_navigating_at_night", "Do you have any trouble navigating the house at night", "navigating_at_night_details")}

          {/* Home Maintenance Worries */}
          {renderYesNoField("home_maintenance_worries", "Are there any aspects of maintaining your home that worry you?", "home_maintenance_worries_details")}

          {/* Last Home Safety Assessment */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("last_home_safety_assessment")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date Home Safety Assessment was last completed</label>
              {hoveredField === "last_home_safety_assessment" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("last_home_safety_assessment")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
             <DatePicker
                name="last_home_safety_assessment"
                value={formData.last_home_safety_assessment}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="last_home_safety_assessment"
              value={formData.last_home_safety_assessment || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Home Safety Focus Areas */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("home_safety_focus_areas")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Key areas of focus to be supported identified from Home</label>
              {hoveredField === "home_safety_focus_areas" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("home_safety_focus_areas")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="home_safety_focus_areas"
              placeholder="Describe home safety focus areas and concerns..."
              value={formData.home_safety_focus_areas || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_home_maintenance"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}