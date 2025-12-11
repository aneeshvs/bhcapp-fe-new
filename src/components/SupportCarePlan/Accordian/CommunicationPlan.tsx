'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

export interface CommunicationPlanProps {
  communicationPlan?: {
    helps_me_talk: string[];
    helps_me_understand: string[];
    please_communicate_by: string[];
    emergency_communication: string;
  };
  setCommunicationPlan?: React.Dispatch<
    React.SetStateAction<{
      helps_me_talk: string[];
      helps_me_understand: string[];
      please_communicate_by: string[];
      emergency_communication: string;
    }>
  >;
  uuid?: string | null;
}

const talkOptions = [
  'Interpreter',
  'Symbols',
  'Pictures',
  'Gesturing',
  'Facial Expressions',
  'Simple words',
  'When you wait for me to respond',
  'My Supporter/carer',
  'Other (Including Assistive technology)'
];

const understandOptions = [
  'Short plain sentences',
  'Simple words',
  'Concrete examples',
  'Diagrams or pictures',
  'Checking to see if I understand',
  'Asking me to explain it',
  'Asking my supporter/carer to explain it to me',
  'Using real objects',
  'Giving me a demonstration',
  'Other'
];

const communicateByOptions = [
  'Speaking directly to me',
  'Taking time to tell me',
  'Waiting for me to respond',
  'Writing down notes in my care plan',
  'Knowing I cannot talk but can hear and understand',
  'Other'
];

export default function CommunicationPlan({
  communicationPlan,
  setCommunicationPlan,
  uuid
}: CommunicationPlanProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);

  // Debug logging
  console.log('CommunicationPlan component rendered with:', { 
    communicationPlan, 
    hasSetCommunicationPlan: !!setCommunicationPlan,
    uuid 
  });

  const handleCheckboxChange = (field: 'helps_me_talk' | 'helps_me_understand' | 'please_communicate_by', value: string, checked: boolean) => {
    if (!communicationPlan || !setCommunicationPlan) {
      console.log('CommunicationPlan or setCommunicationPlan is missing', { communicationPlan, setCommunicationPlan });
      return;
    }
    
    const currentValues = communicationPlan[field] || [];
    const updated = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    console.log('Checkbox change:', { field, value, checked, currentValues, updated });

    setCommunicationPlan((prev) => ({
      ...prev,
      [field]: updated,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!communicationPlan || !setCommunicationPlan) return;
    setCommunicationPlan((prev) => ({
      ...prev,
      emergency_communication: e.target.value,
    }));
  };

  const handleViewLogs = (field: string) => {
    setActiveField(field);
    setIsModalOpen(true);
  };

  return (
    <div className="mb-4 border border-gray-300 rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-3">
        <h4 className="text-lg font-semibold mb-4 text-heading">COMMUNICATION PLAN</h4>
      </div>

      {/* Body */}
      <div className="p-4 bg-white">
        {/* This Helps Me Talk To You Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-gray-700">This Helps Me Talk To You</h5>
            <button
              type="button"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => handleViewLogs('helps_me_talk')}
              className={`text-xs btn-primary text-white px-2 py-1 rounded transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
            >
              View Logs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {talkOptions.map((option) => {
              const id = `talk-${option.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
              const isChecked = communicationPlan?.helps_me_talk?.includes(option) || false;
              return (
                <div key={option} className="flex items-start space-x-2">
                  <input
                    id={id}
                    type="checkbox" 
                    className="mt-1"
                    value={option}
                    checked={isChecked}
                    onChange={(e) => {
                      console.log('Talk checkbox clicked:', { option, checked: e.target.checked });
                      handleCheckboxChange('helps_me_talk', option, e.target.checked);
                    }}
                  />
                  <label htmlFor={id} className="block font-medium mb-1 text-sm">
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* This is What Helps Me To Understand You Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-gray-700">This is What Helps Me To Understand You</h5>
            <button
              type="button"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => handleViewLogs('helps_me_understand')}
              className={`text-xs btn-primary text-white px-2 py-1 rounded transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
            >
              View Logs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {understandOptions.map((option) => {
              const id = `understand-${option.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
              return (
                <div key={option} className="flex items-start space-x-2">
                  <input
                    id={id}
                    type="checkbox"
                    className="mt-1"
                    value={option}
                    checked={communicationPlan?.helps_me_understand.includes(option)}
                    onChange={(e) => handleCheckboxChange('helps_me_understand', option, e.target.checked)}
                  />
                  <label htmlFor={id} className="block font-medium mb-1 text-sm">
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Please communicate with me by Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-gray-700">Please communicate with me by</h5>
            <button
              type="button"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => handleViewLogs('please_communicate_by')}
              className={`text-xs btn-primary text-white px-2 py-1 rounded transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
            >
              View Logs
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {communicateByOptions.map((option) => {
              const id = `communicate-${option.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
              return (
                <div key={option} className="flex items-start space-x-2">
                  <input
                    id={id}
                    type="checkbox"
                    className="mt-1"
                    value={option}
                    checked={communicationPlan?.please_communicate_by.includes(option)}
                    onChange={(e) => handleCheckboxChange('please_communicate_by', option, e.target.checked)}
                  />
                  <label htmlFor={id} className="block font-medium mb-1 text-sm">
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emergency Communication Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-gray-700">Emergency Communication</h5>
            <button
              type="button"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => handleViewLogs('emergency_communication')}
              className={`text-xs btn-primary text-white px-2 py-1 rounded transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
            >
              View Logs
            </button>
          </div>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            value={communicationPlan?.emergency_communication || ''}
            onChange={handleTextareaChange}
            placeholder="Describe how to communicate with you in an emergency..."
          />
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={uuid ?? null}
        table="support_care_plan_communication"
        field={activeField || ''}
        url="support-care-plan/logs"
      />
    </div>
  );
}