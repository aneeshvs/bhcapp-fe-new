"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import { SupportPlanFundings } from "@/src/components/SupportPlan/types";
import DatePicker from "../../DatePicker";

interface FundingsProps {
  formData: SupportPlanFundings;
  handleChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function FundingsForm({ formData, handleChange,uuid }: FundingsProps) {
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
          Funding Details
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Aged Care ID */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("aged_care_id")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Aged Care ID</label>
              {hoveredField === "aged_care_id" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("aged_care_id")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="aged_care_id"
              placeholder="Enter aged care ID"
              value={formData.aged_care_id || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Pension Status */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("pension_status")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Pension Status</label>
              {hoveredField === "pension_status" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("pension_status")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="pension_status"
              placeholder="Enter pension status"
              value={formData.pension_status || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Pension Card Details */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("pension_card_details")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Pension Card Details</label>
              {hoveredField === "pension_card_details" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("pension_card_details")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="pension_card_details"
              placeholder="Enter card details"
              value={formData.pension_card_details || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Card Number */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("card_number")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Card Number</label>
              {hoveredField === "card_number" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("card_number")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="card_number"
              placeholder="Enter card number"
              value={formData.card_number || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Card Expiry */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("card_expiry")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Card Expiry</label>
              {hoveredField === "card_expiry" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("card_expiry")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="card_expiry"
              value={formData.card_expiry}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="card_expiry"
              value={formData.card_expiry || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Approved Funding Level */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("approved_funding_level")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Approved Funding Level</label>
              {hoveredField === "approved_funding_level" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("approved_funding_level")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="approved_funding_level"
              placeholder="Enter funding level"
              value={formData.approved_funding_level || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Awaiting Package Upgrade */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("awaiting_package_upgrade")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Are you awaiting a package upgrade?</label>
              {hoveredField === "awaiting_package_upgrade" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("awaiting_package_upgrade")}
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
                    name="awaiting_package_upgrade"
                    value={value}
                    checked={formData.awaiting_package_upgrade === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Upgrade Details */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("upgrade_details")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Details</label>
              {hoveredField === "upgrade_details" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("upgrade_details")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="upgrade_details"
              placeholder="Enter upgrade details"
              value={formData.upgrade_details || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Has CHSP Referral Codes */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("has_chsp_referral_codes")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you have access to CHSP Referral Codes?</label>
              {hoveredField === "has_chsp_referral_codes" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("has_chsp_referral_codes")}
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
                    name="has_chsp_referral_codes"
                    value={value}
                    checked={formData.has_chsp_referral_codes === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* CHSP Referral Details */}
          <div
            className="relative md:col-span-2"
            onMouseEnter={() => setHoveredField("chsp_referral_details")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">CHSP Referral Details</label>
              {hoveredField === "chsp_referral_details" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("chsp_referral_details")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="chsp_referral_details"
              placeholder="Enter CHSP referral details"
              value={formData.chsp_referral_details || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* War Veteran or Widow */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("war_veteran_or_widow")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Are you a water veteran or a war widow?</label>
              {hoveredField === "war_veteran_or_widow" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("war_veteran_or_widow")}
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
                    name="war_veteran_or_widow"
                    value={value}
                    checked={formData.war_veteran_or_widow === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* DVA Number */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("dva_number")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">DVA #</label>
              {hoveredField === "dva_number" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("dva_number")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="dva_number"
              placeholder="Enter DVA number"
              value={formData.dva_number || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Medicare Number */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("medicare_number")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Medicare #</label>
              {hoveredField === "medicare_number" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("medicare_number")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="medicare_number"
              placeholder="Enter Medicare number"
              value={formData.medicare_number || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Private Health Insurance */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("private_health_insurance")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Private Health Insurance</label>
              {hoveredField === "private_health_insurance" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("private_health_insurance")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="private_health_insurance"
              placeholder="Enter insurance details"
              value={formData.private_health_insurance || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* HCP Funding Level */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("hcp_funding_level")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">HCP Funding Level</label>
              {hoveredField === "hcp_funding_level" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("hcp_funding_level")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="hcp_funding_level"
              placeholder="Enter HCP funding level"
              value={formData.hcp_funding_level || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Has Companion Card */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("has_companion_card")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Do you have a companion card</label>
              {hoveredField === "has_companion_card" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("has_companion_card")}
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
                    name="has_companion_card"
                    value={value}
                    checked={formData.has_companion_card === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_funding"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}