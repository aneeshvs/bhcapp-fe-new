'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import DatePicker from '../../DatePicker';

interface SupportPlanRepresentative {
  id?: number;
  support_representative_name?: string;
  role?: string;
  date_of_approval: string;
  // Include any other fields from MigrationHelper::defaultColumnFlags() if needed
}

interface SupportPlanRepresentativesProps {
  formData: SupportPlanRepresentative;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function SupportPlanRepresentatives({ 
  formData, 
  handleChange,
  uuid
}: SupportPlanRepresentativesProps) {
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
      {/* Card Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">SUPPORT PLAN REPRESENTATIVES</h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Support Representative Name */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('support_representative_name')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Support Representative Name</label>
              {hoveredField === 'support_representative_name' && (
                <button
                  type="button"
                  onClick={() => handleViewLogs('support_representative_name')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="support_representative_name"
              placeholder="Enter representative name"
              value={formData.support_representative_name || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Role */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('role')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Role</label>
              {hoveredField === 'role' && (
                <button
                  type="button"
                  onClick={() => handleViewLogs('role')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="role"
              placeholder="Enter role"
              value={formData.role || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Date of Approval */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('date_of_approval')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Date of Approval</label>
              {hoveredField === 'date_of_approval' && (
                <button
                  type="button"
                  onClick={() => handleViewLogs('date_of_approval')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="date_of_approval"
              value={formData.date_of_approval}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="date_of_approval"
              value={formData.date_of_approval || ''}
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
        table="support_plan_representative"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}