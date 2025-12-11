"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanSkinConditions } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";

interface SkinConditionsProps {
  formData: SupportPlanSkinConditions;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function SkinConditionsForm({
  formData,
  handleChange,
  uuid,
}: SkinConditionsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.has_skin_condition === 0) {
      const fieldsToClear = [
        'skin_condition_type',
        'impacts_daily_activities',
        'impact_date',
        'pain_discomfort_level',
        'pain_level_score',
        'management_strategies'
      ];
      
      fieldsToClear.forEach(fieldName => {
        if (formData[fieldName as keyof SupportPlanSkinConditions]) {
          handleChange({
            target: {
              name: fieldName,
              value: fieldName === 'impacts_daily_activities' ? 0 : ''
            }
          });
        }
      });
    }
  }, [formData.has_skin_condition, formData.skin_condition_type, formData.impacts_daily_activities, formData.impact_date, formData.pain_discomfort_level, formData.pain_level_score, formData.management_strategies, handleChange]);

  // Clear impact date when impacts_daily_activities is set to "No"
  useEffect(() => {
    if (formData.impacts_daily_activities === 0 && formData.impact_date) {
      handleChange({
        target: {
          name: 'impact_date',
          value: ''
        }
      });
    }
  }, [formData.impacts_daily_activities, formData.impact_date, handleChange]);

  // Clear worry date when skin_condition_worry is set to "No"
  useEffect(() => {
    if (formData.skin_condition_worry === 0 && formData.worry_date) {
      handleChange({
        target: {
          name: 'worry_date',
          value: ''
        }
      });
    }
  }, [formData.skin_condition_worry, formData.worry_date, handleChange]);

  // Clear referral nursing date when referral_nursing_required is set to "No"
  useEffect(() => {
    if (formData.referral_nursing_required === 0 && formData.referral_nursing_date) {
      handleChange({
        target: {
          name: 'referral_nursing_date',
          value: ''
        }
      });
    }
  }, [formData.referral_nursing_required, formData.referral_nursing_date, handleChange]);

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
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Skin Conditions Assessment
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Has Skin Condition */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("has_skin_condition")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you have any skin conditions?</label>
              {hoveredField === "has_skin_condition" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("has_skin_condition")}
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
                    name="has_skin_condition"
                    value={value}
                    checked={formData.has_skin_condition === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Skin Condition Type */}
          {formData.has_skin_condition === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("skin_condition_type")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Skin Condition Type</label>
                {hoveredField === "skin_condition_type" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("skin_condition_type")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                name="skin_condition_type"
                placeholder="Enter skin condition type"
                value={formData.skin_condition_type || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
              </input>
            </div>
          )}

          {/* Impacts Daily Activities */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("impacts_daily_activities")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Does your skin condition impact your day-to-day activities?</label>
                {hoveredField === "impacts_daily_activities" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("impacts_daily_activities")}
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
                      name="impacts_daily_activities"
                      value={value}
                      checked={formData.impacts_daily_activities === value}
                      onChange={handleRadioNumberChange}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

          {/* Impact Date */}
          {formData.impacts_daily_activities === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("impact_date")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Date</label>
                {hoveredField === "impact_date" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("impact_date")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
               <DatePicker
                name="impact_date"
                value={formData.impact_date}
                onChange={handleChange}
              />
              {/* <input
                type="date"
                name="impact_date"
                value={formData.impact_date || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              /> */}
            </div>
          )}

          {/* Pain/Discomfort Level */}
          {formData.has_skin_condition === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("pain_discomfort_level")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">What is the level of pain/discomfort</label>
                {hoveredField === "pain_discomfort_level" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("pain_discomfort_level")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                name="pain_discomfort_level"
                placeholder="Enter pain or discomfort level"
                value={formData.pain_discomfort_level || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
              </input>
            </div>
          )}

          {/* Pain Level Score */}
          {formData.has_skin_condition === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("pain_level_score")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Significant Impact:</label>
                {hoveredField === "pain_level_score" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("pain_level_score")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                name="pain_level_score"
                type="number"
                placeholder="Enter pain level score"
                value={formData.pain_level_score || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
              </input>
            </div>
          )}

          {/* Management Strategies */}
          {formData.has_skin_condition === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("management_strategies")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Strategies to manage the skin condition</label>
                {hoveredField === "management_strategies" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("management_strategies")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="management_strategies"
                placeholder="Describe current management strategies and treatments..."
                value={formData.management_strategies || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          )}

          {/* Skin Condition Worry */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("skin_condition_worry")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Does your skin condition worry you?</label>
              {hoveredField === "skin_condition_worry" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("skin_condition_worry")}
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
                    name="skin_condition_worry"
                    value={value}
                    checked={formData.skin_condition_worry === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Worry Date */}
          {formData.skin_condition_worry === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("worry_date")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Date</label>
                {hoveredField === "worry_date" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("worry_date")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
               <DatePicker
                name="worry_date"
                value={formData.worry_date}
                onChange={handleChange}
              />
              {/* <input
                type="date"
                name="worry_date"
                value={formData.worry_date || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              /> */}
            </div>
          )}

          {/* Referral Nursing Required */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("referral_nursing_required")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Is a referral to Nursing required?</label>
              {hoveredField === "referral_nursing_required" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("referral_nursing_required")}
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
                    name="referral_nursing_required"
                    value={value}
                    checked={formData.referral_nursing_required === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Referral Nursing Date */}
          {formData.referral_nursing_required === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("referral_nursing_date")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Date</label>
                {hoveredField === "referral_nursing_date" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("referral_nursing_date")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
               <DatePicker
                name="referral_nursing_date"
                value={formData.referral_nursing_date}
                onChange={handleChange}
              />
              {/* <input
                type="date"
                name="referral_nursing_date"
                value={formData.referral_nursing_date || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              /> */}
            </div>
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_skin_condition"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}