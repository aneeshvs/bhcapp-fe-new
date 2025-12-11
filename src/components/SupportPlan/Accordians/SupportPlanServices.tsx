'use client';
import React, { useState } from 'react';
import { destroy } from '@/src/services/crud';
import { useSearchParams } from 'next/navigation';

interface SupportPlanService {
  name: string;
  service_provided: string;
  funded_by: string;
  duration_frequency: string;
  support_to_implement_by_us: number; // stored as number (0 or 1)
  goal_key: string; // Add goal_key to track submitted services
}

interface SupportPlanServicesProps {
  services?: SupportPlanService[];
  setServices?: React.Dispatch<React.SetStateAction<SupportPlanService[]>>;
  uuid?: string;
}

export default function SupportPlanServices({ services = [], setServices, uuid }: SupportPlanServicesProps) {
  const searchParams = useSearchParams();
  const urlUuid = searchParams.get('uuid');
  const effectiveUuid = uuid || urlUuid || undefined;
  
  // Track newly added services that haven't been submitted
  const [unsavedServiceIndexes, setUnsavedServiceIndexes] = useState<Set<number>>(new Set());

  const addService = () => {
    if (!setServices) return;

    const newIndex = services.length;
    setServices([
      ...services,
      {
        name: '',
        service_provided: '',
        funded_by: '',
        duration_frequency: '',
        support_to_implement_by_us: 0,
        goal_key: '', // Empty goal_key for new unsaved services
      },
    ]);
    
    // Track the index of the newly added service
    setUnsavedServiceIndexes(prev => new Set([...prev, newIndex]));
  };

  const removeService = async (index: number) => {
    if (!setServices) return;

    const service = services[index];

    // Check if this service has a goal_key (submitted to backend)
    const hasGoalKey = !!service.goal_key;
    // const isUnsavedService = unsavedServiceIndexes.has(index);

    // Only call API for services that have goal_key (exist in backend)
    if (hasGoalKey && effectiveUuid) {
      try {
        await destroy('formsupport/section/remove', {
          uuid: effectiveUuid,
          table: 'support_plan_service',
          field: 'goal_key', // Use goal_key instead of name
          value: service.goal_key,
        });
      } catch (error) {
        console.error('Failed to remove service from backend:', error);
        // Even if API call fails, remove from local state
        // You might want to show an error message to the user
      }
    }

    // Remove from local state regardless of API call success
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
    
    // Update the unsavedServiceIndexes to adjust indexes
    const updatedIndexes = new Set<number>();
    unsavedServiceIndexes.forEach(unsavedIndex => {
      if (unsavedIndex > index) {
        updatedIndexes.add(unsavedIndex - 1);
      } else if (unsavedIndex < index) {
        updatedIndexes.add(unsavedIndex);
      }
    });
    setUnsavedServiceIndexes(updatedIndexes);
  };

  const updateService = (index: number, field: keyof SupportPlanService, value: string | number | boolean) => {
    if (!setServices) return;
    
    const updated = [...services];

    // Handle checkbox conversion from boolean → number
    if (field === 'support_to_implement_by_us' && typeof value === 'boolean') {
      updated[index] = { ...updated[index], [field]: value ? 1 : 0 };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    setServices(updated);
  };

  // Helper: convert number (0/1) → boolean for checkbox
  const isChecked = (value: number): boolean => value === 1;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Support Plan Services</h3>

      {services.length === 0 ? (
        <p className="text-gray-500">No services added yet.</p>
      ) : (
        services.map((service, index) => (
          <div key={index} className="border p-4 rounded-lg space-y-3 relative">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Service #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeService(index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateService(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Service name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Provided</label>
                <input
                  type="text"
                  value={service.service_provided}
                  onChange={(e) => updateService(index, 'service_provided', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Service provided"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funded By</label>
                <input
                  type="text"
                  value={service.funded_by}
                  onChange={(e) => updateService(index, 'funded_by', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Funding source"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration/Frequency</label>
                <input
                  type="text"
                  value={service.duration_frequency}
                  onChange={(e) => updateService(index, 'duration_frequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 2 hours weekly"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`support-to-implement-${index}`}
                checked={isChecked(service.support_to_implement_by_us)}
                onChange={(e) => updateService(index, 'support_to_implement_by_us', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`support-to-implement-${index}`} className="text-sm text-gray-700">
                Support to implement by us?
              </label>
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        onClick={addService}
        className="btn-primary btn-primary:hover text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Service
      </button>
    </div>
  );
}