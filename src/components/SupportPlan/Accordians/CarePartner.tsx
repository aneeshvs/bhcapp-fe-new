'use client';
import React, { useState } from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface CarePartnerProps {
  formData: {
    care_partner_name?: string;
    care_partner_role?: string;
    care_partner_contact_phone?: string;
    care_partner_email?: string;
  };
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }
  ) => void;
  uuid?: string;
}

export default function CarePartner({ formData, handleChange, uuid }: CarePartnerProps) {
  const effectiveUuid = uuid || undefined;
  const [hoveredField, setHoveredField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleViewLogs = (fieldName: string) => {
    setSelectedField(fieldName);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Care Partner Name */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('care_partner_name')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Name</label>
            {hoveredField === 'care_partner_name' && (
              <button
                type="button"
                onClick={() => handleViewLogs('care_partner_name')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="care_partner_name"
            placeholder="Enter care partner name"
            value={formData.care_partner_name || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Care Partner Role */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('care_partner_role')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Role</label>
            {hoveredField === 'care_partner_role' && (
              <button
                type="button"
                onClick={() => handleViewLogs('care_partner_role')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="text"
            name="care_partner_role"
            placeholder="Enter role"
            value={formData.care_partner_role || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Care Partner Phone */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('care_partner_contact_phone')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Contact Phone</label>
            {hoveredField === 'care_partner_contact_phone' && (
              <button
                type="button"
                onClick={() => handleViewLogs('care_partner_contact_phone')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="tel"
            name="care_partner_contact_phone"
            placeholder="Enter phone number"
            value={formData.care_partner_contact_phone || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Care Partner Email */}
        <div 
          className="relative"
          onMouseEnter={() => setHoveredField('care_partner_email')}
          onMouseLeave={() => setHoveredField(null)}
        >
          <div className="flex justify-between items-center mb-1">
            <label className="block font-medium">Email</label>
            {hoveredField === 'care_partner_email' && (
              <button
                type="button"
                onClick={() => handleViewLogs('care_partner_email')}
                className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
              >
                View Logs
              </button>
            )}
          </div>
          <input
            type="email"
            name="care_partner_email"
            placeholder="Enter email address"
            value={formData.care_partner_email || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      <FieldLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        uuid={effectiveUuid ?? ""}
        table="support_plan_care_partner"  // Make sure this matches your database table name
        field={selectedField}
        url="logs/view/support"  // Adjust this to your API endpoint
      />
    </div>
  );
}