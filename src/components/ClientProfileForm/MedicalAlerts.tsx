'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface MedicalAlertsProps {
  formData: {
    epilepsy?: number;
    asthma?: number;
    diabetes?: number;
    allergies?: string;
    medicalHealthInfo?: string;
    diagnosis?: string;
    otherDescription?: string;
    medicationsTaken?: string;
    medicationPurpose?: string;
    staffAdministerMedication?: number;
    self_administered?: number;
    guardian?: number;
    support_worker?: number;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function MedicalAlerts({ formData, handleChange, uuid }: MedicalAlertsProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const yesNoOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 0 },
  ];

  const [localFormData, setLocalFormData] = useState({
    self_administered: formData.self_administered || 0,
    guardian: formData.guardian || 0,
    support_worker: formData.support_worker || 0,
  });

  const handleRadioNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value: parseInt(value),
      },
    });
  };

  const handle1Change = (name: string, value: string | number | boolean) => {
    handleChange({ target: { name, value } });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const newValue = checked ? 1 : 0;
    const newLocalFormData = {
      ...localFormData,
      [name]: newValue,
    };
    setLocalFormData(newLocalFormData);
    handle1Change(name, newValue);
  };

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">MEDICAL ALERTS / ALLERGIES</h4>
      </div>

      <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Epilepsy, Asthma, Diabetes */}
        {['epilepsy', 'asthma', 'diabetes'].map((condition) => (
          <div 
            key={condition}
            className="relative"
            onMouseEnter={() => setHoveredField(condition)}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium capitalize">{condition}</label>
              {hoveredField === condition && (
                <button
                  type='button'
                  onClick={() => handleViewLogs(condition)}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <div className="flex gap-4">
              {yesNoOptions.map(({ label, value }) => (
                <label key={label} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={condition}
                    value={value}
                    checked={formData[condition as keyof typeof formData] === value}
                    onChange={handleRadioNumberChange}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="md:col-span-3 bg-yellow-100 text-yellow-800 p-3 rounded">
          If yes to any of the above, please provide a copy of the current plan less than a year old.
        </div>

        {/* Allergies */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('allergies')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Allergies (Specify)</label>
            {hoveredField === 'allergies' && (
              <button
                type='button'
                onClick={() => handleViewLogs('allergies')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name="allergies"
            placeholder="Enter allergies"
            value={formData.allergies || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        {/* Medical Health Info */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('medicalHealthInfo')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Relevant Medical and Health Information</label>
            {hoveredField === 'medicalHealthInfo' && (
              <button
                type='button'
                onClick={() => handleViewLogs('medical_info')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name="medicalHealthInfo"
            placeholder="Provide any relevant medical history"
            value={formData.medicalHealthInfo || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        {/* Diagnosis */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('diagnosis')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Diagnosis</label>
            {hoveredField === 'diagnosis' && (
              <button
                type='button'
                onClick={() => handleViewLogs('diagnosis')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name="diagnosis"
            placeholder="Enter official diagnosis (if any)"
            value={formData.diagnosis || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        {/* Other Description */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('otherDescription')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Other / Description</label>
            {hoveredField === 'otherDescription' && (
              <button
                type='button'
                onClick={() => handleViewLogs('other_description')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name="otherDescription"
            placeholder="Provide any other details"
            value={formData.otherDescription || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        {/* Medications Taken */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('medicationsTaken')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">What medication does the person take?</label>
            {hoveredField === 'medicationsTaken' && (
              <button
                type='button'
                onClick={() => handleViewLogs('medication_taken')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name="medicationsTaken"
            placeholder="Enter current medications"
            value={formData.medicationsTaken || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        {/* Medication Purpose */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('medicationPurpose')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">What is the medication for?</label>
            {hoveredField === 'medicationPurpose' && (
              <button
                type='button'
                onClick={() => handleViewLogs('medication_purpose')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name="medicationPurpose"
            placeholder="Enter purpose of the medication"
            value={formData.medicationPurpose || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>

        {/* Staff Administer Medication */}
        <div 
          className="md:col-span-3 relative"
          onMouseEnter={() => setHoveredField('staffAdministerMedication')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Is it expected that staff administer any medication?</label>
            {hoveredField === 'staffAdministerMedication' && (
              <button
                type='button'
                onClick={() => handleViewLogs('staff_administer_medication')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <div className="flex gap-4">
            {yesNoOptions.map(({ label, value }) => (
              <label key={label} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="staffAdministerMedication"
                  value={value}
                  checked={formData.staffAdministerMedication === value}
                  onChange={handleRadioNumberChange}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded mt-2">
            If yes, please provide a current medication summary.
          </div>
        </div>

        {/* Administered By */}
        <div 
          className="md:col-span-3 relative"
          onMouseEnter={() => setHoveredField('administered_by')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="font-semibold block">If yes, by whom:</label>
            {hoveredField === 'administered_by' && (
              <div className="flex gap-2">
          <button
            type='button'
            onClick={() => handleViewLogs('self_administered')}
            className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
          >
            Self Administered Logs
          </button>
          <button
            type='button'
            onClick={() => handleViewLogs('guardian')}
            className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
          >
            Guardian Logs
          </button>
          <button
            type='button'
            onClick={() => handleViewLogs('support_worker')}
            className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
          >
            Support Worker Logs
          </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'self_administered', label: 'Self Administered' },
              { name: 'guardian', label: 'Guardian' },
              { name: 'support_worker', label: 'Support Worker' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-2">
          <input
            type="checkbox"
            name={name}
            checked={localFormData[name as keyof typeof localFormData] === 1}
            onChange={handleCheckboxChange}
            className="w-4 h-4"
          />
          {label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="medical_alert"
        field={selectedField}
        url="logs/view"
      />
    </div>
  );
} 