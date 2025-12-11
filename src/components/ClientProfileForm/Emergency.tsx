'use client';
import React, {useState} from 'react';
import FieldLogsModal from '@/src/components/FieldLogsModal';

interface EmergencyContactProps {
  formData: {
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    emergencyPhone?: string;
    emergencyMobile?: string;
    emergencyWork?: string;
  };
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string | number | boolean } }
  ) => void;
  uuid?: string | null;
}

export default function Emergency({ formData, handleChange, uuid }: EmergencyContactProps) {
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
        <h4 className="text-lg font-semibold mb-4 text-heading">ALTERNATIVE / EMERGENCY CONTACTS</h4>
      </div>

      {/* Card Body */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('emergencyContactName')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Name</label>
              {hoveredField === 'emergencyContactName' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('name')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="emergencyContactName"
              placeholder="Enter name"
              value={formData.emergencyContactName || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Relationship */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('emergencyContactRelationship')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Relationship with Client</label>
              {hoveredField === 'emergencyContactRelationship' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('relationship')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="text"
              name="emergencyContactRelationship"
              placeholder="e.g. Friend, Parent"
              value={formData.emergencyContactRelationship || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Phone */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('emergencyPhone')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Phone</label>
              {hoveredField === 'emergencyPhone' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('phone')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="tel"
              name="emergencyPhone"
              placeholder="Enter phone number"
              value={formData.emergencyPhone || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Mobile */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('emergencyMobile')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Mobile</label>
              {hoveredField === 'emergencyMobile' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('mobile')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="tel"
              name="emergencyMobile"
              placeholder="Enter mobile number"
              value={formData.emergencyMobile || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Work Contact */}
          <div 
            className="relative"
            onMouseEnter={() => setHoveredField('emergencyWork')}
            onMouseLeave={() => setHoveredField(null)}
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block font-medium">Work Contact</label>
              {hoveredField === 'emergencyWork' && (
                <button
                  type='button'
                  onClick={() => handleViewLogs('work_contact')}
                  className="text-xs btn-primary btn-primary:hover text-white px-2 py-1 rounded"
                >
                  View Logs
                </button>
              )}
            </div>
            <input
              type="tel"
              name="emergencyWork"
              placeholder="Enter work contact number"
              value={formData.emergencyWork || ''}
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
        table="emergency_contact"
        field={selectedField}
        url="logs/view"
      />
    </div>
  );
}