'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import { EmployeeMatchingNeeds } from '@/src/components/SupportPlan/types';

interface EmployeeMatchingNeedsProps {
  formData: EmployeeMatchingNeeds;
  handleChange: (
    event: React.ChangeEvent<HTMLTextAreaElement> | 
    { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function EmployeeMatchingNeedsForm({
  formData,
  handleChange,
  uuid,
}: EmployeeMatchingNeedsProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Card Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">
          Employee Matching Needs
        </h4>
      </div>

      {/* Form Body */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 gap-6">
          {/* Cultural Considerations */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("cultural_considerations")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Cultural Considerations</label>
              {hoveredField === "cultural_considerations" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("cultural_considerations")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="cultural_considerations"
              placeholder="Enter any cultural considerations for employee matching..."
              value={formData.cultural_considerations || ""}
              onChange={handleTextAreaChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
            />
          </div>

          {/* Specific Training Required */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("specific_training_required")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Specific Training Required</label>
              {hoveredField === "specific_training_required" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("specific_training_required")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="specific_training_required"
              placeholder="Enter any specific training requirements for employees..."
              value={formData.specific_training_required || ""}
              onChange={handleTextAreaChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
            />
          </div>

          {/* Common Interests */}
          <div
            className="relative"
            onMouseEnter={() => setHoveredField("common_interests")}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Common Interests</label>
              {hoveredField === "common_interests" && (
                <button
                  type="button"
                  onClick={() => handleViewLogs("common_interests")}
                  className="text-xs btn-primary text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="common_interests"
              placeholder="Enter common interests that would help with employee matching..."
              value={formData.common_interests || ""}
              onChange={handleTextAreaChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ''}
        table="employee_matching_need"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}