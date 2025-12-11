"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanHearings } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";


interface HearingsProps {
  formData: SupportPlanHearings;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function HearingsForm({
  formData,
  handleChange,
  uuid,
}: HearingsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.wears_hearing_devices === 0) {
      if (formData.hearing_devices_details) {
        handleChange({
          target: {
            name: 'hearing_devices_details',
            value: ''
          }
        });
      }
      if (formData.when_worn) {
        handleChange({
          target: {
            name: 'when_worn',
            value: ''
          }
        });
      }
    }
  }, [formData.wears_hearing_devices, formData.hearing_devices_details, formData.when_worn, handleChange]);

  // Clear hearing worry details when hearing_worry is set to "No"
  useEffect(() => {
    if (formData.hearing_worry === 0 && formData.hearing_worry_details) {
      handleChange({
        target: {
          name: 'hearing_worry_details',
          value: ''
        }
      });
    }
  }, [formData.hearing_worry, formData.hearing_worry_details, handleChange]);

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
          Hearing Assessment
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wears Hearing Devices */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("wears_hearing_devices")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you wear hearing devices?</label>
              {hoveredField === "wears_hearing_devices" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("wears_hearing_devices")}
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
                    name="wears_hearing_devices"
                    value={value}
                    checked={formData.wears_hearing_devices === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Hearing Devices Details */}
          {formData.wears_hearing_devices === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("hearing_devices_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Details</label>
                {hoveredField === "hearing_devices_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("hearing_devices_details")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="hearing_devices_details"
                placeholder="Enter Details ..."
                value={formData.hearing_devices_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          )}

          {/* When Worn */}
          {formData.wears_hearing_devices === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("when_worn")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">When do you wear them?</label>
                {hoveredField === "when_worn" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("when_worn")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                name="when_worn"
                placeholder="Enter when hearing devices are worn"
                value={formData.when_worn || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
              </input>
            </div>
          )}

          {/* Last Audiologist Appointment */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("last_audiologist_appointment")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Last Audiologist appointment</label>
              {hoveredField === "last_audiologist_appointment" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("last_audiologist_appointment")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
             <DatePicker
                name="last_audiologist_appointment"
                value={formData.last_audiologist_appointment || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="last_audiologist_appointment"
              value={formData.last_audiologist_appointment || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Hearing Worry */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("hearing_worry")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do any aspects of your hearing worry you?</label>
              {hoveredField === "hearing_worry" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("hearing_worry")}
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
                    name="hearing_worry"
                    value={value}
                    checked={formData.hearing_worry === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Hearing Worry Details */}
          {formData.hearing_worry === 1 && (
            <div
              className="relative md:col-span-2"
              onMouseEnter={() => setHoveredField("hearing_worry_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Details</label>
                {hoveredField === "hearing_worry_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("hearing_worry_details")}
                    className="text-xs btn-primary text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <textarea
                name="hearing_worry_details"
                placeholder="Enter Details ..."
                value={formData.hearing_worry_details || ""}
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
        table="support_plan_hearing"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}