"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";

interface LocalServicesContactsFormData {
  council: string;
  hospital: string;
  electricity: string;
  water: string;
}

interface LocalServicesContactsProps {
  formData: LocalServicesContactsFormData;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function LocalServicesContactsForm({
  formData,
  handleChange,
  uuid,
}: LocalServicesContactsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Local Services Contacts Information
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Council */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("council")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Council</label>
              {hoveredField === "council" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("council")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="council"
              placeholder="Enter council contact details"
              value={formData.council || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Hospital */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("hospital")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Hospital</label>
              {hoveredField === "hospital" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("hospital")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="hospital"
              placeholder="Enter hospital contact details"
              value={formData.hospital || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Electricity */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("electricity")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Electricity Provider</label>
              {hoveredField === "electricity" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("electricity")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="electricity"
              placeholder="Enter electricity provider details"
              value={formData.electricity || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Water */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("water")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Water Provider</label>
              {hoveredField === "water" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("water")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="water"
              placeholder="Enter water provider details"
              value={formData.water || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_care_plan_local_services_contacts"
        field={selectedField}
        url="support-care-plan/logs"
      />
    </div>
  );
}