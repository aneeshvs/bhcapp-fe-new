// TelecommunicationOutagesForm.tsx
"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanTelecommunicationOutages } from "@/src/components/SupportPlan/types";

interface TelecommunicationOutagesProps {
  formData: SupportPlanTelecommunicationOutages;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function TelecommunicationOutagesForm({
  formData,
  handleChange,
  uuid,
}: TelecommunicationOutagesProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.independent_leave_home === 0 && formData.independent_leave_home_details) {
      handleChange({
        target: {
          name: 'independent_leave_home_details',
          value: ''
        }
      });
    }
  }, [formData.independent_leave_home, formData.independent_leave_home_details, handleChange]);

  // Clear has support checkin details when has_support_checkin is set to "No"
  useEffect(() => {
    if (formData.has_support_checkin === 0 && formData.has_support_checkin_details) {
      handleChange({
        target: {
          name: 'has_support_checkin_details',
          value: ''
        }
      });
    }
  }, [formData.has_support_checkin, formData.has_support_checkin_details, handleChange]);

  // Clear welfare check required details when welfare_check_required is set to "No"
  useEffect(() => {
    if (formData.welfare_check_required === 0 && formData.welfare_check_required_details) {
      handleChange({
        target: {
          name: 'welfare_check_required_details',
          value: ''
        }
      });
    }
  }, [formData.welfare_check_required, formData.welfare_check_required_details, handleChange]);

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
                checked={formData[fieldName as keyof SupportPlanTelecommunicationOutages] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanTelecommunicationOutages] === 1 && (
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
            value={formData[detailsField as keyof SupportPlanTelecommunicationOutages] || ""}
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
          Telecommunication Outages Readiness
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Independent Leave Home */}
          {renderYesNoField("independent_leave_home", "Are you able to independently leave your home during a telecommunication outage?", "independent_leave_home_details")}

          {/* Has Support Check-in */}
          {renderYesNoField("has_support_checkin", "Do you have a support such as family or neighbour who will check in on you during a telecommunication outage??", "has_support_checkin_details")}

          {/* Welfare Check Required */}
          {renderYesNoField("welfare_check_required", "Do you require us to complete a welfare check during a telecommunication outage >5 hours?", "welfare_check_required_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_telecommunication_outage"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}