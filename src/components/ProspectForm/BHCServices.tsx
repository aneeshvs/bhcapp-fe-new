'use client';
import React from 'react';
import { destroy } from '@/src/services/crud'

export interface ServiceRequired {
  service_name: string;
  uuid?: string;
}

interface PreviousServiceRequiredProps {
  serviceRequired: ServiceRequired[];
  setServiceRequired: React.Dispatch<React.SetStateAction<ServiceRequired[]>>;
}

export default function BHCServices({ serviceRequired, setServiceRequired }: PreviousServiceRequiredProps) {
  const handleFieldChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedProviders = [...serviceRequired];
    updatedProviders[index][name as keyof ServiceRequired] = value;
    setServiceRequired(updatedProviders);
  };

  const addProvider = () => {
    setServiceRequired([
      ...serviceRequired,
      { service_name: '' }
    ]);
  };

  const uuidUrl = new URL(window.location.href);
  const uuid = uuidUrl.pathname.split('/').pop();

  const removeProvider = async (index: number) => {
    const providerToRemove = serviceRequired[index];
    
    // Only call API if the provider has a UUID (meaning it's saved in backend)
    // AND we have a form UUID
    if (uuid && providerToRemove.uuid) {
      try {
        await destroy('full-form/remove-item', {
          uuid: uuid,
          table: 'selected_services',
          field: 'uuid', // Use UUID as the identifier
          value: providerToRemove.uuid,
        });
      } catch (error) {
        console.error('Failed to remove service from server:', error);
        // You might want to show an error message to the user here
      }
    }

    // Always remove from local state
    const updatedProviders = [...serviceRequired];
    updatedProviders.splice(index, 1);
    setServiceRequired(updatedProviders);
  };

  return (    
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-heading">Accommodation & Support Details</h2>

      {serviceRequired.map((provider, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded relative">
          <div className='mb-3'>
            <label className="block mb-1 font-medium">Select a Service</label>
            <select
              name="service_name"
              value={provider.service_name || ''}
              onChange={(e) => handleFieldChange(index, e)}
              className="form-control w-full border border-gray-300 rounded px-3 py-2"
              id="accommodationtype"
            >
              <option value="">Select...</option>
              <option value="Community Access">Community Access</option>
              <option value="Home Care">Home Care</option>
              <option value="Day Programs">Day Programs</option>
              <option value="SIL/Respite/SDA/STA/MTA">SIL/Respite/SDA/STA/MTA</option>
              <option value="Household cleaning/maintenance">Household Cleaning/Maintenance</option>
            </select>
          </div>

          {/* Remove button */}
          {serviceRequired.length > 0 && (
            <button
              type="button"
              onClick={() => removeProvider(index)}
              className="absolute top-2 right-2 text-red-500 text-sm"
            >
              ❌ Remove
            </button>
          )}
        </div>
      ))}
     
      <button
        type="button"
        onClick={addProvider}
        className="btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition"
      >
        ➕ Add Another Provider
      </button>
    </div>
  );
}