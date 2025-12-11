'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface DiagnosisProps {
  formData: {
    primaryDiagnosis?: string;
    secondaryDiagnosis?: string;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function DiagnosisSummary({ formData, handleChange, uuid }: DiagnosisProps) {
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
        <h4 className="text-lg font-semibold mb-4 text-heading">DIAGNOSIS SUMMARY</h4>
      </div>

      {/* Card Body */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primary Diagnosis */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('primaryDiagnosis')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Primary Diagnosis</label>
              {hoveredField === 'primaryDiagnosis' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('primary_diagnosis')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="primaryDiagnosis"
              value={formData.primaryDiagnosis || ''}
              onChange={handleChange}
              placeholder="Enter primary diagnosis"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Secondary Diagnosis */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('secondaryDiagnosis')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Secondary Diagnosis</label>
              {hoveredField === 'secondaryDiagnosis' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('secondary_diagnosis')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="secondaryDiagnosis"
              value={formData.secondaryDiagnosis || ''}
              onChange={handleChange}
              placeholder="Enter secondary diagnosis"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="diagnosis_summary"
        field={selectedField}
        url="logs/view"
      />
    </div>
  );
}