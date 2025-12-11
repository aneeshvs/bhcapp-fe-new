'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

export interface HealthInformationProps {
  healthInformation: {
    health_conditions: string[]; // array of selected conditions
  };
  setHealthInformation: React.Dispatch<
    React.SetStateAction<{ health_conditions: string[] }>
  >;
  uuid?: string | null;
}

const healthOptions = [
  'Urinary Catheter Management',
  'Intellectual Disability',
  'Spinal Cord Disability/Injury',
  'Bowel Care',
  'Wound Care / Pressure Area Care',
  'Hearing Impairment',
  'Tracheostomy Management',
  'Cerebral Palsy',
  'Subcutaneous Medication Management',
  'Mealtime Support or Dysphagia',
  'Enteral Feeding or Peg Feeding',
  'Ventilator',
  'Medication Support',
  'Other',
];

export default function HealthInformation({
  healthInformation,
  setHealthInformation,
  uuid
}: HealthInformationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const updated = checked
      ? [...healthInformation.health_conditions, value]
      : healthInformation.health_conditions.filter((v) => v !== value);

    setHealthInformation((prev) => ({
      ...prev,
      health_conditions: updated,
    }));
  };

  const handleViewLogs = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">HEALTH INFORMATION</h4>
        <button
          type="button"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleViewLogs}
          className={`text-xs btn-primary text-white px-2 py-1 rounded transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
        >
          View Logs
        </button>
      </div>

      {/* Body */}
      <div className="p-4 bg-white">
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {healthOptions.map((option) => {
            const id = option.toLowerCase().replace(/[^a-z0-9]/g, '-');
            return (
              <div key={option} className="flex items-start space-x-2">
                <input
                  id={id}
                  type="checkbox"
                  className="mt-1"
                  value={option}
                  checked={healthInformation.health_conditions.includes(option)}
                  onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                />
                <label htmlFor={id} className="block font-medium mb-1">
                  {option}
                </label>
              </div>
            );
          })}
        </div>

        {/* Reminder */}
        <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded border border-yellow-300 text-sm">
          If yes to any of the above, please provide a copy of the current plan less than a year old.
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="health_information"
        field="health_conditions"
        url="logs/view"
      />
    </div>
  );
}