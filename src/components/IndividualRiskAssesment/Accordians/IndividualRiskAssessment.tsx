"use client";
import React, { useState } from "react";
import FieldLogsModal from "@/src/components/FieldLogsModal";
import DatePickerSaveMany from "../../DatePickerSaveMany";

interface RiskAssessmentFormData {
  client_name: string;
  site_address: string;
  assessment_date: string;
  planned_review_date: string;
}

interface RiskAssessmentProps {
  formData: RiskAssessmentFormData;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function RiskAssessmentForm({
  formData,
  handleChange,
  uuid,
}: RiskAssessmentProps) {
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
          INDIVIDUAL RISK ASSESSMENT
        </h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client Name */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("client_name")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Client Name</label>
              {hoveredField === "client_name" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("client_name")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="client_name"
              placeholder="Enter client name"
              value={formData.client_name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Site Address */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("site_address")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Site Address</label>
              {hoveredField === "site_address" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("site_address")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              rows={3}
              name="site_address"
              placeholder="Enter site address"
              value={formData.site_address || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Assessment Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("assessment_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Assessment Date</label>
              {hoveredField === "assessment_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("assessment_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="assessment_date"
                value={formData.assessment_date || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="assessment_date"
              value={formData.assessment_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Planned Review Date */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("planned_review_date")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Planned Review Date</label>
              {hoveredField === "planned_review_date" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("planned_review_date")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="planned_review_date"
                value={formData.planned_review_date || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="planned_review_date"
              value={formData.planned_review_date || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="individual_risk_assessment"
        field={selectedField}
        url="risk-assessment/logs"
      />
    </div>
  );
}
