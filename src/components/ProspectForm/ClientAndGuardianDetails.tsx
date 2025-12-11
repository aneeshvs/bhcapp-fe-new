'use client';
import React from 'react';
import { useState, useEffect } from "react";

interface ClientAndGuardianFormData {
    formData: {
        full_name?: string;
        date_of_birth?: string;
        gender?: string;
        residential_address?: string;
        mobile?: string;
        home_phone?: string;
        work_phone?: string;
        email?: string;
        atsi_status?: string;
        cultural_background?: string;
        language_spoken?: string;
        interpreter_required?: number;
        guardian_name?: string;
        is_public_guardian?: string;
        guardian_relationship?: string;
        guardian_mobile?: string;
        guardian_email?: string;
        guardian_address?: string;
        guardian_contact_method?: string;
        // [key: string]: any; // Optional: allows extra dynamic fields
    };
    handleChange: (
    event:
        | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        | { target: { name: string; value: string | number | boolean  } }
    ) => void;
}

export default function ClientAndGuardianDetails({ formData, handleChange }: ClientAndGuardianFormData) {
  const [selectedPhoneTypes, setSelectedPhoneTypes] = useState<string[]>([]);
  const [showPhoneTypeSelect, setShowPhoneTypeSelect] = useState(false);

  const contactPhoneOptions = [
    { label: 'Home Phone', value: 'home_phone' },
    { label: 'Work Phone', value: 'work_phone' },
  ];

  // Initialize selected phone types from existing form data
  useEffect(() => {
    const existingPhoneTypes = contactPhoneOptions
      .filter(opt => formData[opt.value as keyof typeof formData])
      .map(opt => opt.value);
    
    setSelectedPhoneTypes(existingPhoneTypes);
  }, []);

  const availablePhoneOptions = contactPhoneOptions.filter(
    (opt) => !selectedPhoneTypes.includes(opt.value)
  );

  const handleAddPhoneType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    if (type && !selectedPhoneTypes.includes(type)) {
      setSelectedPhoneTypes((prev) => [...prev, type]);
    }
    setShowPhoneTypeSelect(false); // Hide dropdown after selection
  };

  const handleRemovePhoneType = (type: string) => {
    setSelectedPhoneTypes((prev) => prev.filter(t => t !== type));
    // Clear the value when removing the field
    handleChange({ target: { name: type, value: '' } });
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-heading">1. Client Details</h2>

      {/* Client Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="mb-3">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            maxLength={50}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Gender</label>
          <div className="flex flex-wrap gap-4">
            {['Male', 'Female', 'Other'].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Residential Address</label>
          <input
            type="text"
            name="residential_address"
            value={formData.residential_address || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Mobile</label>
          <div className="flex gap-2">
            <input
              type="tel"
              name="mobile"
              value={formData.mobile || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {availablePhoneOptions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPhoneTypeSelect(true)}
                className="px-3 py-2 bg-green-500 text-white rounded"
              >
                +
              </button>
            )}
          </div>

          {showPhoneTypeSelect && (
            <select
              className="w-full mt-2 border border-gray-300 rounded px-3 py-2"
              onChange={handleAddPhoneType}
              defaultValue=""
            >
              <option value="">Select Contact Type</option>
              {availablePhoneOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {selectedPhoneTypes.map((type) => (
            <div key={type} className="mt-2 flex items-center gap-2">
              <input
                type="tel"
                name={type}
                value={formData[type as keyof typeof formData] as string || ''}
                onChange={handleChange}
                placeholder={contactPhoneOptions.find((opt) => opt.value === type)?.label || ''}
                className="flex-1 border border-gray-300 rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoneType(type)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">ATSI Status</label>
          <div className="flex flex-wrap gap-4">
            {['Aboriginal', 'Torres Strait Islander', 'Neither', 'Both'].map((status) => (
              <label key={status} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="atsi_status"
                  value={status}
                  checked={formData.atsi_status === status}
                  onChange={handleChange}
                />
                {status}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Cultural Background</label>
          <input
            type="text"
            name="cultural_background"
            value={formData.cultural_background || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Language Spoken</label>
          <input
            type="text"
            name="language_spoken"
            value={formData.language_spoken || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Interpreter Required</label>
          <select
            name="interpreter_required"
            value={formData.interpreter_required ? 1 : 0}
            onChange={(e) =>
              handleChange({ target: { name: 'interpreter_required', value: parseInt(e.target.value) } })
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>

      {/* Guardian Details */}
      <h3 className="text-sm sm:text-md font-semibold mt-6 mb-2 text-heading">• Guardian Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-3">
          <label className="block mb-1 font-medium">Guardian Name</label>
          <input
            type="text"
            name="guardian_name"
            value={formData.guardian_name || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Guardian Status</label>
          <select
            name="is_public_guardian"
            value={formData.is_public_guardian ?? 'No'}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option value="Public Guardian">Public Guardian</option>
            <option value="Temporary Guardian">Temporary Guardian</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Guardian Relationship</label>
          <input
            type="text"
            name="guardian_relationship"
            value={formData.guardian_relationship || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Guardian Mobile</label>
          <input
            type="tel"
            name="guardian_mobile"
            value={formData.guardian_mobile || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Guardian Email</label>
          <input
            type="email"
            name="guardian_email"
            value={formData.guardian_email || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Guardian Address</label>
          <input
            type="text"
            name="guardian_address"
            value={formData.guardian_address || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Guardian Contact Method</label>
          <select
            name="guardian_contact_method"
            value={formData.guardian_contact_method || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select...</option>
            <option value="Phone">Phone</option>
            <option value="Email">Email</option>
            <option value="In-Person">In-Person</option>
          </select>
        </div>
      </div>
    </div>
  );
}