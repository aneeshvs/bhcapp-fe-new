'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import { SupportPlan } from '@/src/components/SupportPlan/types';
import DatePicker from '../../DatePicker';
interface SupportPlanProps {
  formData: SupportPlan;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string;
}

export default function SupportPlanForm({ formData, handleChange,uuid }: SupportPlanProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    console.log('View logs clicked', fieldName);
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Card Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">SUPPORT PLAN</h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Effective Date */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('effective_date')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">This Support plan is effective from</label>
              {hoveredField === 'effective_date' && (
                <button
                  type="button"
                  onClick={() => handleViewLogs('effective_date')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="effective_date"
              value={formData.effective_date}
              onChange={handleChange}
            />
          </div>

          {/* Review Date */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('review_date')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">This Support plan will be reviewed no later than</label>
              {hoveredField === 'review_date' && (
                <button
                  type="button"
                  onClick={() => handleViewLogs('review_date')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="review_date"
              value={formData.review_date}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="review_date"
              value={formData.review_date || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Confirmation Date */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('confirmation_date')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Confirmation participant has received a copy of finalized Support Plan</label>
              {hoveredField === 'confirmation_date' && (
                <button
                  type="button"
                  onClick={() => handleViewLogs('confirmation_date')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePicker
              name="confirmation_date"
              value={formData.confirmation_date}
              onChange={handleChange}
            />
            {/* <input
              type="date"
              name="confirmation_date"
              value={formData.confirmation_date || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Developed By */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('developed_by')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Who was involved in the development of this Support Plan	</label>
              {hoveredField === 'developed_by' && (
                <button
                  type="button"
                  onClick={() => handleViewLogs('developed_by')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="developed_by"
              placeholder="Enter who developed the plan"
              value={formData.developed_by || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Invited But Not Participated */}
          <div 
            className="md:col-span-2 relative"
            onMouseEnter={() => setHoveredField('invited_but_not_participated')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Who was invited to participate in the development of this plan but declined/unable to participate</label>
              {hoveredField === 'invited_but_not_participated' && (
                <button
                  type="button"
                  onClick={() => handleViewLogs('invited_but_not_participated')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <textarea
              name="invited_but_not_participated"
              placeholder="List individuals who were invited but didn't participate"
              value={formData.invited_but_not_participated || ''}
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
        table="support_plan"
        field={selectedField}
        url="logs/view/support"
      />
    </div>
  );
}