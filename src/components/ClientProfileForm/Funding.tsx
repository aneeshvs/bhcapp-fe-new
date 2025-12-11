'use client';
import React, {useState} from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import DatePickerSaveMany from '../DatePickerSaveMany';

interface FundingProps {
  formData: {
    fundingType?: string;
    fundingContactPerson?: string;
    ndisPlanAttached?: number;
    ndisPlanStartDate?: string;
    ndisPlanEndDate?: string;
    planManagerName?: string;
    planManagerMobile?: string;
    planManagerEmail?: string;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function Funding({ formData, handleChange, uuid }: FundingProps) {
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
        <h4 className="text-lg font-semibold mb-4 text-heading">FUNDING</h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Funding Type */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('fundingType')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="md:col-span-2 mb-3">
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Type of Funding</label>
                {hoveredField === 'fundingType' && (
                  <button
                    type='button'
                    onClick={() => handleViewLogs('type_of_funding')}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                {['Self-Managed', 'NDIA', 'Plan Managed'].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="fundingType"
                      value={type}
                      checked={formData.fundingType === type}
                      onChange={handleChange}
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('fundingContactPerson')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Contact Person for Funding</label>
              {hoveredField === 'fundingContactPerson' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('funding_contact_person')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="fundingContactPerson"
              placeholder="Enter contact person's name"
              value={formData.fundingContactPerson || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* NDIS Plan Attached */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('ndisPlanAttached')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">NDIS Plan Attached</label>
              {hoveredField === 'ndisPlanAttached' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('ndis_plan_attached')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex gap-4">
              {[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }].map(({ label, value }) => (
                <label key={label} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="ndisPlanAttached"
                    value={value}
                    checked={formData.ndisPlanAttached === value}
                    onChange={(e) =>
                      handleChange({ target: { name: 'ndisPlanAttached', value: parseInt(e.target.value) } })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Plan Manager Name */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('planManagerName')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Plan Manager Name</label>
              {hoveredField === 'planManagerName' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('plan_manager_name')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="planManagerName"
              placeholder="Enter plan manager's name"
              value={formData.planManagerName || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Plan Start Date */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('ndisPlanStartDate')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">NDIS Plan Start Date</label>
              {hoveredField === 'ndisPlanStartDate' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('ndis_plan_start_date')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="ndisPlanStartDate"
                value={formData.ndisPlanStartDate || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="ndisPlanStartDate"
              value={formData.ndisPlanStartDate || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Plan End Date */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('ndisPlanEndDate')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">NDIS Plan End Date</label>
              {hoveredField === 'ndisPlanEndDate' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('ndis_plan_end_date')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="ndisPlanEndDate"
                value={formData.ndisPlanEndDate || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="ndisPlanEndDate"
              value={formData.ndisPlanEndDate || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Plan Manager Contact (Mobile + Email) */}
          <div className="space-y-2">
            {/* Mobile */}
            <div 
              className="relative"
              onMouseEnter={() => setHoveredField('planManagerMobile')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Plan Manager Mobile</label>
                {hoveredField === 'planManagerMobile' && (
                  <button
                    type='button'
                    onClick={() => handleViewLogs('plan_manager_phone')}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="tel"
                placeholder="Mobile"
                name="planManagerMobile"
                value={formData.planManagerMobile || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            {/* Email */}
            <div 
              className="relative"
              onMouseEnter={() => setHoveredField('planManagerEmail')}
              onMouseLeave={() => setHoveredField(null)}
            >
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Plan Manager Email</label>
                {hoveredField === 'planManagerEmail' && (
                  <button
                    type='button'
                    onClick={() => handleViewLogs('plan_manager_email')}
                    className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                  >
                    View Logs
                  </button>
                )}
              </div>
              <input
                type="email"
                placeholder="Email"
                name="planManagerEmail"
                value={formData.planManagerEmail || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="funding_detail"
        field={selectedField}
        url="logs/view"
      />
    </div>
  );
}