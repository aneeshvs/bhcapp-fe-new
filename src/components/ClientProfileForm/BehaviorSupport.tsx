'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface BehaviourProps {
  formData: {
    has_support_plan?: number;
    plan_copy_received?: number;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function Behaviour({ formData, handleChange, uuid }: BehaviourProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({ target: { name, value: value === 'Yes' ? 1 : 0 } });
  };

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 rounded bg-white shadow">
      <div className="bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">Behavior Support</h4>
      </div>

      <div className="p-4 bg-white">
        {/* Support Plan Question */}
        <div 
          className="mb-4 relative"
          onMouseEnter={() => setHoveredField('has_support_plan')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Do you have a current support plan?</label>
            {hoveredField === 'has_support_plan' && (
              <button
                type='button'
                onClick={() => handleViewLogs('has_support_plan')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="has_support_plan"
                value="Yes"
                checked={formData.has_support_plan === 1}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="has_support_plan"
                value="No"
                checked={formData.has_support_plan === 0}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Copy Received Question */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('plan_copy_received')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Copy of behaviour support plan received?</label>
            {hoveredField === 'plan_copy_received' && (
              <button
                type='button'
                onClick={() => handleViewLogs('plan_copy_received')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="plan_copy_received"
                value="Yes"
                checked={formData.plan_copy_received === 1}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="plan_copy_received"
                value="No"
                checked={formData.plan_copy_received === 0}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="behaviour_support"
        field={selectedField}
        url="logs/view"
      />
    </div>
  );
}