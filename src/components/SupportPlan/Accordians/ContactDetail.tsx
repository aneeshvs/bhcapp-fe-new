"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportContactDetails } from "@/src/components/SupportPlan/types";

interface ContactDetailsProps {
  formData: SupportContactDetails;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function ContactDetailsForm({
  formData,
  handleChange,
  uuid,
}: ContactDetailsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

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
      {/* Card Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Contact Details
        </h4>
      </div>

      {/* Form Body */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("phone")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Phone</label>
              {hoveredField === "phone" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("phone")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Email */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("email")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Email</label>
              {hoveredField === "email" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("email")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Address */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("address")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Address</label>
              {hoveredField === "address" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("address")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="address"
              placeholder="Enter physical address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Is Rural Area */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("is_rural_area")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Are you living in a rural or remote area</label>
              {hoveredField === "is_rural_area" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("is_rural_area")}
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
                    name="is_rural_area"
                    value={value}
                    checked={formData.is_rural_area === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Mailing Address */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("mailing_address")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                Mailing Address
              </label>
              {hoveredField === "mailing_address" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("mailing_address")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="mailing_address"
              placeholder="Enter mailing address"
              value={formData.mailing_address || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_contact_detail"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}