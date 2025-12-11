"use client";
import React, { useState, useEffect } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { NonResponsive } from "@/src/components/SupportPlan/types";

interface NonResposniveProps {
  formData: NonResponsive;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function NonResponsiveForm({
  formData,
  handleChange,
  uuid,
}: NonResposniveProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Clear telephone_details when telephone_home_or_mobile is set to "No"
  useEffect(() => {
    if (formData.telephone_home_or_mobile === 0 && formData.telephone_details) {
      handleChange({
        target: {
          name: "telephone_details",
          value: "",
        },
      });
    }
  }, [
    formData.telephone_home_or_mobile,
    formData.telephone_details,
    handleChange,
  ]);

  // Clear emergency_contact_details when contact_emergency_contact is set to "No"
  useEffect(() => {
    if (
      formData.contact_emergency_contact === 0 &&
      formData.emergency_contact_details
    ) {
      handleChange({
        target: {
          name: "emergency_contact_details",
          value: "",
        },
      });
    }
  }, [
    formData.contact_emergency_contact,
    formData.emergency_contact_details,
    handleChange,
  ]);

  // Clear spare_key_details when access_spare_key is set to "No"
  useEffect(() => {
    if (formData.access_spare_key === 0 && formData.spare_key_details) {
      handleChange({
        target: {
          name: "spare_key_details",
          value: "",
        },
      });
    }
  }, [formData.access_spare_key, formData.spare_key_details, handleChange]);

  // Clear other_persons_details when contact_other_persons is set to "No"
  useEffect(() => {
    if (
      formData.contact_other_persons === 0 &&
      formData.other_persons_details
    ) {
      handleChange({
        target: {
          name: "other_persons_details",
          value: "",
        },
      });
    }
  }, [
    formData.contact_other_persons,
    formData.other_persons_details,
    handleChange,
  ]);

  // Clear police_contact_details when contact_police_if_no_key is set to "No"
  useEffect(() => {
    if (
      formData.contact_police_if_no_key === 0 &&
      formData.police_contact_details
    ) {
      handleChange({
        target: {
          name: "police_contact_details",
          value: "",
        },
      });
    }
  }, [
    formData.contact_police_if_no_key,
    formData.police_contact_details,
    handleChange,
  ]);

  // Clear key_lock_code and key_lock_details when access_key_lock is set to "No"
  useEffect(() => {
    if (formData.access_key_lock === 0) {
      if (formData.key_lock_code) {
        handleChange({
          target: {
            name: "key_lock_code",
            value: "",
          },
        });
      }
      if (formData.key_lock_details) {
        handleChange({
          target: {
            name: "key_lock_details",
            value: "",
          },
        });
      }
    }
  }, [
    formData.access_key_lock,
    formData.key_lock_code,
    formData.key_lock_details,
    handleChange,
  ]);

  const handleViewLogs = (fieldName: string) => {
    console.log("View logs clicked", fieldName);
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
          Non-Response to a scheduled visit Plan
        </h4>
      </div>
      <div className="mt-8 mb-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500 md:col-span-2">
        <div className="text-gray-700 space-y-3 w-full">
          <p>
            We are required to ensure the safety and wellbeing of participants.
            If you are not home for a scheduled visit, the following plan will
            be followed:
          </p>
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("telephone_home_or_mobile")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">We will telephone your home and/or mobile number</label>
              {hoveredField === "telephone_home_or_mobile" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("telephone_home_or_mobile")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="telephone_home_or_mobile"
                    value={value}
                    checked={formData.telephone_home_or_mobile === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Show "Contact Details" block only if 'Yes' is selected */}
          {formData.telephone_home_or_mobile === 1 && (
            <div
              className="relative mt-4"
              onMouseEnter={() => setHoveredField("telephone_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Details</label>
                {hoveredField === "telephone_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("telephone_details")}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="telephone_details"
                placeholder="Contact Details"
                value={formData.telephone_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("contact_emergency_contact")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                Contact your listed emergency contact number
              </label>
              {hoveredField === "contact_emergency_contact" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("contact_emergency_contact")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="contact_emergency_contact"
                    value={value}
                    checked={formData.contact_emergency_contact === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Show "Emergency Contact Details" block only if 'Yes' is selected */}
          {formData.contact_emergency_contact === 1 && (
            <div
              className="relative mt-4"
              onMouseEnter={() => setHoveredField("emergency_contact_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Details
                </label>
                {hoveredField === "emergency_contact_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("emergency_contact_details")}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="emergency_contact_details"
                placeholder="Emergency Contact Details"
                value={formData.emergency_contact_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("access_spare_key")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Access to Spare Key</label>
              {hoveredField === "access_spare_key" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("access_spare_key")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="access_spare_key"
                    value={value}
                    checked={formData.access_spare_key === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {formData.access_spare_key === 1 && (
            <div
              className="relative mt-4"
              onMouseEnter={() => setHoveredField("spare_key_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Spare Key Details</label>
                {hoveredField === "spare_key_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("spare_key_details")}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="spare_key_details"
                placeholder="Spare Key Details"
                value={formData.spare_key_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("contact_other_persons")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">We will contact other persons you have identified</label>
              {hoveredField === "contact_other_persons" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("contact_other_persons")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="contact_other_persons"
                    value={value}
                    checked={formData.contact_other_persons === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {formData.contact_other_persons === 1 && (
            <div
              className="relative mt-4"
              onMouseEnter={() => setHoveredField("other_persons_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Details
                </label>
                {hoveredField === "other_persons_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("other_persons_details")}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="other_persons_details"
                placeholder="Other Persons Details"
                value={formData.other_persons_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
        </div>
        {/* Contact Police Fields (only shown if no spare key) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("contact_police_if_no_key")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                If there is no access to a spare key available – contact with Yes No local police will be made to gain entry to your home
              </label>
              {hoveredField === "contact_police_if_no_key" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("contact_police_if_no_key")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="contact_police_if_no_key"
                    value={value}
                    checked={formData.contact_police_if_no_key === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Police Contact Details - appears in the same row when screen is large enough */}
          {formData.contact_police_if_no_key === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("police_contact_details")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">
                  Details
                </label>
                {hoveredField === "police_contact_details" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("police_contact_details")}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="police_contact_details"
                placeholder="Police Contact Details"
                value={formData.police_contact_details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
        </div>
        {/* Key Lock Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("access_key_lock")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">We will access your key lock</label>
              {hoveredField === "access_key_lock" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("access_key_lock")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
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
                    name="access_key_lock"
                    value={value}
                    checked={formData.access_key_lock === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Key Lock Code - appears in the same row when screen is large enough */}
          {formData.access_key_lock === 1 && (
            <div
              className="relative"
              onMouseEnter={() => setHoveredField("key_lock_code")}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Key Lock Code</label>
                {hoveredField === "key_lock_code" && (
                  <button
                    type="button"
                    onClick={() => handleViewLogs("key_lock_code")}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="text"
                name="key_lock_code"
                placeholder="Key Lock Code"
                value={formData.key_lock_code || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}
        </div>

        {/* Key Lock Details (full width below) */}
        {formData.access_key_lock === 1 && (
          <div
            className="relative mt-4"
            onMouseEnter={() => setHoveredField("key_lock_details")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Key Lock Details</label>
              {hoveredField === "key_lock_details" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("key_lock_details")}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="key_lock_details"
              placeholder="Key Lock Details"
              value={formData.key_lock_details || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>
        )}
      </div>
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        table="non_response_visit_plan"
        field={selectedField}
        uuid={effectiveUuid ?? ""}
        url="logs/view/support"
      />
    </div>
  );
}
