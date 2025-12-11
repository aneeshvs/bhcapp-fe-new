'use client';
import React from 'react';
import { destroy } from '@/src/services/crud'

export interface ServiceProvider {
  provider: string;
  contact_details: string;
  length_of_support: string;
  reason_for_leaving: string;
  uuid?: string;
}

interface PreviousServiceProviderProps {
  serviceProviders: ServiceProvider[];
  setServiceProviders: React.Dispatch<React.SetStateAction<ServiceProvider[]>>;
}

export default function PreviousServiceProvider({ serviceProviders, setServiceProviders }: PreviousServiceProviderProps) {
  const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedProviders = [...serviceProviders];
    updatedProviders[index][name as keyof ServiceProvider] = value;
    setServiceProviders(updatedProviders);
  };

  const addProvider = () => {
    setServiceProviders([
      ...serviceProviders,
      { provider: '', contact_details: '', length_of_support: '', reason_for_leaving: '' }
    ]);
  };

  const uuidUrl = new URL(window.location.href);
  const uuid = uuidUrl.pathname.split('/').pop();

  const removeProvider = async (index: number) => {
    const providerToRemove = serviceProviders[index];
    
    // Only call API if the provider has a UUID (meaning it's saved in backend)
    // AND we have a form UUID
    if (uuid && providerToRemove.uuid) {
      try {
        await destroy('full-form/remove-item', {
          uuid: uuid,
          table: 'previous_service_providers',
          field: 'uuid', // Use UUID as the identifier
          value: providerToRemove.uuid,
        });
      } catch (error) {
        console.error('Failed to remove provider from server:', error);
        // You might want to show an error message to the user here
      }
    }

    // Always remove from local state
    const updatedProviders = [...serviceProviders];
    updatedProviders.splice(index, 1);
    setServiceProviders(updatedProviders);
  };

  return (
    <div className="mb-4 mt-4 border border-gray-300 p-4 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-4 text-heading">Previous Service Providers</h2>

      {serviceProviders.map((provider, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded relative">
          <div className="mb-3">
            <label className="block mb-1 font-medium">Provider</label>
            <input
              type="text"
              name="provider"
              value={provider.provider || ''}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter provider name"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Contact Details</label>
            <input
              type="text"
              name="contact_details"
              value={provider.contact_details || ''}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter contact"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Length of Support</label>
            <input
              type="text"
              name="length_of_support"
              value={provider.length_of_support || ''}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter length"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Reason for Leaving</label>
            <input
              type="text"
              name="reason_for_leaving"
              value={provider.reason_for_leaving || ''}
              onChange={(e) => handleFieldChange(index, e)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Reason for leaving"
            />
          </div>

          {/* Remove button */}
          {serviceProviders.length > 0 && (
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