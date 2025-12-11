'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import DatePickerSaveMany from '../DatePickerSaveMany';

interface PreventiveHealthProps {
  formData: {
    medicalImmunisationStatus?: string;
    lastDentalCheck?: string;
    lastHearingCheck?: string;
    lastVisionCheck?: string;
    vaccineAssistance?: number; // 1 for Yes, 0 for No
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function HealthSummaries({ formData, handleChange, uuid }: PreventiveHealthProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({
      target: {
        name: e.target.name,
        value: e.target.value === 'Yes' ? 1 : 0,
      },
    });
  };

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Card Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">PREVENTIVE HEALTH SUMMARY</h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Medical Check-Up and Immunisation Status */}
          <div 
            className="md:col-span-2 relative"
            onMouseEnter={() => setHoveredField('medicalImmunisationStatus')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Medical Check-Up and Immunisation Status</label>
              {hoveredField === 'medicalImmunisationStatus' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('medical_checkup_status')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="medicalImmunisationStatus"
              placeholder="Enter medical check up and immunisation status"
              value={formData.medicalImmunisationStatus || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Dental Check */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('lastDentalCheck')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Last Dental Check</label>
              {hoveredField === 'lastDentalCheck' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('last_dental_check')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
              name="lastDentalCheck"
              value={formData.lastDentalCheck || null}
              onChange={handleChange}
                          />
            {/* <input
              type="date"
              name="lastDentalCheck"
              value={formData.lastDentalCheck || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Hearing Check */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('lastHearingCheck')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Last Hearing Check</label>
              {hoveredField === 'lastHearingCheck' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('last_hearing_check')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="lastHearingCheck"
                value={formData.lastHearingCheck || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="lastHearingCheck"
              value={formData.lastHearingCheck || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Vision Check */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('lastVisionCheck')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Last Vision Check</label>
              {hoveredField === 'lastVisionCheck' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('last_vision_check')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <DatePickerSaveMany
                name="lastVisionCheck"
                value={formData.lastVisionCheck || null}
                onChange={handleChange}
              />
            {/* <input
              type="date"
              name="lastVisionCheck"
              value={formData.lastVisionCheck || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            /> */}
          </div>

          {/* Vaccine Assistance */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('vaccineAssistance')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">
                Requires assistance for vaccinations?
              </label>
              {hoveredField === 'vaccineAssistance' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('requires_vaccination_assistance')}
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
                  name="vaccineAssistance"
                  value="Yes"
                  checked={formData.vaccineAssistance === 1}
                  onChange={handleRadioChange}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="vaccineAssistance"
                  value="No"
                  checked={formData.vaccineAssistance === 0}
                  onChange={handleRadioChange}
                />
                No
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="preventive_health_summary"
        field={selectedField}
        url="logs/view"
      />
    </div>
  );
}