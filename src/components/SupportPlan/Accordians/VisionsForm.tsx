"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanVisions } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";

interface VisionsProps {
  formData: SupportPlanVisions;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function VisionsForm({
  formData,
  handleChange,
  uuid,
}: VisionsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.wears_glasses_or_contacts === 0) {
      if (formData.glasses_or_contacts_type) {
        handleChange({
          target: {
            name: 'glasses_or_contacts_type',
            value: ''
          }
        });
      }
      if (formData.vision_when_worn) {
        handleChange({
          target: {
            name: 'vision_when_worn',
            value: ''
          }
        });
      }
    }
  }, [formData.wears_glasses_or_contacts, formData.glasses_or_contacts_type, formData.vision_when_worn, handleChange]);

  // Clear vision worry details when vision_worry is set to "No"
  useEffect(() => {
    if (formData.vision_worry === 0 && formData.vision_worry_details) {
      handleChange({
        target: {
          name: 'vision_worry_details',
          value: ''
        }
      });
    }
  }, [formData.vision_worry, formData.vision_worry_details, handleChange]);

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
          Vision Assessment
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wears Glasses or Contacts */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("wears_glasses_or_contacts")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you wear glasses or contact lenses?</label>
              {hoveredField === "wears_glasses_or_contacts" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("wears_glasses_or_contacts")}
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
                    name="wears_glasses_or_contacts"
                    value={value}
                    checked={formData.wears_glasses_or_contacts === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Glasses or Contacts Type */}
          {formData.wears_glasses_or_contacts === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("glasses_or_contacts_type")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Type</label>
                {hoveredField === "glasses_or_contacts_type" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("glasses_or_contacts_type")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                name="glasses_or_contacts_type"
                placeholder="Enter type of glasses or contacts"
                value={formData.glasses_or_contacts_type || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
              </input>
            </div>
          )}

          {/* When Worn */}
          {formData.wears_glasses_or_contacts === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("vision_when_worn")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">When do you wear them?</label>
                {hoveredField === "vision_when_worn" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("vision_when_worn")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                name="vision_when_worn"
                placeholder="Enter vision"
                value={formData.vision_when_worn || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
              </input>
            </div>
          )}

          {/* Last Optometrist Appointment */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("last_optometrist_appointment")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Last Optometrist appointment</label>
              {hoveredField === "last_optometrist_appointment" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("last_optometrist_appointment")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
             <DatePicker
                name="last_optometrist_appointment"
                value={formData.last_optometrist_appointment}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="last_optometrist_appointment"
              value={formData.last_optometrist_appointment || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Vision Worry */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("vision_worry")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do any aspects of your vision worry you?</label>
              {hoveredField === "vision_worry" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("vision_worry")}
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
                    name="vision_worry"
                    value={value}
                    checked={formData.vision_worry === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Vision Worry Details */}
          {formData.vision_worry === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("vision_worry_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Details</label>
                {hoveredField === "vision_worry_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("vision_worry_details")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="vision_worry_details"
                placeholder="Enter Details ..."
                value={formData.vision_worry_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          )}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_vision"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}