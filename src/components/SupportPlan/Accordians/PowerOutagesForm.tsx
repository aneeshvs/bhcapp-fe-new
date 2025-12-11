// PowerOutagesForm.tsx
"use client";
import React, { useState,useEffect  } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanPowerOutages } from "@/src/components/SupportPlan/types";

interface PowerOutagesProps {
  formData: SupportPlanPowerOutages;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function PowerOutagesForm({
  formData,
  handleChange,
  uuid,
}: PowerOutagesProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    if (formData.has_backup_power === 0 && formData.backup_power_details) {
      handleChange({
        target: {
          name: 'backup_power_details',
          value: ''
        }
      });
    }
  }, [formData.has_backup_power, formData.backup_power_details, handleChange]);

  // Clear life support related fields when registered_life_support is set to "No"
  useEffect(() => {
    if (formData.registered_life_support === 0) {
      if (formData.life_support_hours_supply) {
        handleChange({
          target: {
            name: 'life_support_hours_supply',
            value: ''
          }
        });
      }
      if (formData.life_support_provider) {
        handleChange({
          target: {
            name: 'life_support_provider',
            value: ''
          }
        });
      }
    }
  }, [formData.registered_life_support, formData.life_support_hours_supply, formData.life_support_provider, handleChange]);

  // Clear power independent leave home details when power_independent_leave_home is set to "No"
  useEffect(() => {
    if (formData.power_independent_leave_home === 0 && formData.power_independent_leave_home_details) {
      handleChange({
        target: {
          name: 'power_independent_leave_home_details',
          value: ''
        }
      });
    }
  }, [formData.power_independent_leave_home, formData.power_independent_leave_home_details, handleChange]);

  // Clear power has support checkin details when power_has_support_checkin is set to "No"
  useEffect(() => {
    if (formData.power_has_support_checkin === 0 && formData.power_has_support_checkin_details) {
      handleChange({
        target: {
          name: 'power_has_support_checkin_details',
          value: ''
        }
      });
    }
  }, [formData.power_has_support_checkin, formData.power_has_support_checkin_details, handleChange]);

  // Clear power welfare check required details when power_welfare_check_required is set to "No"
  useEffect(() => {
    if (formData.power_welfare_check_required === 0 && formData.power_welfare_check_required_details) {
      handleChange({
        target: {
          name: 'power_welfare_check_required_details',
          value: ''
        }
      });
    }
  }, [formData.power_welfare_check_required, formData.power_welfare_check_required_details, handleChange]);

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

  const renderYesNoField = (fieldName: string, label: string, detailsField?: string, additionalFields?: React.ReactNode) => (
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
                checked={formData[fieldName as keyof SupportPlanPowerOutages] === value}
                onChange={handleRadioNumberChange}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {detailsField && formData[fieldName as keyof SupportPlanPowerOutages] === 1 && (
        <div
          className="relative md:col-span-2"
          onMouseEnter={() => setHoveredField(detailsField)}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">{label} Details</label>
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
            placeholder={`Provide details about ${label.toLowerCase()}...`}
            value={formData[detailsField as keyof SupportPlanPowerOutages] || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>
      )}

      {additionalFields && formData[fieldName as keyof SupportPlanPowerOutages] === 1 && (
        <div className="md:col-span-2">
          {additionalFields}
        </div>
      )}
    </>
  );

  const renderTextField = (fieldName: string, label: string, placeholder: string, type: string = "text") => (
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
      <input
        type={type}
        name={fieldName}
        placeholder={placeholder}
        value={formData[fieldName as keyof SupportPlanPowerOutages] || ""}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Power Outages Readiness
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Has Medical Equipment */}
          {renderYesNoField("has_medical_equipment", "Do you have medical equipment that is reliant on power?")}

          {/* Has Backup Power */}
          {renderYesNoField("has_backup_power", "Do you have a backup qpower supply such as a generator or battery?", "backup_power_details")}

          {/* Registered Life Support */}
          {renderYesNoField(
            "registered_life_support",
            "Are you registered with ‘Life Support equipment’ with your energy provider for priority reestablishment of power?",
            undefined,
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {renderTextField("life_support_hours_supply", "how many hours supply does it provide?", "Enter hours of supply available", "number")}
                {renderTextField("life_support_provider", "which provider?", "Enter provider name")}
              </div>
            </>
          )}

          {/* Can Leave Home Independently */}
          {renderYesNoField("power_independent_leave_home", "Are you able to independently leave your home during a power outage?", "power_independent_leave_home_details")}

          {/* Has Support Check-in */}
          {renderYesNoField("power_has_support_checkin", "Do you have support such as family or neighbour who will check in on you during a power outage?", "power_has_support_checkin_details")}

          {/* Welfare Check Required */}
          {renderYesNoField("power_welfare_check_required", "Do you require us to complete a welfare check during a power outage >5 hours?", "power_welfare_check_required_details")}
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_power_outage"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}