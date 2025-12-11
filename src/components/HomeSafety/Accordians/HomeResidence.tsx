'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';
import DatePickerSaveMany from '@/src/components/DatePickerSaveMany'; // Adjust path as needed

interface HomeResidenceTypesFormData {
  residence_house_type?: string;
  residence_other_type?: string;
  assessment_completed_with?: string;
  name?: string;
  position?: string;
  review_date?: string;
  care_facility?: string;
}

interface HomeResidenceTypesProps {
  formData: HomeResidenceTypesFormData;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function HomeResidenceTypesForm({ 
  formData, 
  handleChange, 
  uuid 
}: HomeResidenceTypesProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleChange({
      target: {
        name,
        value,
      },
    });
  };

  const houseTypeOptions = [
    { value: 'Single / Double Storey', label: 'Single / Double Storey' },
    { value: 'Private Rental', label: 'Private Rental' },
    { value: 'Care Facility', label: 'Care Facility' },
  ];

  const otherTypeOptions = [
    { value: 'Unit', label: 'Unit' },
    { value: 'Caravan Park', label: 'Caravan Park' },
    { value: 'Office Housing', label: 'Office Housing' },
  ];

  const assessmentCompletedWithOptions = [
    { value: 'Participant', label: 'Participant' },
    { value: 'Support Worker', label: 'Support Worker' },
    { value: 'Guardian / Next Of Kin', label: 'Guardian / Next Of Kin' },
  ];

  // ✅ Reusable Checkbox (Single Select) Renderer
  const renderCheckboxGroup = (
    fieldName: keyof HomeResidenceTypesFormData,
    label: string,
    options: { value: string; label: string }[]
  ) => (
    <div 
      className="relative"
      onMouseEnter={() => setHoveredField(fieldName)}
      onMouseLeave={() => setHoveredField(null)}
    >
      <div className="flex justify-between items-center mb-1">
        <label className="block font-medium text-gray-700">
          {label}
        </label>
        {hoveredField === fieldName && (
          <button
            type='button'
            onClick={() => handleViewLogs(fieldName)}
            className="text-xs btn-primary text-white px-2 py-1 rounded"
          >
            View Logs
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="checkbox"
              name={fieldName}
              value={option.value}
              checked={formData[fieldName] === option.value}
              onChange={() =>
                handleChange({
                  target: {
                    name: fieldName,
                    value:
                      formData[fieldName] === option.value ? '' : option.value,
                  },
                })
              }
              className="mr-2 accent-blue-600"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );

  // ✅ Reusable Input Field Renderer
  const renderInputField = (
    fieldName: keyof HomeResidenceTypesFormData,
    label: string,
    type: 'text' | 'date' = 'text',
    placeholder?: string
  ) => (
    <div 
      className="relative"
      onMouseEnter={() => setHoveredField(fieldName)}
      onMouseLeave={() => setHoveredField(null)}
    >
      <div className="flex justify-between items-center mb-1">
        <label className="block font-medium text-gray-700">
          {label}
        </label>
        {hoveredField === fieldName && (
          <button
            type='button'
            onClick={() => handleViewLogs(fieldName)}
            className="text-xs btn-primary text-white px-2 py-1 rounded"
          >
            View Logs
          </button>
        )}
      </div>
      <input
        type={type}
        name={fieldName}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        value={formData[fieldName] || ''}
        onChange={handleInputChange}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );

  // ✅ NEW: Reusable DatePicker Field Renderer
  const renderDatePickerField = (
    fieldName: keyof HomeResidenceTypesFormData,
    label: string,
    placeholder?: string
  ) => (
    <div 
      className="relative"
      onMouseEnter={() => setHoveredField(fieldName)}
      onMouseLeave={() => setHoveredField(null)}
    >
      <div className="flex justify-between items-center mb-1">
        <label className="block font-medium text-gray-700">
          {label}
        </label>
        {hoveredField === fieldName && (
          <button
            type='button'
            onClick={() => handleViewLogs(fieldName)}
            className="text-xs btn-primary text-white px-2 py-1 rounded"
          >
            View Logs
          </button>
        )}
      </div>
      <DatePickerSaveMany
        name={fieldName}
        value={formData[fieldName] || null}
        onChange={handleChange}
        placeholder={placeholder || "Select date"}
      />
    </div>
  );

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">HOME RESIDENCE TYPE ASSESSMENT</h4>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Residence Type Section */}
          <div className="md:col-span-2 border-b border-gray-200 pb-4 mb-4">
            <h5 className="font-medium text-gray-700 mb-3">Type of Residence</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderCheckboxGroup('residence_house_type', 'House Type', houseTypeOptions)}
              {renderCheckboxGroup('residence_other_type', 'Other Residence Type', otherTypeOptions)}
            </div>
          </div>

          {/* Assessment Details Section */}
          <div className="md:col-span-2 border-b border-gray-200 pb-4 mb-4">
            <h5 className="font-medium text-gray-700 mb-3">Assessment Details</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderCheckboxGroup('assessment_completed_with', 'Has this assessment been completed with?', assessmentCompletedWithOptions)}
              {renderDatePickerField('review_date', 'Review Date', 'Select review date')}
            </div>
          </div>

          {/* Personnel Details Section */}
          <div className="md:col-span-2 border-b border-gray-200 pb-4 mb-4">
            <h5 className="font-medium text-gray-700 mb-3">Personnel Details</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField('name', 'Name', 'text', 'Enter assessor name')}
              {renderInputField('position', 'Position', 'text', 'Enter assessor position')}
              {renderDatePickerField('review_date', 'Review Date', 'Select review date')}
              {renderInputField('care_facility', 'Care Facility', 'text')}
            </div>
          </div>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="home_safety_residence_type"
        field={selectedField}
        url="home-safety-assessment/logs"
      />
    </div>
  );
}