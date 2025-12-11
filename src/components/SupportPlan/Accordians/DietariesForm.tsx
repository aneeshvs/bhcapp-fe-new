"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanDietaries } from "@/src/components/SupportPlan/types";

interface DietariesProps {
  formData: SupportPlanDietaries;
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
}: DietariesProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.intolerances === 0 && formData.intolerances_details) {
      handleChange({
        target: {
          name: 'intolerances_details',
          value: ''
        }
      });
    }
  }, [formData.intolerances, formData.intolerances_details, handleChange]);

  // Clear dysphagia details when dysphagia_concerns is set to "No"
  useEffect(() => {
    if (formData.dysphagia_concerns === 0 && formData.dysphagia_details) {
      handleChange({
        target: {
          name: 'dysphagia_details',
          value: ''
        }
      });
    }
  }, [formData.dysphagia_concerns, formData.dysphagia_details, handleChange]);

  // Clear prepares meals details when prepares_meals is set to "No"
  useEffect(() => {
    if (formData.prepares_meals === 0 && formData.prepares_meals_details) {
      handleChange({
        target: {
          name: 'prepares_meals_details',
          value: ''
        }
      });
    }
  }, [formData.prepares_meals, formData.prepares_meals_details, handleChange]);

  // Clear meal support details when needs_meal_support is set to "No"
  useEffect(() => {
    if (formData.needs_meal_support === 0 && formData.meal_support_details) {
      handleChange({
        target: {
          name: 'meal_support_details',
          value: ''
        }
      });
    }
  }, [formData.needs_meal_support, formData.meal_support_details, handleChange]);

  // Clear diet meets needs details when diet_meets_needs is set to "No"
  useEffect(() => {
    if (formData.diet_meets_needs === 0 && formData.diet_meets_needs_details) {
      handleChange({
        target: {
          name: 'diet_meets_needs_details',
          value: ''
        }
      });
    }
  }, [formData.diet_meets_needs, formData.diet_meets_needs_details, handleChange]);

  // Clear cutting support details when needs_cutting_support is set to "No"
  useEffect(() => {
    if (formData.needs_cutting_support === 0 && formData.cutting_support_details) {
      handleChange({
        target: {
          name: 'cutting_support_details',
          value: ''
        }
      });
    }
  }, [formData.needs_cutting_support, formData.cutting_support_details, handleChange]);

  // Clear feeding support details when needs_feeding_support is set to "No"
  useEffect(() => {
    if (formData.needs_feeding_support === 0 && formData.feeding_support_details) {
      handleChange({
        target: {
          name: 'feeding_support_details',
          value: ''
        }
      });
    }
  }, [formData.needs_feeding_support, formData.feeding_support_details, handleChange]);

  // Clear dietician referral details when dietician_referral_required is set to "No"
  useEffect(() => {
    if (formData.dietician_referral_required === 0 && formData.dietician_referral_details) {
      handleChange({
        target: {
          name: 'dietician_referral_details',
          value: ''
        }
      });
    }
  }, [formData.dietician_referral_required, formData.dietician_referral_details, handleChange]);

  // Clear shopping support details when needs_shopping_support is set to "No"
  useEffect(() => {
    if (formData.needs_shopping_support === 0 && formData.shopping_support_details) {
      handleChange({
        target: {
          name: 'shopping_support_details',
          value: ''
        }
      });
    }
  }, [formData.needs_shopping_support, formData.shopping_support_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanDietaries] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanDietaries] === 1 && (
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
            placeholder={"List details..."}
            value={formData[detailsField as keyof SupportPlanDietaries] || ""}
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
          Dietary Assessment
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Intolerances */}
          {renderYesNoField("intolerances", "Intolerances", "intolerances_details")}

          {/* Dysphagia Concerns */}
          {renderYesNoField("dysphagia_concerns", "Are there dysphasia concerns?", "dysphagia_details")}

          {/* Speech Pathologist Recommendations */}
          {renderYesNoField("speech_pathologist_recommendations", "Has a speech pathologist provided recommendations")}

          {/* IDDSI Food Category */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("iddsi_food_category")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">IDDSI Food categories</label>
              {hoveredField === "iddsi_food_category" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("iddsi_food_category")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="iddsi_food_category"
              placeholder="Enter IDDSI food category"
              value={formData.iddsi_food_category || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* IDDSI Liquid Category */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("iddsi_liquid_category")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">IDDSI Liquid categories</label>
              {hoveredField === "iddsi_liquid_category" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("iddsi_liquid_category")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="iddsi_liquid_category"
              placeholder="Enter IDDSI liquid category"
              value={formData.iddsi_liquid_category || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Prepares Meals */}
          {renderYesNoField("prepares_meals", "Do you prepare all your meals?", "prepares_meals_details")}

          {/* Needs Meal Support */}
          {renderYesNoField("needs_meal_support", "Do you need support with meal preparation or meal delivery?", "meal_support_details")}

          {/* Diet Meets Needs */}
          {renderYesNoField("diet_meets_needs", "Do you feel your current diet is meeting your needs?", "diet_meets_needs_details")}

          {/* Needs Cutting Support */}
          {renderYesNoField("needs_cutting_support", "Do you need support with cutting up meals?", "cutting_support_details")}

          {/* Needs Feeding Support */}
          {renderYesNoField("needs_feeding_support", "Do you require support with feeding?", "feeding_support_details")}

          {/* Dietician Referral Required */}
          {renderYesNoField("dietician_referral_required", "Do you want a referral to a Dietician?", "dietician_referral_details")}

          {/* Needs Shopping Support */}
          {renderYesNoField("needs_shopping_support", "Do you need support in completing food shopping/unpacking?", "shopping_support_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_dietary"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}