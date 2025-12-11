"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SecondaryContactDetails } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";

interface ContactDetailsSecondaryProps {
  formData: SecondaryContactDetails;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function ContactDetailsSecondaryForm({
  formData,
  handleChange,
  uuid,
}: ContactDetailsSecondaryProps) {
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
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Secondary Contact Details
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Role */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_role")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Role</label>
              {hoveredField === "secondary_role" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_role")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="secondary_role"
              placeholder="Enter role"
              value={formData.secondary_role || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Phone */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_phone")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Phone</label>
              {hoveredField === "secondary_phone" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_phone")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="tel"
              name="secondary_phone"
              placeholder="Enter phone number"
              value={formData.secondary_phone || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Email */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_email")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Email</label>
              {hoveredField === "secondary_email" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_email")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="email"
              name="secondary_email"
              placeholder="Enter email address"
              value={formData.secondary_email || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>


          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_address")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Address</label>
              {hoveredField === "secondary_address" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_address")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="secondary_address"
              placeholder="Enter your address"
              value={formData.secondary_address || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Best Time to Contact */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_best_time_to_contact")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Best Time to Contact</label>
              {hoveredField === "secondary_best_time_to_contact" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_best_time_to_contact")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="secondary_best_time_to_contact"
              placeholder="Enter best contact time"
              value={formData.secondary_best_time_to_contact || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* MAC Registered */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_is_mac_registered")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Is this role registered with MAC as a Support Representative?</label>
              {hoveredField === "secondary_is_mac_registered" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_is_mac_registered")}
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
                    name="secondary_is_mac_registered"
                    value={value}
                    checked={formData.secondary_is_mac_registered === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Legal Documentation Stored */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_legal_documentation_stored")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Confirmation legal documentation is stored in profile</label>
              {hoveredField === "secondary_legal_documentation_stored" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_legal_documentation_stored")}
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
                    name="secondary_legal_documentation_stored"
                    value={value}
                    checked={formData.secondary_legal_documentation_stored === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Date Legal Orders End */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_date_legal_orders_end")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date Legal Orders End</label>
              {hoveredField === "secondary_date_legal_orders_end" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_date_legal_orders_end")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="secondary_date_legal_orders_end"
              value={formData.secondary_date_legal_orders_end}
              onChange={handleChange}
            />
            
            {/* <input
              type="date"
              name="secondary_date_legal_orders_end"
              value={formData.secondary_date_legal_orders_end || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Participants Agreed Contact */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_participants_agreed_contact")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Participants have agreed BHC will contact in these situations</label>
              {hoveredField === "secondary_participants_agreed_contact" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_participants_agreed_contact")}
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
                    name="secondary_participants_agreed_contact"
                    value={value}
                    checked={formData.secondary_participants_agreed_contact === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Participants Agreed Contact Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("secondary_participants_agreed_contact_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date</label>
              {hoveredField === "secondary_participants_agreed_contact_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_participants_agreed_contact_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="secondary_participants_agreed_contact_date"
              value={formData.secondary_participants_agreed_contact_date}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="secondary_participants_agreed_contact_date"
              value={formData.secondary_participants_agreed_contact_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Decision Making Approval For */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("secondary_decision_making_approval_for")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium"> Decision making approval for:</label>
              {hoveredField === "secondary_decision_making_approval_for" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_decision_making_approval_for")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="secondary_decision_making_approval_for"
              placeholder="Enter details"
              value={formData.secondary_decision_making_approval_for || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* List Documents */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("secondary_list_documents")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">List of Documents</label>
              {hoveredField === "secondary_list_documents" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("secondary_list_documents")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="secondary_list_documents"
              placeholder="List documents here"
              value={formData.secondary_list_documents || ""}
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
        table="support_plan_contact_details_secondary"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}