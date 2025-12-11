'use client';
import React, { useState, useEffect } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface SupportInfoProps {
  formData: {
    communicationAssist?: number;
    mealtimePlan?: string;
    likes?: string;
    dislikes?: string;
    interests?: string;
    male?: number;
    female?: number;
    no_preference?: number;
    specialRequest?: string;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function SupportInformation({ formData, handleChange, uuid }: SupportInfoProps) {
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const [localFormData, setLocalFormData] = useState({
    male: formData.male || 0,
    female: formData.female || 0,
    no_preference: formData.no_preference || 0,
  });

  // Sync local state with formData
  useEffect(() => {
    setLocalFormData({
      male: formData.male || 0,
      female: formData.female || 0,
      no_preference: formData.no_preference || 0,
    });
  }, [formData.male, formData.female, formData.no_preference]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange({
      target: {
        name: e.target.name,
        value: e.target.value === 'Yes' ? 1 : 0,
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
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">SUPPORT INFORMATION</h4>
      </div>

      {/* Body */}
      <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Communication Assistance */}
        <div 
          className="md:col-span-2 relative"
          onMouseEnter={() => setHoveredField('communicationAssist')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Do you require assistance with communication?</label>
            {hoveredField === 'communicationAssist' && (
              <button
                type='button'
                onClick={() => handleViewLogs('communication_assistance_required')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="communicationAssist"
                value="Yes"
                checked={formData.communicationAssist === 1}
                onChange={handleRadioChange}
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="communicationAssist"
                value="No"
                checked={formData.communicationAssist === 0}
                onChange={handleRadioChange}
              />
              No
            </label>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Communication support is needed with hearing, comprehension, and vision. (Languages other than English)
            <br />
            <strong>** Refer to Communication Plan if Needed</strong>
          </p>
        </div>

        {/* Mealtime Plan */}
        <div 
          className="md:col-span-2 relative"
          onMouseEnter={() => setHoveredField('mealtimePlan')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Do you have a mealtime management plan that includes dietary or modification requirements?</label>
            {hoveredField === 'mealtimePlan' && (
              <button
                type='button'
                onClick={() => handleViewLogs('mealtime_plan')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="mealtimePlan"
            placeholder="Enter details"
            value={formData.mealtimePlan || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Likes */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('likes')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Likes</label>
            {hoveredField === 'likes' && (
              <button
                type='button'
                onClick={() => handleViewLogs('likes')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="likes"
            placeholder="Enter Likes"
            value={formData.likes || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Dislikes */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('dislikes')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Dislikes</label>
            {hoveredField === 'dislikes' && (
              <button
                type='button'
                onClick={() => handleViewLogs('dislikes')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="dislikes"
            placeholder="Enter Dislikes"
            value={formData.dislikes || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Interests */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('interests')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Interests</label>
            {hoveredField === 'interests' && (
              <button
                type='button'
                onClick={() => handleViewLogs('interests')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="interests"
            value={formData.interests || ''}
            onChange={handleChange}
            placeholder="e.g. Gardening, Craft, Reading"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Preferred Worker */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('preferredWorker')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="font-semibold block">Preferred Worker</label>
            {hoveredField === 'preferredWorker' && (
              <div className="flex gap-2">
                <button
                  type='button'
                  onClick={() => handleViewLogs('male')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  Male Logs
                </button>
                <button
                  type='button'
                  onClick={() => handleViewLogs('female')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  Female Logs
                </button>
                <button
                  type='button'
                  onClick={() => handleViewLogs('no_preference')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  No Preference Logs
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'male', label: 'Male' },
              { name: 'female', label: 'Female' },
              { name: 'no_preference', label: 'No Preference' },
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

        {/* Special Request */}
        <div 
          className="md:col-span-2 relative"
          onMouseEnter={() => setHoveredField('specialRequest')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Any Special Request</label>
            {hoveredField === 'specialRequest' && (
              <button
                type='button'
                onClick={() => handleViewLogs('special_request')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <textarea
            name="specialRequest"
            placeholder="Enter Requests"
            value={formData.specialRequest || ''}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2"
          ></textarea>
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="support_information"
        field={selectedField}
        url="logs/view"
      />
    </div>
  );
}