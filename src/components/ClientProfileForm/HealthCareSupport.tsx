'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface HealthcareSupportProps {
  formData: {
    medicare?: string;
    healthFund?: string;
    pension_card_number?: string;
    healthCareCard?: string;
    dvaType?: string;
    dvaNumber?: string;
    companionCard?: string;
    preferredHospital?: string;
    ambulanceNumber?: string;
    disabledParking?: string;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function HealthcareSupport({ formData, handleChange,uuid }: HealthcareSupportProps) {
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
        <h4 className="text-lg font-semibold mb-4 text-heading">HEALTHCARE AND SUPPORT DETAILS</h4>
      </div>

      {/* Card Body */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Medicare */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('medicare')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Medicare</label>
              {hoveredField === 'medicare' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('medicare')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="medicare"
              placeholder="Enter Medicare number"
              value={formData.medicare || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Health Fund */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('healthFund')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Health Fund</label>
              {hoveredField === 'healthFund' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('health_fund')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="healthFund"
              placeholder="Enter health fund name"
              value={formData.healthFund || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Pension Card No. */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('pension_card_number')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Pension Card No.</label>
              {hoveredField === 'pension_card_number' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('pension_card_number')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="pension_card_number"
              placeholder="Enter pension card number"
              value={formData.pension_card_number || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Health Care Card */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('healthCareCard')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Health Care Card</label>
              {hoveredField === 'healthCareCard' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('health_care_card')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="healthCareCard"
              placeholder="Enter health care card number"
              value={formData.healthCareCard || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* DVA Type */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('dvaType')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">DVA Type</label>
              {hoveredField === 'dvaType' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('dva_type')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="dvaType"
              placeholder="Enter DVA type"
              value={formData.dvaType || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* DVA Number */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('dvaNumber')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">DVA Number</label>
              {hoveredField === 'dvaNumber' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('dva_number')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="dvaNumber"
              placeholder="Enter DVA number"
              value={formData.dvaNumber || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Companion Card */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('companionCard')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Companion Card</label>
              {hoveredField === 'companionCard' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('companion_card')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="companionCard"
              placeholder="Enter companion card number"
              value={formData.companionCard || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Preferred Hospital */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('preferredHospital')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Preferred Hospital</label>
              {hoveredField === 'preferredHospital' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('preferred_hospital')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="preferredHospital"
              placeholder="Enter preferred hospital name"
              value={formData.preferredHospital || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Ambulance Number */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('ambulanceNumber')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Ambulance Number</label>
              {hoveredField === 'ambulanceNumber' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('ambulance_number')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="ambulanceNumber"
              placeholder="Enter ambulance number"
              value={formData.ambulanceNumber || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Disabled Parking */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('disabledParking')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Disabled Parking</label>
              {hoveredField === 'disabledParking' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('disabled_parking')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="disabledParking"
              placeholder="Enter disabled parking"
              value={formData.disabledParking || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="healthcare_support_detail"
        field={selectedField}
        url="logs/view"
      />
    </div>
  );
}